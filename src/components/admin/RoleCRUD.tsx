"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// import type { Role as RoleType } from "@/types/rbac";
import { Edit, Plus, Search, Shield, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PermissionAction, PermissionResource } from "@/types/rbac";
import { trpc } from "@/utils/trpc";

const roleSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  displayName: z
    .string()
    .min(2, "Nombre de visualización debe tener al menos 2 caracteres"),
  description: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  rolePermissions?: Array<{
    permission: {
      id: string;
      action: string;
      resource: string;
    };
  }>;
}

export default function RoleCRUD() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: roles = [], refetch: refetchRoles } =
    trpc.rbac.getAllRoles.useQuery();
  const { data: permissions = [] } = trpc.rbac.getAllPermissions.useQuery();

  const createRole = trpc.rbac.createRole.useMutation({
    onSuccess: () => {
      refetchRoles();
      setIsCreateModalOpen(false);
      form.reset();
      setSelectedPermissions([]);
    },
  });

  const updateRole = trpc.rbac.updateRole.useMutation({
    onSuccess: () => {
      refetchRoles();
      setEditingRole(null);
      form.reset();
      setSelectedPermissions([]);
    },
  });

  const deleteRole = trpc.rbac.deleteRole.useMutation({
    onSuccess: () => {
      refetchRoles();
    },
  });

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
    },
  });

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description &&
        role.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.reset({
      name: role.name,
      displayName: role.displayName || role.name,
      description: role.description || "",
    });
    setSelectedPermissions(
      (role.rolePermissions || []).map((rp) => rp.permission.id),
    );
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
    setEditingRole(null);
    form.reset();
    setSelectedPermissions([]);
  };

  const onSubmit = (data: RoleFormData) => {
    if (editingRole) {
      updateRole.mutate({
        id: editingRole.id,
        ...data,
        isSystem: false,
      });
    } else {
      createRole.mutate({
        ...data,
        isSystem: false,
      });
    }
  };

  const handleDelete = (roleId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este rol?")) {
      deleteRole.mutate({ id: roleId });
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const getPermissionText = (
    action: PermissionAction,
    resource: PermissionResource,
  ) => {
    const actionText = {
      [PermissionAction.CREATE]: "Crear",
      [PermissionAction.READ]: "Leer",
      [PermissionAction.UPDATE]: "Actualizar",
      [PermissionAction.DELETE]: "Eliminar",
      [PermissionAction.MANAGE]: "Gestionar",
    };

    const resourceText = {
      [PermissionResource.USER]: "Usuarios",
      [PermissionResource.ROLE]: "Roles",
      [PermissionResource.PERMISSION]: "Permisos",
      [PermissionResource.TRADING_ACCOUNT]: "Cuentas Trading",
      [PermissionResource.TRADE]: "Trades",
      [PermissionResource.PROPFIRM]: "Prop Firms",
      [PermissionResource.BROKER]: "Brokers",
      [PermissionResource.SYMBOL]: "Símbolos",
      [PermissionResource.SUBSCRIPTION]: "Suscripciones",
      [PermissionResource.DASHBOARD]: "Dashboard",
      [PermissionResource.ADMIN]: "Administración",
    };

    return `${actionText[action]} ${resourceText[resource]}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Roles</h2>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Rol</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permisos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {role.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {role.description || "Sin descripción"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(role.rolePermissions || [])
                        .slice(0, 3)
                        .map((rolePermission) => (
                          <span
                            key={rolePermission.permission.id}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {getPermissionText(
                              rolePermission.permission
                                .action as PermissionAction,
                              rolePermission.permission
                                .resource as PermissionResource,
                            )}
                          </span>
                        ))}
                      {(role.rolePermissions || []).length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          +{(role.rolePermissions || []).length - 3} más
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleEdit(role);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(role.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingRole) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingRole(null);
            form.reset();
            setSelectedPermissions([]);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingRole(null);
                form.reset();
                setSelectedPermissions([]);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 pr-8">
              {editingRole ? "Editar Rol" : "Nuevo Rol"}
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Rol (ID)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="admin, user, trader" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Visualización</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Administrador, Usuario, Trader"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Permissions Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Permisos</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          {getPermissionText(
                            permission.action as PermissionAction,
                            permission.resource as PermissionResource,
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingRole(null);
                      form.reset();
                      setSelectedPermissions([]);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createRole.isPending || updateRole.isPending}
                  >
                    {editingRole ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
