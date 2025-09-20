"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Edit, Eye, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { trpc } from "@/utils/trpc";

const propfirmSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  displayName: z
    .string()
    .min(2, "Nombre de visualización debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

type PropfirmFormData = z.infer<typeof propfirmSchema>;

interface Propfirm {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PropfirmsPage() {
  const [editingPropfirm, setEditingPropfirm] =
    useState<Partial<Propfirm> | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  const pagination = usePagination({ defaultLimit: 10 });
  const { search, setSearch, sortBy, sortOrder, setSortBy, setSortOrder } =
    pagination;
  const queryParams = pagination.getQueryParams();

  const {
    data: response,
    refetch,
    error,
    isLoading,
  } = trpc.propfirm.getAll.useQuery(queryParams);

  const createPropfirm = trpc.propfirm.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
      form.reset();
    },
  });

  const updatePropfirm = trpc.propfirm.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingPropfirm(null);
      form.reset();
    },
  });

  const deletePropfirm = trpc.propfirm.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const form = useForm<PropfirmFormData>({
    resolver: zodResolver(propfirmSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      website: "",
      logoUrl: "",
    },
  });

  const propfirms = response?.data || [];
  const paginationInfo = response?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const handleEdit = (propfirm: Propfirm) => {
    setEditingPropfirm(propfirm);
    form.reset({
      name: propfirm.name || "",
      displayName: propfirm.displayName || "",
      description: propfirm.description || "",
      website: propfirm.website || "",
      logoUrl: propfirm.logoUrl || "",
    });
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
    setEditingPropfirm(null);
    form.reset();
  };

  const onSubmit = (data: PropfirmFormData) => {
    if (editingPropfirm) {
      updatePropfirm.mutate({
        id: editingPropfirm.id!,
        ...data,
      });
    } else {
      createPropfirm.mutate(data);
    }
  };

  const handleDelete = (propfirm: Propfirm) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta propfirm?")) {
      deletePropfirm.mutate({ id: propfirm.id });
    }
  };

  const handleViewDetails = (propfirm: Propfirm) => {
    router.push(`/dashboard/propfirms/${propfirm.id}`);
  };

  const handleSort = (sortByField: string, sortOrderField: "asc" | "desc") => {
    setSortBy(sortByField);
    setSortOrder(sortOrderField);
  };

  // Definir columnas de la tabla
  const columns: TableColumn<Propfirm>[] = [
    {
      key: "displayName",
      title: "Propfirm",
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center">
          {record.logoUrl ? (
            <img
              src={record.logoUrl}
              alt={record.displayName}
              className="h-10 w-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Building className="h-5 w-5 text-purple-600" />
            </div>
          )}
          <div>
            <button
              onClick={() => handleViewDetails(record)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
            >
              {record.displayName}
            </button>
            <div className="text-sm text-gray-500">{record.name}</div>
          </div>
        </div>
      ),
    },
    {
      key: "website",
      title: "Sitio Web",
      render: (value) =>
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {value}
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "isActive",
      title: "Estado",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Activo" : "Inactivo"}
        </span>
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
  const actions: TableAction<Propfirm>[] = [
    {
      label: "Ver Detalles",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleViewDetails,
      variant: "default",
    },
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
          <Building className="h-6 w-6 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Propfirms
          </h1>
        </div>
      </div>

      {/* Tabla con ScrollableTable */}
      <ScrollableTable<Propfirm>
        data={propfirms}
        columns={columns}
        loading={isLoading}
        error={error?.message || null}
        pagination={paginationInfo}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar propfirms..."
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
            <span>Nueva Propfirm</span>
          </Button>
        }
        emptyMessage="No se encontraron propfirms"
        emptyIcon={<Building className="h-12 w-12 text-gray-400" />}
      />

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingPropfirm) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingPropfirm(null);
            form.reset();
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingPropfirm(null);
                form.reset();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 pr-8">
              {editingPropfirm ? "Editar Propfirm" : "Nueva Propfirm"}
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
                      <FormLabel>Nombre de la Propfirm</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="propfirm_name" />
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
                        <Input {...field} placeholder="Nombre de la Propfirm" />
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
                        <Input
                          {...field}
                          placeholder="Descripción de la propfirm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sitio Web</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://ejemplo.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL del Logo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://ejemplo.com/logo.png"
                        />
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
                      setEditingPropfirm(null);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createPropfirm.isPending || updatePropfirm.isPending
                    }
                  >
                    {editingPropfirm ? "Actualizar" : "Crear"}
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
