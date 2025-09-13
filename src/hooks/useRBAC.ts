import {
  PermissionAction,
  type PermissionCheck,
  PermissionResource,
} from "@/types/rbac";
import { trpc } from "@/utils/trpc";
import { useAuth } from "./useAuth";

export function useRBAC() {
  const { user } = useAuth();

  // Get user roles
  const { data: userRoles, isLoading: rolesLoading } =
    trpc.rbac.getUserRoles.useQuery(
      { userId: user?.id || "" },
      { enabled: !!user?.id },
    );

  // Get user permissions
  const { data: userPermissions, isLoading: permissionsLoading } =
    trpc.rbac.getUserPermissions.useQuery(
      { userId: user?.id || "" },
      { enabled: !!user?.id },
    );

  // Check if user is admin
  const { data: isAdmin, isLoading: adminLoading } = trpc.rbac.isAdmin.useQuery(
    { userId: user?.id || "" },
    { enabled: !!user?.id },
  );

  // Check if user is super admin
  const { data: isSuperAdmin, isLoading: superAdminLoading } =
    trpc.rbac.isSuperAdmin.useQuery(
      { userId: user?.id || "" },
      { enabled: !!user?.id },
    );

  // Check if user can manage users
  const { data: canManageUsers, isLoading: manageUsersLoading } =
    trpc.rbac.canManageUsers.useQuery(
      { userId: user?.id || "" },
      { enabled: !!user?.id },
    );

  // Check if user can manage roles
  const { data: canManageRoles, isLoading: manageRolesLoading } =
    trpc.rbac.canManageRoles.useQuery(
      { userId: user?.id || "" },
      { enabled: !!user?.id },
    );

  // Check if user can access admin panel
  const { data: canAccessAdmin, isLoading: accessAdminLoading } =
    trpc.rbac.canAccessAdmin.useQuery(
      { userId: user?.id || "" },
      { enabled: !!user?.id },
    );

  // Check if user can manage trading accounts
  const {
    data: canManageTradingAccounts,
    isLoading: manageTradingAccountsLoading,
  } = trpc.rbac.canManageTradingAccounts.useQuery(
    { userId: user?.id || "" },
    { enabled: !!user?.id },
  );

  // Check if user can manage trades
  const { data: canManageTrades, isLoading: manageTradesLoading } =
    trpc.rbac.canManageTrades.useQuery(
      { userId: user?.id || "" },
      { enabled: !!user?.id },
    );

  // Check if user can view dashboard
  const { data: canViewDashboard, isLoading: viewDashboardLoading } =
    trpc.rbac.canViewDashboard.useQuery(
      { userId: user?.id || "" },
      { enabled: !!user?.id },
    );

  const isLoading =
    rolesLoading || permissionsLoading || adminLoading || superAdminLoading;

  return {
    // Data
    userRoles: userRoles || [],
    userPermissions: userPermissions || [],

    // Status checks
    isAdmin: isAdmin || false,
    isSuperAdmin: isSuperAdmin || false,
    canManageUsers: canManageUsers || false,
    canManageRoles: canManageRoles || false,
    canAccessAdmin: canAccessAdmin || false,
    canManageTradingAccounts: canManageTradingAccounts || false,
    canManageTrades: canManageTrades || false,
    canViewDashboard: canViewDashboard || false,

    // Loading states
    isLoading,
    rolesLoading,
    permissionsLoading,
    adminLoading,
    superAdminLoading,
    manageUsersLoading,
    manageRolesLoading,
    accessAdminLoading,
    manageTradingAccountsLoading,
    manageTradesLoading,
    viewDashboardLoading,

    // Utility functions
    hasPermission: (action: PermissionAction, resource: PermissionResource) => {
      if (!userPermissions) return false;
      return userPermissions.some(
        (permission) =>
          permission.action === action &&
          permission.resource === resource &&
          permission.isActive,
      );
    },

    hasRole: (roleName: string) => {
      if (!userRoles) return false;
      return userRoles.some((role) => role.name === roleName && role.isActive);
    },

    hasAnyRole: (roleNames: string[]) => {
      if (!userRoles) return false;
      return userRoles.some(
        (role) => roleNames.includes(role.name) && role.isActive,
      );
    },

    hasAllRoles: (roleNames: string[]) => {
      if (!userRoles) return false;
      return roleNames.every((roleName) =>
        userRoles.some((role) => role.name === roleName && role.isActive),
      );
    },

    hasAnyPermission: (permissionChecks: PermissionCheck[]) => {
      if (!userPermissions) return false;
      return permissionChecks.some((check) =>
        userPermissions.some(
          (permission) =>
            permission.action === check.action &&
            permission.resource === check.resource &&
            permission.isActive,
        ),
      );
    },

    hasAllPermissions: (permissionChecks: PermissionCheck[]) => {
      if (!userPermissions) return false;
      return permissionChecks.every((check) =>
        userPermissions.some(
          (permission) =>
            permission.action === check.action &&
            permission.resource === check.resource &&
            permission.isActive,
        ),
      );
    },
  };
}
