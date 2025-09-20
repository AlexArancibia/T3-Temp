"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit,
  RefreshCw,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthContext } from "@/AuthContext";
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
import { useRBAC } from "@/hooks/useRBAC";
import { trpc } from "@/utils/trpc";

const updateUserSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  password: z
    .string()
    .min(6, "Contraseña debe tener al menos 6 caracteres")
    .optional(),
});

type UserFormData = z.infer<typeof updateUserSchema>;

interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// Component to show user roles in table cell
function UserRolesCell({ userId }: { userId: string }) {
  const { data: userRoles, isLoading } = trpc.user.getUserRoles.useQuery(
    { userId },
    {
      staleTime: 30000, // Cache for 30 seconds
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) {
    return <span className="text-gray-400">Cargando...</span>;
  }

  if (!userRoles || userRoles.length === 0) {
    return <span className="text-gray-400">Sin roles</span>;
  }

  const activeRoles = userRoles.filter((role) => role.isActive);

  if (activeRoles.length === 0) {
    return <span className="text-gray-400">Sin roles activos</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {activeRoles.slice(0, 2).map((userRole) => (
        <span
          key={userRole.id}
          className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
        >
          {userRole.roleDisplayName}
        </span>
      ))}
      {activeRoles.length > 2 && (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
          +{activeRoles.length - 2}
        </span>
      )}
    </div>
  );
}

// Component for managing user roles in edit modal
function UserRolesManager({ userId }: { userId: string }) {
  const {
    data: availableRoles = [],
    isLoading: rolesLoading,
    error: rolesError,
  } = trpc.rbac.getRoles.useQuery();
  const { data: userRoles, refetch: refetchUserRoles } =
    trpc.user.getUserRoles.useQuery({ userId }, { enabled: !!userId });

  const assignRole = trpc.user.assignRole.useMutation({
    onSuccess: () => {
      refetchUserRoles();
    },
    onError: (error) => {
      console.error("Error assigning role:", error.message);
    },
  });

  const removeRole = trpc.user.removeRole.useMutation({
    onSuccess: () => {
      refetchUserRoles();
    },
    onError: (error) => {
      console.error("Error removing role:", error.message);
    },
  });

  const handleAssignRole = (roleId: string) => {
    assignRole.mutate({
      userId,
      roleId,
    });
  };

  const handleRemoveRole = (roleId: string) => {
    removeRole.mutate({
      userId,
      roleId,
    });
  };

  if (!userId) {
    return <div className="text-gray-400">Usuario no seleccionado</div>;
  }

  // Debug logs (temporary)
  console.log("UserRolesManager Debug:", {
    userId,
    availableRoles: availableRoles?.length,
    userRoles: userRoles?.length,
    availableRolesData: availableRoles,
    rolesLoading,
    rolesError: rolesError?.message,
  });

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {/* Current Roles */}
      <div>
        <h5 className="text-sm font-medium mb-2">Roles Asignados</h5>
        {userRoles && userRoles.length > 0 ? (
          <div className="space-y-2">
            {userRoles.map((userRole) => (
              <div
                key={userRole.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {userRole.roleDisplayName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {userRole.roleDescription}
                  </div>
                  {userRole.expiresAt && (
                    <div className="text-xs text-orange-600">
                      Expira:{" "}
                      {new Date(userRole.expiresAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveRole(userRole.roleId)}
                  disabled={removeRole.isPending}
                  className="ml-2 h-6 w-6 p-0"
                >
                  <UserX className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay roles asignados</p>
        )}
      </div>

      {/* Available Roles */}
      <div>
        <h5 className="text-sm font-medium mb-2">Roles Disponibles</h5>
        {rolesLoading ? (
          <p className="text-sm text-gray-500">Cargando roles...</p>
        ) : rolesError ? (
          <p className="text-sm text-red-500">
            Error cargando roles: {rolesError.message}
          </p>
        ) : availableRoles && availableRoles.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableRoles
              .filter(
                (role) =>
                  role.isActive &&
                  !userRoles?.some((ur) => ur.roleId === role.id),
              )
              .map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {role.displayName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {role.description}
                    </div>
                    {role.isSystem && (
                      <span className="inline-flex px-1 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 mt-1">
                        Sistema
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAssignRole(role.id)}
                    disabled={assignRole.isPending}
                    className="ml-2 h-6 w-6 p-0"
                  >
                    <UserCheck className="h-3 w-3" />
                  </Button>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            <p>No hay roles disponibles</p>
            <p className="text-xs mt-1">
              Roles totales: {availableRoles?.length || 0}
            </p>
            <p className="text-xs">
              Roles del usuario: {userRoles?.length || 0}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const { canManageUsers } = useRBAC();
  const { user: currentUser } = useAuthContext();

  const pagination = usePagination({ defaultLimit: 10 });
  const { search, setSearch, sortBy, sortOrder, setSortBy, setSortOrder } =
    pagination;
  const queryParams = pagination.getQueryParams();

  const {
    data: response,
    refetch,
    error,
    isLoading,
  } = trpc.user.getAll.useQuery(queryParams);

  const updateUser = trpc.user.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingUser(null);
      form.reset();
      // TODO: Add toast notification for success
    },
    onError: (error) => {
      // TODO: Add toast notification for error
      console.error("Error updating user:", error.message);
    },
  });

  const deleteUser = trpc.user.delete.useMutation({
    onSuccess: () => {
      refetch();
      // TODO: Add toast notification for success
    },
    onError: (error) => {
      // TODO: Add toast notification for error
      console.error("Error deleting user:", error.message);
    },
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const users = response?.data || [];
  const paginationInfo = response?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
      email: user.email || "",
      name: user.name || "",
      password: "",
    });
  };

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      const updateData = {
        id: editingUser.id,
        email: data.email,
        name: data.name,
        ...(data.password &&
          data.password.trim() !== "" && { password: data.password }),
      };

      updateUser.mutate(updateData);
    }
  };

  const handleDelete = (user: User) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      deleteUser.mutate({ id: user.id });
    }
  };

  const handleSort = (sortByField: string, sortOrderField: "asc" | "desc") => {
    setSortBy(sortByField);
    setSortOrder(sortOrderField);
  };

  // Definir columnas de la tabla
  const columns: TableColumn<User>[] = [
    {
      key: "name",
      title: "Usuario",
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-blue-600">
              {record.name?.charAt(0) || ""}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {record.name}
            </div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "emailVerified",
      title: "Estado",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value ? "Confirmado" : "Pendiente"}
        </span>
      ),
    },
    {
      key: "roles",
      title: "Roles",
      sortable: false,
      render: (_, record) => <UserRolesCell userId={record.id} />,
      className: "text-sm",
    },
    {
      key: "createdAt",
      title: "Creado",
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString(),
      className: "text-sm text-gray-500",
    },
  ];

  // Definir acciones de la tabla
  const actions: TableAction<User>[] = [
    {
      label: "Editar",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
      variant: "default",
      // Solo mostrar si es administrador o si es el usuario actual
      hidden: (user: User) => !(canManageUsers || user.id === currentUser?.id),
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
      // Solo mostrar si es administrador o si es el usuario actual
      hidden: (user: User) => !(canManageUsers || user.id === currentUser?.id),
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Actualizar</span>
        </Button>
      </div>

      {/* Tabla con ScrollableTable */}
      <ScrollableTable<User>
        data={users}
        columns={columns}
        loading={isLoading}
        error={error?.message || null}
        pagination={paginationInfo}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar usuarios..."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSort}
        actions={actions}
        emptyMessage="No se encontraron usuarios"
        emptyIcon={<Users className="h-12 w-12 text-gray-400" />}
      />

      {/* Edit Modal */}
      {editingUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
          onClick={() => {
            setEditingUser(null);
            form.reset();
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setEditingUser(null);
                form.reset();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-6 pr-8">
              Editar Usuario - {editingUser.name}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - User Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 border-b pb-2">
                  Información Personal
                </h4>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre Completo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Contraseña{" "}
                            {editingUser &&
                              "(dejar vacío para mantener la actual)"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-start space-x-2 pt-4">
                      <Button type="submit" disabled={updateUser.isPending}>
                        Actualizar Información
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>

              {/* Right Column - Roles Management */}
              {canManageUsers && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 border-b pb-2">
                    Gestión de Roles
                  </h4>
                  <UserRolesManager userId={editingUser.id || ""} />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingUser(null);
                  form.reset();
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
