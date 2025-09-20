"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Shield, Trash2, X } from "lucide-react";
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
import type {
  TableAction,
  TableColumn,
} from "@/components/ui/scrollable-table";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { usePagination } from "@/hooks/usePagination";
import type { Permission } from "@/types/rbac";
import { trpc } from "@/utils/trpc";

const roleSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  displayName: z
    .string()
    .min(2, "Nombre de visualización debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isSystem: boolean;
  rolePermissions?: Array<{
    permission: {
      id: string;
      action: string;
      resource: string;
      description: string | null;
    };
  }>;
}

export default function RolesPage() {
  const [editingRole, setEditingRole] = useState<Partial<Role> | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const pagination = usePagination({ defaultLimit: 10 });
  const { search, setSearch, sortBy, sortOrder, setSortBy, setSortOrder } =
    pagination;
  const queryParams = pagination.getQueryParams();

  const {
    data: response,
    refetch,
    error,
    isLoading,
  } = trpc.rbac.getAllRoles.useQuery(queryParams);

  const { data: permissionsResponse } = trpc.rbac.getAllPermissions.useQuery({
    page: 1,
    limit: 100,
  });

  const createRole = trpc.rbac.createRole.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
      form.reset();
    },
  });

  const updateRole = trpc.rbac.updateRole.useMutation({
    onSuccess: () => {
      refetch();
      setEditingRole(null);
      form.reset();
    },
  });

  const deleteRole = trpc.rbac.deleteRole.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      permissionIds: [],
    },
  });

  const roles = response?.data || [];
  const permissions = permissionsResponse?.data || [];

  const paginationInfo = response?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.reset({
      name: role.name || "",
      displayName: role.displayName || "",
      description: role.description || "",
      permissionIds: role.rolePermissions?.map((rp) => rp.permission.id) || [],
    });
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
    setEditingRole(null);
    form.reset();
  };

  const onSubmit = (data: RoleFormData) => {
    if (editingRole) {
      updateRole.mutate({
        id: editingRole.id!,
        ...data,
      });
    } else {
      createRole.mutate(data);
    }
  };

  const handleDelete = (role: Role) => {
    if (confirm("¿Estás seguro de que quieres eliminar este rol?")) {
      deleteRole.mutate({ id: role.id });
    }
  };

  const handleSort = (sortByField: string, sortOrderField: "asc" | "desc") => {
    setSortBy(sortByField);
    setSortOrder(sortOrderField);
  };

  // Definir columnas de la tabla
  const columns: TableColumn<Role>[] = [
    {
      key: "name",
      title: "Rol",
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
            <Shield className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {record.displayName}
            </div>
            <div className="text-sm text-gray-500">{record.name}</div>
          </div>
        </div>
      ),
    },
    {
      key: "permissions",
      title: "Permisos",
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.rolePermissions?.slice(0, 3).map((rp) => (
            <span
              key={rp.permission.id}
              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
            >
              {rp.permission.action}:{rp.permission.resource}
            </span>
          ))}
          {(record.rolePermissions?.length || 0) > 3 && (
            <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              +{(record.rolePermissions?.length || 0) - 3} más
            </span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Creado",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
      className: "text-sm text-gray-500",
    },
  ];

  // Definir acciones de la tabla
  const actions: TableAction<Role>[] = [
    {
      label: "Editar",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
      variant: "default",
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-amber-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Roles</h1>
        </div>
      </div>

      {/* Tabla con ScrollableTable */}
      <ScrollableTable<Role>
        data={roles}
        columns={columns}
        loading={isLoading}
        error={error?.message || null}
        pagination={paginationInfo}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar roles..."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSort}
        actions={actions}
        headerActions={
          <Button
            onClick={handleCreate}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Rol</span>
          </Button>
        }
        emptyMessage="No se encontraron roles"
        emptyIcon={<Shield className="h-12 w-12 text-gray-400" />}
      />

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingRole) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingRole(null);
            form.reset();
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
                      <FormLabel>Nombre del Rol</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="admin, user, viewer..."
                        />
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
                          placeholder="Administrador, Usuario, Visualizador..."
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
                        <Input {...field} placeholder="Descripción del rol" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissionIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permisos</FormLabel>
                      <FormControl>
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
                          {permissions.map((permission: Permission) => (
                            <label
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  field.value?.includes(permission.id) || false
                                }
                                onChange={(e) => {
                                  const currentValues = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...currentValues,
                                      permission.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (id: string) => id !== permission.id,
                                      ),
                                    );
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {permission.action}:{permission.resource}
                                </span>
                                {permission.description && (
                                  <p className="text-xs text-gray-500">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingRole(null);
                      form.reset();
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
