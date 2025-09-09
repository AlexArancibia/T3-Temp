import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { RBACService } from "@/services/rbacService";
import { PermissionAction, PermissionResource } from "@/types/rbac";

const t = initTRPC
  .context<{
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName?: string;
    };
  }>()
  .create();

export const rbacRouter = t.router({
  // Get all roles
  getAllRoles: t.procedure.query(async () => {
    return await RBACService.getAllRoles();
  }),

  // Get all permissions
  getAllPermissions: t.procedure.query(async () => {
    return await RBACService.getAllPermissions();
  }),

  // Get user roles
  getUserRoles: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.getUserRoles(input.userId);
    }),

  // Get user permissions
  getUserPermissions: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.getUserPermissions(input.userId);
    }),

  // Check user permission
  checkPermission: t.procedure
    .input(
      z.object({
        userId: z.string(),
        action: z.nativeEnum(PermissionAction),
        resource: z.nativeEnum(PermissionResource),
      }),
    )
    .query(async ({ input }) => {
      return await RBACService.hasPermission(
        input.userId,
        input.action,
        input.resource,
      );
    }),

  // Check user role
  checkRole: t.procedure
    .input(
      z.object({
        userId: z.string(),
        roleName: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await RBACService.hasRole(input.userId, input.roleName);
    }),

  // Create role
  createRole: t.procedure
    .input(
      z.object({
        name: z.string().min(1),
        displayName: z.string().min(1),
        description: z.string().optional(),
        isSystem: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user has permission to create roles
      if (ctx.user?.id) {
        const canCreateRole = await RBACService.hasPermission(
          ctx.user.id,
          PermissionAction.CREATE,
          PermissionResource.ROLE,
        );
        if (!canCreateRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to create roles",
          });
        }
      }

      return await RBACService.createRole(input);
    }),

  // Create permission
  createPermission: t.procedure
    .input(
      z.object({
        action: z.nativeEnum(PermissionAction),
        resource: z.nativeEnum(PermissionResource),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user has permission to create permissions
      if (ctx.user?.id) {
        const canCreatePermission = await RBACService.hasPermission(
          ctx.user.id,
          PermissionAction.CREATE,
          PermissionResource.PERMISSION,
        );
        if (!canCreatePermission) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to create permissions",
          });
        }
      }

      return await RBACService.createPermission(input);
    }),

  // Assign role to user
  assignRole: t.procedure
    .input(
      z.object({
        userId: z.string(),
        roleId: z.string(),
        assignedBy: z.string().optional(),
        expiresAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user has permission to assign roles
      if (ctx.user?.id) {
        const canAssignRole = await RBACService.hasPermission(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.ROLE,
        );
        if (!canAssignRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to assign roles",
          });
        }
      }

      return await RBACService.assignRole(
        input.userId,
        input.roleId,
        input.assignedBy,
        input.expiresAt,
      );
    }),

  // Remove role from user
  removeRole: t.procedure
    .input(
      z.object({
        userId: z.string(),
        roleId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user has permission to remove roles
      if (ctx.user?.id) {
        const canRemoveRole = await RBACService.hasPermission(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.ROLE,
        );
        if (!canRemoveRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to remove roles",
          });
        }
      }

      await RBACService.removeRole(input.userId, input.roleId);
      return { success: true };
    }),

  // Assign permission to role
  assignPermissionToRole: t.procedure
    .input(
      z.object({
        roleId: z.string(),
        permissionId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user has permission to manage roles
      if (ctx.user?.id) {
        const canManageRole = await RBACService.hasPermission(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.ROLE,
        );
        if (!canManageRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to manage role permissions",
          });
        }
      }

      await RBACService.assignPermissionToRole(
        input.roleId,
        input.permissionId,
      );
      return { success: true };
    }),

  // Remove permission from role
  removePermissionFromRole: t.procedure
    .input(
      z.object({
        roleId: z.string(),
        permissionId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user has permission to manage roles
      if (ctx.user?.id) {
        const canManageRole = await RBACService.hasPermission(
          ctx.user.id,
          PermissionAction.UPDATE,
          PermissionResource.ROLE,
        );
        if (!canManageRole) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to manage role permissions",
          });
        }
      }

      await RBACService.removePermissionFromRole(
        input.roleId,
        input.permissionId,
      );
      return { success: true };
    }),

  // Get role by name
  getRoleByName: t.procedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.getRoleByName(input.name);
    }),

  // Get permission by action and resource
  getPermissionByActionAndResource: t.procedure
    .input(
      z.object({
        action: z.nativeEnum(PermissionAction),
        resource: z.nativeEnum(PermissionResource),
      }),
    )
    .query(async ({ input }) => {
      return await RBACService.getPermissionByActionAndResource(
        input.action,
        input.resource,
      );
    }),

  // Check if user is admin
  isAdmin: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.isAdmin(input.userId);
    }),

  // Check if user is super admin
  isSuperAdmin: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.isSuperAdmin(input.userId);
    }),

  // Check if user can manage users
  canManageUsers: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.canManageUsers(input.userId);
    }),

  // Check if user can manage roles
  canManageRoles: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.canManageRoles(input.userId);
    }),

  // Check if user can access admin panel
  canAccessAdmin: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.canAccessAdmin(input.userId);
    }),

  // Check if user can manage trading accounts
  canManageTradingAccounts: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.canManageTradingAccounts(input.userId);
    }),

  // Check if user can manage trades
  canManageTrades: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.canManageTrades(input.userId);
    }),

  // Check if user can view dashboard
  canViewDashboard: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.canViewDashboard(input.userId);
    }),

  // Get RBAC context for user
  getRBACContext: t.procedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await RBACService.getRBACContext(input.userId);
    }),
});
