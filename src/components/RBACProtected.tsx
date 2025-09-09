"use client";

import React from "react";
import { useRBAC } from "@/hooks/useRBAC";
import {
  PermissionAction,
  type PermissionCheck,
  PermissionResource,
} from "@/types/rbac";

interface RBACProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  // Permission-based access
  action?: PermissionAction;
  resource?: PermissionResource;
  permissions?: PermissionCheck[];
  requireAll?: boolean; // If true, requires ALL permissions; if false, requires ANY permission
  // Role-based access
  roles?: string[];
  requireAllRoles?: boolean; // If true, requires ALL roles; if false, requires ANY role
  // Quick access checks
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  requireUserManagement?: boolean;
  requireRoleManagement?: boolean;
  requireTradingAccountManagement?: boolean;
  requireTradeManagement?: boolean;
  requireDashboardAccess?: boolean;
}

export default function RBACProtected({
  children,
  fallback = (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600">
        You don't have permission to access this content.
      </p>
    </div>
  ),
  action,
  resource,
  permissions,
  requireAll = false,
  roles,
  requireAllRoles = false,
  requireAdmin = false,
  requireSuperAdmin = false,
  requireUserManagement = false,
  requireRoleManagement = false,
  requireTradingAccountManagement = false,
  requireTradeManagement = false,
  requireDashboardAccess = false,
}: RBACProtectedProps) {
  const {
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isSuperAdmin,
    canManageUsers,
    canManageRoles,
    canManageTradingAccounts,
    canManageTrades,
    canViewDashboard,
    isLoading,
  } = useRBAC();

  // Show loading state
  if (isLoading) {
    return <div className="p-4">Loading permissions...</div>;
  }

  // Check role-based access
  if (roles && roles.length > 0) {
    const hasRequiredRoles = requireAllRoles
      ? hasAllRoles(roles)
      : hasAnyRole(roles);

    if (!hasRequiredRoles) {
      return <>{fallback}</>;
    }
  }

  // Check permission-based access
  if (action && resource) {
    if (!hasPermission(action, resource)) {
      return <>{fallback}</>;
    }
  }

  if (permissions && permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  // Check quick access flags
  if (requireSuperAdmin && !isSuperAdmin) {
    return <>{fallback}</>;
  }

  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>;
  }

  if (requireUserManagement && !canManageUsers) {
    return <>{fallback}</>;
  }

  if (requireRoleManagement && !canManageRoles) {
    return <>{fallback}</>;
  }

  if (requireTradingAccountManagement && !canManageTradingAccounts) {
    return <>{fallback}</>;
  }

  if (requireTradeManagement && !canManageTrades) {
    return <>{fallback}</>;
  }

  if (requireDashboardAccess && !canViewDashboard) {
    return <>{fallback}</>;
  }

  // If no specific requirements, allow access
  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RBACProtected requireAdmin fallback={fallback}>
      {children}
    </RBACProtected>
  );
}

export function SuperAdminOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RBACProtected requireSuperAdmin fallback={fallback}>
      {children}
    </RBACProtected>
  );
}

export function UserManagementOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RBACProtected requireUserManagement fallback={fallback}>
      {children}
    </RBACProtected>
  );
}

export function RoleManagementOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RBACProtected requireRoleManagement fallback={fallback}>
      {children}
    </RBACProtected>
  );
}

export function TradingAccountManagementOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RBACProtected requireTradingAccountManagement fallback={fallback}>
      {children}
    </RBACProtected>
  );
}

export function TradeManagementOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RBACProtected requireTradeManagement fallback={fallback}>
      {children}
    </RBACProtected>
  );
}

export function DashboardAccessOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RBACProtected requireDashboardAccess fallback={fallback}>
      {children}
    </RBACProtected>
  );
}
