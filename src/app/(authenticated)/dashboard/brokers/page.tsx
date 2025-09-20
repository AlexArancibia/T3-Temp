"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Edit, Plus, Trash2, X } from "lucide-react";
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

const brokerSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  displayName: z
    .string()
    .min(2, "Nombre de visualización debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

type BrokerFormData = z.infer<typeof brokerSchema>;

interface Broker {
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

export default function BrokersPage() {
  const [editingBroker, setEditingBroker] = useState<Partial<Broker> | null>(
    null,
  );
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
  } = trpc.broker.getAll.useQuery(queryParams);

  const createBroker = trpc.broker.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
      form.reset();
    },
  });

  const updateBroker = trpc.broker.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingBroker(null);
      form.reset();
    },
  });

  const deleteBroker = trpc.broker.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const form = useForm<BrokerFormData>({
    resolver: zodResolver(brokerSchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      website: "",
      logoUrl: "",
    },
  });

  const brokers = response?.data || [];
  const paginationInfo = response?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const handleEdit = (broker: Partial<Broker>) => {
    setEditingBroker(broker);
    form.reset({
      name: broker.name || "",
      displayName: broker.displayName || "",
      description: broker.description || "",
      website: broker.website || "",
      logoUrl: broker.logoUrl || "",
    });
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
    setEditingBroker(null);
    form.reset();
  };

  const onSubmit = (data: BrokerFormData) => {
    if (editingBroker) {
      updateBroker.mutate({
        id: editingBroker.id!,
        ...data,
      });
    } else {
      createBroker.mutate(data);
    }
  };

  const handleDelete = (broker: Broker) => {
    if (confirm("¿Estás seguro de que quieres eliminar este broker?")) {
      deleteBroker.mutate({ id: broker.id });
    }
  };

  const handleSort = (sortByField: string, sortOrderField: "asc" | "desc") => {
    setSortBy(sortByField);
    setSortOrder(sortOrderField);
  };

  // Definir columnas de la tabla
  const columns: TableColumn<Broker>[] = [
    {
      key: "displayName",
      title: "Broker",
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
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          )}
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
  const actions: TableAction<Broker>[] = [
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
          <Building2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Brokers
          </h1>
        </div>
      </div>

      {/* Tabla con ScrollableTable */}
      <ScrollableTable<Broker>
        data={brokers}
        columns={columns}
        loading={isLoading}
        error={error?.message || null}
        pagination={paginationInfo}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar brokers..."
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
            <span>Nuevo Broker</span>
          </Button>
        }
        emptyMessage="No se encontraron brokers"
        emptyIcon={<Building2 className="h-12 w-12 text-gray-400" />}
      />

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingBroker) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingBroker(null);
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
                setEditingBroker(null);
                form.reset();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 pr-8">
              {editingBroker ? "Editar Broker" : "Nuevo Broker"}
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
                      <FormLabel>Nombre del Broker</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="broker_name" />
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
                        <Input {...field} placeholder="Nombre del Broker" />
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
                          placeholder="Descripción del broker"
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
                      setEditingBroker(null);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createBroker.isPending || updateBroker.isPending}
                  >
                    {editingBroker ? "Actualizar" : "Crear"}
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
