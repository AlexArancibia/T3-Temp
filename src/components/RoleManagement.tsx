"use client";

import React, { useState } from "react";
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/lib/trpc";
import { PermissionAction, PermissionResource } from "@/types/rbac";

interface RoleManagementProps {
  userId?: string;
}

export default function RoleManagement({ userId }: RoleManagementProps) {
  const { canManageRoles, canManageUsers } = useRBAC();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedPermission, setSelectedPermission] = useState<string>("");

  // Queries
  const { data: roles, isLoading: rolesLoading } =
    trpc.rbac.getAllRoles.useQuery();
  const { data: permissions, isLoading: permissionsLoading } =
    trpc.rbac.getAllPermissions.useQuery();
  const { data: userRoles, isLoading: userRolesLoading } =
    trpc.rbac.getUserRoles.useQuery(
      { userId: userId || "" },
      { enabled: !!userId },
    );

  // Mutations
  const assignRoleMutation = trpc.rbac.assignRole.useMutation();
  const removeRoleMutation = trpc.rbac.removeRole.useMutation();
  const assignPermissionMutation =
    trpc.rbac.assignPermissionToRole.useMutation();
  const removePermissionMutation =
    trpc.rbac.removePermissionFromRole.useMutation();

  if (!canManageRoles && !canManageUsers) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          You don't have permission to manage roles and users.
        </p>
      </div>
    );
  }

  const handleAssignRole = async (roleId: string) => {
    if (!userId) return;

    try {
      await assignRoleMutation.mutateAsync({
        userId,
        roleId,
        assignedBy: "current-user", // In real app, get from auth context
      });
      // Refetch user roles
      window.location.reload(); // Simple refresh, in real app use query invalidation
    } catch (error) {
      console.error("Failed to assign role:", error);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!userId) return;

    try {
      await removeRoleMutation.mutateAsync({ userId, roleId });
      // Refetch user roles
      window.location.reload();
    } catch (error) {
      console.error("Failed to remove role:", error);
    }
  };

  const handleAssignPermission = async (
    roleId: string,
    permissionId: string,
  ) => {
    try {
      await assignPermissionMutation.mutateAsync({ roleId, permissionId });
      // Refetch roles
      window.location.reload();
    } catch (error) {
      console.error("Failed to assign permission:", error);
    }
  };

  const handleRemovePermission = async (
    roleId: string,
    permissionId: string,
  ) => {
    try {
      await removePermissionMutation.mutateAsync({ roleId, permissionId });
      // Refetch roles
      window.location.reload();
    } catch (error) {
      console.error("Failed to remove permission:", error);
    }
  };

  if (rolesLoading || permissionsLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* User Role Management */}
      {userId && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Roles</h3>

          {userRolesLoading ? (
            <p>Loading user roles...</p>
          ) : (
            <div className="space-y-2">
              {userRoles?.map((userRole) => (
                <div
                  key={userRole.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <span className="font-medium">
                    {userRole.role.displayName}
                  </span>
                  <button
                    onClick={() => handleRemoveRole(userRole.roleId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    disabled={removeRoleMutation.isPending}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border rounded"
                >
                  <option value="">Select a role to assign</option>
                  {roles
                    ?.filter(
                      (role) => !userRoles?.some((ur) => ur.roleId === role.id),
                    )
                    .map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.displayName}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => selectedRole && handleAssignRole(selectedRole)}
                  disabled={!selectedRole || assignRoleMutation.isPending}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Assign Role
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Role Permission Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Role Permissions</h3>

        <div className="space-y-4">
          {roles?.map((role) => (
            <div key={role.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{role.displayName}</h4>
                <span className="text-sm text-gray-500">
                  {role.rolePermissions?.length || 0} permissions
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={selectedPermission}
                    onChange={(e) => setSelectedPermission(e.target.value)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="">Select a permission to assign</option>
                    {permissions
                      ?.filter(
                        (permission) =>
                          !role.rolePermissions?.some(
                            (rp) => rp.permissionId === permission.id,
                          ),
                      )
                      .map((permission) => (
                        <option key={permission.id} value={permission.id}>
                          {permission.action} {permission.resource}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() =>
                      selectedPermission &&
                      handleAssignPermission(role.id, selectedPermission)
                    }
                    disabled={
                      !selectedPermission || assignPermissionMutation.isPending
                    }
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {role.rolePermissions?.map((rolePermission) => (
                    <div
                      key={rolePermission.id}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded text-sm"
                    >
                      <span>
                        {rolePermission.permission.action}{" "}
                        {rolePermission.permission.resource}
                      </span>
                      <button
                        onClick={() =>
                          handleRemovePermission(
                            role.id,
                            rolePermission.permissionId,
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                        disabled={removePermissionMutation.isPending}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permission List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">All Permissions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions?.map((permission) => (
            <div key={permission.id} className="p-3 border rounded">
              <div className="font-medium text-sm">
                {permission.action} {permission.resource}
              </div>
              {permission.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {permission.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
