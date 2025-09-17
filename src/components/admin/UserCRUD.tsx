"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Search, Trash2, Users, X } from "lucide-react";
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
import type { User } from "@/types/user";
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

// Usando la interfaz User consolidada de @/types/user

export default function UserCRUD() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const {
    data: users = [],
    refetch,
    error,
    isLoading,
  } = trpc.user.getAll.useQuery();
  const updateUser = trpc.user.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingUser(null);
      form.reset();
    },
    onError: () => {
      // Error handled silently
    },
  });
  const deleteUser = trpc.user.delete.useMutation({
    onSuccess: () => {
      refetch();
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

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (user: Partial<User>) => {
    setEditingUser(user);
    form.reset({
      email: user.email || "",
      name: user.name || "",
      password: "",
    });
  };

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      // For updates, only send password if it's provided
      const updateData = {
        email: data.email,
        name: data.name,
        ...(data.password &&
          data.password.trim() !== "" && { password: data.password }),
      };

      updateUser.mutate(updateData);
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      deleteUser.mutate({ id: userId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Gestión de Usuarios
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500">Cargando usuarios...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            Error al cargar usuarios: {error.message}
          </p>
        </div>
      )}

      {/* Users Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "No se encontraron usuarios"
                        : "No hay usuarios registrados"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.name?.charAt(0) || ""}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.emailVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.emailVerified ? "Confirmado" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleEdit({
                                ...user,
                                createdAt: user.createdAt
                                  ? new Date(user.createdAt)
                                  : undefined,
                                updatedAt: user.updatedAt
                                  ? new Date(user.updatedAt)
                                  : undefined,
                              })
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto relative"
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
            <h3 className="text-lg font-semibold mb-4 pr-8">Editar Usuario</h3>
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
                        {editingUser && "(dejar vacío para mantener la actual)"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
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
                      setEditingUser(null);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={updateUser.isPending}>
                    Actualizar
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
