import { prisma } from "@/lib/db";
import type { PermissionCheck, RBACContext } from "@/types/rbac";
import {
  DEFAULT_ROLES,
  PermissionAction,
  PermissionResource,
} from "@/types/rbac";

// Use Prisma types directly
type Role = {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
  rolePermissions?: Array<{
    permission: {
      id: string;
      action: string;
      resource: string;
      description: string | null;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
};

type Permission = {
  id: string;
  action: string;
  resource: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type UserRole = {
  id: string;
  userId: string;
  roleId: string;
  role: Role;
  assignedAt: Date;
  assignedBy: string | null;
  expiresAt: Date | null;
};

export class RBACService {
  /**
   * Get all RBAC data for a user in a single optimized query
   */
  static async getUserRBACData(userId: string): Promise<{
    roles: Role[];
    permissions: Permission[];
  }> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const roles = userRoles
      .map((ur) => ur.role)
      .filter((role) => role.isActive);
    const permissions = new Map<string, Permission>();

    roles.forEach((role) => {
      role.rolePermissions?.forEach((rp) => {
        if (rp.permission.isActive) {
          permissions.set(rp.permission.id, rp.permission);
        }
      });
    });

    return {
      roles: roles,
      permissions: Array.from(permissions.values()),
    };
  }

  /**
   * Get all roles for a user
   */
  static async getUserRoles(userId: string): Promise<Role[]> {
    const { roles } = await this.getUserRBACData(userId);
    return roles;
  }

  /**
   * Get all permissions for a user (from their roles)
   */
  static async getUserPermissions(userId: string): Promise<Permission[]> {
    const { permissions } = await this.getUserRBACData(userId);
    return permissions;
  }

  /**
   * Check if user has a specific permission
   */
  static async hasPermission(
    userId: string,
    action: PermissionAction,
    resource: PermissionResource,
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);

    return permissions.some(
      (permission) =>
        permission.action === action.toString() &&
        permission.resource === resource.toString() &&
        permission.isActive,
    );
  }

  /**
   * Check if user has any of the specified permissions
   */
  static async hasAnyPermission(
    userId: string,
    permissionChecks: PermissionCheck[],
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);

    return permissionChecks.some((check) =>
      permissions.some(
        (permission) =>
          permission.action === check.action.toString() &&
          permission.resource === check.resource.toString() &&
          permission.isActive,
      ),
    );
  }

  /**
   * Check if user has all of the specified permissions
   */
  static async hasAllPermissions(
    userId: string,
    permissionChecks: PermissionCheck[],
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);

    return permissionChecks.every((check) =>
      permissions.some(
        (permission) =>
          permission.action === check.action.toString() &&
          permission.resource === check.resource.toString() &&
          permission.isActive,
      ),
    );
  }

  /**
   * Check if user has a specific role
   */
  static async hasRole(userId: string, roleName: string): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);
    return userRoles.some((role) => role.name === roleName && role.isActive);
  }

  /**
   * Check if user has any of the specified roles
   */
  static async hasAnyRole(
    userId: string,
    roleNames: string[],
  ): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);
    return userRoles.some(
      (role) => roleNames.includes(role.name) && role.isActive,
    );
  }

  /**
   * Get RBAC context for a user (optimized)
   */
  static async getRBACContext(userId: string): Promise<RBACContext> {
    const { roles, permissions } = await this.getUserRBACData(userId);

    // Convert string enums to proper types
    const convertedPermissions = permissions.map((permission) => ({
      ...permission,
      action: permission.action as PermissionAction,
      resource: permission.resource as PermissionResource,
    }));

    return {
      userId,
      userRoles: roles,
      permissions: convertedPermissions,
    };
  }

  /**
   * Assign role to user
   */
  static async assignRole(
    userId: string,
    roleId: string,
    assignedBy?: string,
    expiresAt?: Date,
  ): Promise<UserRole> {
    return await prisma.userRole.create({
      data: {
        userId,
        roleId,
        assignedBy,
        expiresAt,
      },
      include: {
        role: true,
      },
    });
  }

  /**
   * Remove role from user
   */
  static async removeRole(userId: string, roleId: string): Promise<void> {
    await prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });
  }

  /**
   * Create a new role
   */
  static async createRole(data: {
    name: string;
    displayName: string;
    description?: string;
    isSystem?: boolean;
  }): Promise<Role> {
    return await prisma.role.create({
      data,
    });
  }

  static async updateRole(data: {
    id: string;
    name?: string;
    displayName?: string;
    description?: string;
    isSystem?: boolean;
  }): Promise<Role> {
    return await prisma.role.update({
      where: { id: data.id },
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        isSystem: data.isSystem,
      },
    });
  }

  static async deleteRole(id: string): Promise<boolean> {
    await prisma.role.delete({
      where: { id },
    });
    return true;
  }

  /**
   * Create a new permission
   */
  static async createPermission(data: {
    action: PermissionAction;
    resource: PermissionResource;
    description?: string;
  }): Promise<Permission> {
    return await prisma.permission.create({
      data: {
        action: data.action.toString() as PermissionAction,
        resource: data.resource.toString() as PermissionResource,
        description: data.description,
      },
    });
  }

  /**
   * Assign permission to role
   */
  static async assignPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  /**
   * Remove permission from role
   */
  static async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });
  }

  /**
   * Get all roles
   */
  static async getAllRoles(): Promise<Role[]> {
    return await prisma.role.findMany({
      where: { isActive: true },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get all permissions
   */
  static async getAllPermissions(): Promise<Permission[]> {
    return await prisma.permission.findMany({
      where: { isActive: true },
      orderBy: [{ resource: "asc" }, { action: "asc" }],
    });
  }

  /**
   * Get permissions for a specific role
   */
  static async getRolePermissions(roleId: string) {
    return await prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: true,
      },
      orderBy: {
        permission: {
          resource: "asc",
        },
      },
    });
  }

  /**
   * Get role by name
   */
  static async getRoleByName(name: string): Promise<Role | null> {
    return await prisma.role.findUnique({
      where: { name },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  /**
   * Get permission by action and resource
   */
  static async getPermissionByActionAndResource(
    action: PermissionAction,
    resource: PermissionResource,
  ): Promise<Permission | null> {
    return await prisma.permission.findUnique({
      where: {
        action_resource: {
          action: action.toString() as PermissionAction,
          resource: resource.toString() as PermissionResource,
        },
      },
    });
  }

  /**
   * Check if user is super admin
   */
  static async isSuperAdmin(userId: string): Promise<boolean> {
    return await this.hasRole(userId, DEFAULT_ROLES.SUPER_ADMIN);
  }

  /**
   * Check if user is admin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    return await this.hasAnyRole(userId, [
      DEFAULT_ROLES.SUPER_ADMIN,
      DEFAULT_ROLES.ADMIN,
    ]);
  }

  /**
   * Check if user can manage users
   */
  static async canManageUsers(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.MANAGE,
      PermissionResource.USER,
    );
  }

  /**
   * Check if user can manage roles
   */
  static async canManageRoles(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.MANAGE,
      PermissionResource.ROLE,
    );
  }

  /**
   * Check if user can access admin panel
   */
  static async canAccessAdmin(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.MANAGE,
      PermissionResource.ADMIN,
    );
  }

  /**
   * Check if user can manage trading accounts
   */
  static async canManageTradingAccounts(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.MANAGE,
      PermissionResource.TRADING_ACCOUNT,
    );
  }

  /**
   * Check if user can manage trades
   */
  static async canManageTrades(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.MANAGE,
      PermissionResource.TRADE,
    );
  }

  /**
   * Check if user can view dashboard
   */
  static async canViewDashboard(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.READ,
      PermissionResource.DASHBOARD,
    );
  }

  /**
   * Check if user can manage propfirms
   */
  static async canManagePropfirms(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.MANAGE,
      PermissionResource.PROPFIRM,
    );
  }

  /**
   * Check if user can create propfirms
   */
  static async canCreatePropfirms(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.CREATE,
      PermissionResource.PROPFIRM,
    );
  }

  /**
   * Check if user can update propfirms
   */
  static async canUpdatePropfirms(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.UPDATE,
      PermissionResource.PROPFIRM,
    );
  }

  /**
   * Check if user can delete propfirms
   */
  static async canDeletePropfirms(userId: string): Promise<boolean> {
    return await this.hasPermission(
      userId,
      PermissionAction.DELETE,
      PermissionResource.PROPFIRM,
    );
  }
}
