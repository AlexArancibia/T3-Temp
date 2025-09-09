"use client";

import React from "react";
import { useRBAC } from "@/hooks/useRBAC";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import RBACProtected, {
  AdminOnly,
  DashboardAccessOnly,
  RoleManagementOnly,
  SuperAdminOnly,
  TradeManagementOnly,
  TradingAccountManagementOnly,
  UserManagementOnly,
} from "./RBACProtected";

export default function RBACExample() {
  const {
    userRoles,
    userPermissions,
    isAdmin,
    isSuperAdmin,
    canManageUsers,
    canManageRoles,
    hasPermission,
    isLoading,
  } = useRBAC();

  if (isLoading) {
    return <div className="p-4">Loading RBAC data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">RBAC System Example</h1>

      {/* User Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Access Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Roles</h3>
            <div className="space-y-1">
              {userRoles.map((role) => (
                <div
                  key={role.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {role.displayName}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Quick Status</h3>
            <div className="space-y-1 text-sm">
              <div
                className={`px-2 py-1 rounded ${isSuperAdmin ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-600"}`}
              >
                Super Admin: {isSuperAdmin ? "Yes" : "No"}
              </div>
              <div
                className={`px-2 py-1 rounded ${isAdmin ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-600"}`}
              >
                Admin: {isAdmin ? "Yes" : "No"}
              </div>
              <div
                className={`px-2 py-1 rounded ${canManageUsers ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
              >
                Can Manage Users: {canManageUsers ? "Yes" : "No"}
              </div>
              <div
                className={`px-2 py-1 rounded ${canManageRoles ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"}`}
              >
                Can Manage Roles: {canManageRoles ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Examples */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Permission Examples</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium mb-2">User Management</h3>
            <div className="space-y-1 text-sm">
              <div>
                Create Users:{" "}
                {hasPermission(PermissionAction.CREATE, PermissionResource.USER)
                  ? "✅"
                  : "❌"}
              </div>
              <div>
                Read Users:{" "}
                {hasPermission(PermissionAction.READ, PermissionResource.USER)
                  ? "✅"
                  : "❌"}
              </div>
              <div>
                Update Users:{" "}
                {hasPermission(PermissionAction.UPDATE, PermissionResource.USER)
                  ? "✅"
                  : "❌"}
              </div>
              <div>
                Delete Users:{" "}
                {hasPermission(PermissionAction.DELETE, PermissionResource.USER)
                  ? "✅"
                  : "❌"}
              </div>
            </div>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-medium mb-2">Trading Accounts</h3>
            <div className="space-y-1 text-sm">
              <div>
                Create Accounts:{" "}
                {hasPermission(
                  PermissionAction.CREATE,
                  PermissionResource.TRADING_ACCOUNT,
                )
                  ? "✅"
                  : "❌"}
              </div>
              <div>
                Read Accounts:{" "}
                {hasPermission(
                  PermissionAction.READ,
                  PermissionResource.TRADING_ACCOUNT,
                )
                  ? "✅"
                  : "❌"}
              </div>
              <div>
                Update Accounts:{" "}
                {hasPermission(
                  PermissionAction.UPDATE,
                  PermissionResource.TRADING_ACCOUNT,
                )
                  ? "✅"
                  : "❌"}
              </div>
              <div>
                Delete Accounts:{" "}
                {hasPermission(
                  PermissionAction.DELETE,
                  PermissionResource.TRADING_ACCOUNT,
                )
                  ? "✅"
                  : "❌"}
              </div>
            </div>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-medium mb-2">Trades</h3>
            <div className="space-y-1 text-sm">
              <div>
                Create Trades:{" "}
                {hasPermission(
                  PermissionAction.CREATE,
                  PermissionResource.TRADE,
                )
                  ? "✅"
                  : "❌"}
              </div>
              <div>
                Read Trades:{" "}
                {hasPermission(PermissionAction.READ, PermissionResource.TRADE)
                  ? "✅"
                  : "❌"}
              </div>
              <div>
                Update Trades:{" "}
                {hasPermission(
                  PermissionAction.UPDATE,
                  PermissionResource.TRADE,
                )
                  ? "✅"
                  : "❌"}
              </div>
              <div>
                Delete Trades:{" "}
                {hasPermission(
                  PermissionAction.DELETE,
                  PermissionResource.TRADE,
                )
                  ? "✅"
                  : "❌"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protected Content Examples */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Protected Content Examples
        </h2>

        <div className="space-y-4">
          {/* Admin Only Content */}
          <AdminOnly
            fallback={
              <div className="p-3 bg-gray-100 rounded text-gray-600">
                Admin content is hidden
              </div>
            }
          >
            <div className="p-3 bg-green-100 rounded text-green-800">
              🎉 This content is only visible to admins!
            </div>
          </AdminOnly>

          {/* Super Admin Only Content */}
          <SuperAdminOnly
            fallback={
              <div className="p-3 bg-gray-100 rounded text-gray-600">
                Super admin content is hidden
              </div>
            }
          >
            <div className="p-3 bg-red-100 rounded text-red-800">
              🔥 This content is only visible to super admins!
            </div>
          </SuperAdminOnly>

          {/* User Management Only Content */}
          <UserManagementOnly
            fallback={
              <div className="p-3 bg-gray-100 rounded text-gray-600">
                User management content is hidden
              </div>
            }
          >
            <div className="p-3 bg-blue-100 rounded text-blue-800">
              👥 This content is only visible to users who can manage users!
            </div>
          </UserManagementOnly>

          {/* Role Management Only Content */}
          <RoleManagementOnly
            fallback={
              <div className="p-3 bg-gray-100 rounded text-gray-600">
                Role management content is hidden
              </div>
            }
          >
            <div className="p-3 bg-purple-100 rounded text-purple-800">
              🛡️ This content is only visible to users who can manage roles!
            </div>
          </RoleManagementOnly>

          {/* Trading Account Management Only Content */}
          <TradingAccountManagementOnly
            fallback={
              <div className="p-3 bg-gray-100 rounded text-gray-600">
                Trading account management content is hidden
              </div>
            }
          >
            <div className="p-3 bg-yellow-100 rounded text-yellow-800">
              💼 This content is only visible to users who can manage trading
              accounts!
            </div>
          </TradingAccountManagementOnly>

          {/* Trade Management Only Content */}
          <TradeManagementOnly
            fallback={
              <div className="p-3 bg-gray-100 rounded text-gray-600">
                Trade management content is hidden
              </div>
            }
          >
            <div className="p-3 bg-indigo-100 rounded text-indigo-800">
              📈 This content is only visible to users who can manage trades!
            </div>
          </TradeManagementOnly>

          {/* Dashboard Access Only Content */}
          <DashboardAccessOnly
            fallback={
              <div className="p-3 bg-gray-100 rounded text-gray-600">
                Dashboard content is hidden
              </div>
            }
          >
            <div className="p-3 bg-teal-100 rounded text-teal-800">
              📊 This content is only visible to users who can access the
              dashboard!
            </div>
          </DashboardAccessOnly>

          {/* Custom Permission Check */}
          <RBACProtected
            action={PermissionAction.MANAGE}
            resource={PermissionResource.ADMIN}
            fallback={
              <div className="p-3 bg-gray-100 rounded text-gray-600">
                Admin panel access is hidden
              </div>
            }
          >
            <div className="p-3 bg-pink-100 rounded text-pink-800">
              ⚙️ This content requires MANAGE ADMIN permission!
            </div>
          </RBACProtected>

          {/* Multiple Permissions Check */}
          <RBACProtected
            permissions={[
              {
                action: PermissionAction.CREATE,
                resource: PermissionResource.TRADE,
              },
              {
                action: PermissionAction.READ,
                resource: PermissionResource.TRADING_ACCOUNT,
              },
            ]}
            requireAll={false} // Requires ANY of the permissions
            fallback={
              <div className="p-3 bg-gray-100 rounded text-gray-600">
                Trading content is hidden
              </div>
            }
          >
            <div className="p-3 bg-cyan-100 rounded text-cyan-800">
              🚀 This content requires CREATE TRADE OR READ TRADING_ACCOUNT
              permission!
            </div>
          </RBACProtected>
        </div>
      </div>

      {/* All Permissions List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Permissions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {userPermissions.map((permission) => (
            <div key={permission.id} className="p-2 bg-gray-50 rounded text-sm">
              <span className="font-medium">{permission.action}</span>{" "}
              {permission.resource}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
