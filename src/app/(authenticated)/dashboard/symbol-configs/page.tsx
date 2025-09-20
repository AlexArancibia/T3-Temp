"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Settings, ToggleLeft, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SymbolConfigResponse {
  id: string;
  propfirmId?: string | null;
  brokerId?: string | null;
  symbolId: string;
  commissionPerLot: string | null;
  pipValuePerLot: string;
  pipTicks: string;
  spreadTypical: string | null;
  spreadRecommended: string | null;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  symbol?: {
    symbol: string;
    displayName: string;
  };
  propfirm?: {
    displayName: string;
  };
  broker?: {
    displayName: string;
  };
}

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

const symbolConfigSchema = z.object({
  propfirmId: z.string().optional(),
  brokerId: z.string().optional(),
  symbolId: z.string().min(1, "Símbolo es requerido"),
  commissionPerLot: z.number().min(0).optional(),
  pipValuePerLot: z.number().min(0),
  pipTicks: z.number().min(1),
  spreadTypical: z.number().min(0).optional(),
  spreadRecommended: z.number().min(0).optional(),
  isAvailable: z.boolean(),
});

type SymbolConfigFormData = z.infer<typeof symbolConfigSchema>;

interface SymbolConfig {
  id: string;
  propfirmId: string | null;
  brokerId: string | null;
  symbolId: string;
  commissionPerLot: number | null;
  pipValuePerLot: number;
  pipTicks: number;
  spreadTypical: number | null;
  spreadRecommended: number | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  propfirm: {
    name: string;
    displayName: string;
  } | null;
  broker: {
    name: string;
    displayName: string;
  } | null;
  symbol: {
    symbol: string;
    displayName: string;
    category: string;
  };
}

export default function SymbolConfigsPage() {
  const [editingConfig, setEditingConfig] =
    useState<Partial<SymbolConfig> | null>(null);
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
  } = trpc.symbolConfig.getAll.useQuery(queryParams);

  const { data: symbolsResponse } = trpc.symbol.getAll.useQuery({
    page: 1,
    limit: 100,
  });
  const { data: propfirmsResponse } = trpc.propfirm.getAll.useQuery({
    page: 1,
    limit: 100,
  });
  const { data: brokersResponse } = trpc.broker.getAll.useQuery({
    page: 1,
    limit: 100,
  });

  const createConfig = trpc.symbolConfig.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
      form.reset();
    },
  });

  const updateConfig = trpc.symbolConfig.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingConfig(null);
      form.reset();
    },
  });

  const deleteConfig = trpc.symbolConfig.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const toggleAvailable = trpc.symbolConfig.toggleAvailable.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const form = useForm<SymbolConfigFormData>({
    resolver: zodResolver(symbolConfigSchema),
    defaultValues: {
      propfirmId: "",
      brokerId: "",
      symbolId: "",
      commissionPerLot: 0,
      pipValuePerLot: 10,
      pipTicks: 1,
      spreadTypical: 1,
      spreadRecommended: 1,
      isAvailable: true,
    },
  });

  const configs = (response?.data || []).map(
    (config: SymbolConfigResponse) => ({
      ...config,
      commissionPerLot: config.commissionPerLot
        ? parseFloat(config.commissionPerLot)
        : null,
      pipValuePerLot: parseFloat(config.pipValuePerLot),
      pipTicks: parseInt(config.pipTicks, 10),
      spreadTypical: config.spreadTypical
        ? parseFloat(config.spreadTypical)
        : null,
      spreadRecommended: config.spreadRecommended
        ? parseFloat(config.spreadRecommended)
        : null,
    }),
  );
  const symbols = symbolsResponse?.data || [];
  const propfirms = propfirmsResponse?.data || [];
  const brokers = brokersResponse?.data || [];

  const paginationInfo = response?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const handleEdit = (config: SymbolConfig) => {
    setEditingConfig(config);
    form.reset({
      propfirmId: config.propfirmId || "",
      brokerId: config.brokerId || "",
      symbolId: config.symbolId || "",
      commissionPerLot: config.commissionPerLot || 0,
      pipValuePerLot: config.pipValuePerLot || 10,
      pipTicks: config.pipTicks || 1,
      spreadTypical: config.spreadTypical || 1,
      spreadRecommended: config.spreadRecommended || 1,
      isAvailable: config.isAvailable,
    });
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
    setEditingConfig(null);
    form.reset();
  };

  const onSubmit = (data: SymbolConfigFormData) => {
    if (editingConfig) {
      updateConfig.mutate({
        id: editingConfig.id!,
        ...data,
      });
    } else {
      createConfig.mutate(data);
    }
  };

  const handleDelete = (config: SymbolConfig) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta configuración?")) {
      deleteConfig.mutate({ id: config.id });
    }
  };

  const handleToggleAvailable = (config: SymbolConfig) => {
    toggleAvailable.mutate({ id: config.id });
  };

  const handleSort = (sortByField: string, sortOrderField: "asc" | "desc") => {
    setSortBy(sortByField);
    setSortOrder(sortOrderField);
  };

  // Definir columnas de la tabla
  const columns: TableColumn<SymbolConfig>[] = [
    {
      key: "symbol",
      title: "Símbolo",
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
            <Settings className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {record.symbol.symbol}
            </div>
            <div className="text-sm text-gray-500">
              {record.symbol.displayName}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "propfirm",
      title: "Propfirm",
      render: (_, record) =>
        record.propfirm ? (
          <span className="text-sm text-gray-900">
            {record.propfirm.displayName}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "broker",
      title: "Broker",
      render: (_, record) =>
        record.broker ? (
          <span className="text-sm text-gray-900">
            {record.broker.displayName}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "pipValuePerLot",
      title: "Valor Pip/Lote",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-900">${value}</span>
      ),
    },
    {
      key: "isAvailable",
      title: "Disponible",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Sí" : "No"}
        </span>
      ),
    },
  ];

  // Definir acciones de la tabla
  const actions: TableAction<SymbolConfig>[] = [
    {
      label: "Editar",
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
      variant: "default",
    },
    {
      label: "Alternar Disponibilidad",
      icon: <ToggleLeft className="h-4 w-4" />,
      onClick: handleToggleAvailable,
      variant: "default",
      separator: true,
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "destructive",
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Configuraciones de Símbolos
          </h1>
        </div>
      </div>

      {/* Tabla con ScrollableTable */}
      <ScrollableTable<SymbolConfig>
        data={configs}
        columns={columns}
        loading={isLoading}
        error={error?.message || null}
        pagination={paginationInfo}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar configuraciones..."
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
            <span>Nueva Configuración</span>
          </Button>
        }
        emptyMessage="No se encontraron configuraciones"
        emptyIcon={<Settings className="h-12 w-12 text-gray-400" />}
      />

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingConfig) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingConfig(null);
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
                setEditingConfig(null);
                form.reset();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 pr-8">
              {editingConfig ? "Editar Configuración" : "Nueva Configuración"}
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="symbolId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Símbolo *</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Seleccionar símbolo</option>
                            {symbols.map((symbol) => (
                              <option key={symbol.id} value={symbol.id}>
                                {symbol.symbol} - {symbol.displayName}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propfirmId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Propfirm</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Sin propfirm</option>
                            {propfirms.map((propfirm) => (
                              <option key={propfirm.id} value={propfirm.id}>
                                {propfirm.displayName}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brokerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Broker</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Sin broker</option>
                            {brokers.map((broker) => (
                              <option key={broker.id} value={broker.id}>
                                {broker.displayName}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pipValuePerLot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Pip por Lote *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="commissionPerLot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comisión por Lote</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spreadTypical"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spread Típico</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.1"
                            min="0"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spreadRecommended"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spread Recomendado</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.1"
                            min="0"
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pipTicks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pip Ticks *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponible</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                              Configuración disponible
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingConfig(null);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createConfig.isPending || updateConfig.isPending}
                  >
                    {editingConfig ? "Actualizar" : "Crear"}
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
