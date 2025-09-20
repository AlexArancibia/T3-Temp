"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Trash2, TrendingUp, X } from "lucide-react";
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

const symbolSchema = z.object({
  symbol: z.string().min(1, "Símbolo es requerido"),
  displayName: z
    .string()
    .min(2, "Nombre de visualización debe tener al menos 2 caracteres"),
  category: z.enum(["FOREX", "CRYPTO", "STOCKS", "COMMODITIES", "INDICES"]),
  baseCurrency: z.string().min(1, "Moneda base es requerida"),
  quoteCurrency: z.string().min(1, "Moneda de cotización es requerida"),
  pipDecimalPosition: z.number().min(0).optional(),
});

type SymbolFormData = z.infer<typeof symbolSchema>;

interface Symbol {
  id: string;
  symbol: string;
  displayName: string;
  category: "FOREX" | "CRYPTO" | "STOCKS" | "COMMODITIES" | "INDICES";
  baseCurrency: string;
  quoteCurrency: string;
  pipDecimalPosition: number;
  createdAt: string;
  updatedAt: string;
}

export default function SymbolsPage() {
  const [editingSymbol, setEditingSymbol] = useState<Partial<Symbol> | null>(
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
  } = trpc.symbol.getAll.useQuery(queryParams);

  const createSymbol = trpc.symbol.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateModalOpen(false);
      form.reset();
    },
  });

  const updateSymbol = trpc.symbol.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingSymbol(null);
      form.reset();
    },
  });

  const deleteSymbol = trpc.symbol.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const form = useForm<SymbolFormData>({
    resolver: zodResolver(symbolSchema),
    defaultValues: {
      symbol: "",
      displayName: "",
      category: "FOREX",
      baseCurrency: "",
      quoteCurrency: "",
      pipDecimalPosition: 4,
    },
  });

  const symbols = response?.data || [];
  const paginationInfo = response?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const handleEdit = (symbol: Symbol) => {
    setEditingSymbol(symbol);
    form.reset({
      symbol: symbol.symbol || "",
      displayName: symbol.displayName || "",
      category: symbol.category || "FOREX",
      baseCurrency: symbol.baseCurrency || "",
      quoteCurrency: symbol.quoteCurrency || "",
      pipDecimalPosition: symbol.pipDecimalPosition ?? 4,
    });
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
    setEditingSymbol(null);
    form.reset();
  };

  const onSubmit = (data: SymbolFormData) => {
    if (editingSymbol) {
      updateSymbol.mutate({
        id: editingSymbol.id!,
        ...data,
        pipDecimalPosition: data.pipDecimalPosition ?? 4,
      });
    } else {
      createSymbol.mutate({
        ...data,
        pipDecimalPosition: data.pipDecimalPosition ?? 4,
      });
    }
  };

  const handleDelete = (symbol: Symbol) => {
    if (confirm("¿Estás seguro de que quieres eliminar este símbolo?")) {
      deleteSymbol.mutate({ id: symbol.id });
    }
  };

  const handleSort = (sortByField: string, sortOrderField: "asc" | "desc") => {
    setSortBy(sortByField);
    setSortOrder(sortOrderField);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "FOREX":
        return "bg-blue-100 text-blue-800";
      case "CRYPTO":
        return "bg-orange-100 text-orange-800";
      case "STOCKS":
        return "bg-green-100 text-green-800";
      case "COMMODITIES":
        return "bg-yellow-100 text-yellow-800";
      case "INDICES":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Definir columnas de la tabla
  const columns: TableColumn<Symbol>[] = [
    {
      key: "symbol",
      title: "Símbolo",
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {record.symbol}
            </div>
            <div className="text-sm text-gray-500">{record.displayName}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      title: "Categoría",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(value)}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "pipDecimalPosition",
      title: "Decimales Pip",
      sortable: true,
      render: (value) => <span className="text-sm text-gray-900">{value}</span>,
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
  const actions: TableAction<Symbol>[] = [
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
          <TrendingUp className="h-6 w-6 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Símbolos
          </h1>
        </div>
      </div>

      {/* Tabla con ScrollableTable */}
      <ScrollableTable<Symbol>
        data={symbols}
        columns={columns}
        loading={isLoading}
        error={error?.message || null}
        pagination={paginationInfo}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar símbolos..."
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
            <span>Nuevo Símbolo</span>
          </Button>
        }
        emptyMessage="No se encontraron símbolos"
        emptyIcon={<TrendingUp className="h-12 w-12 text-gray-400" />}
      />

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingSymbol) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
          onClick={() => {
            setIsCreateModalOpen(false);
            setEditingSymbol(null);
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
                setEditingSymbol(null);
                form.reset();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 pr-8">
              {editingSymbol ? "Editar Símbolo" : "Nuevo Símbolo"}
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Símbolo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="EURUSD" />
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
                        <Input {...field} placeholder="Euro vs US Dollar" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="FOREX">FOREX</option>
                          <option value="CRYPTO">CRYPTO</option>
                          <option value="STOCKS">STOCKS</option>
                          <option value="COMMODITIES">COMMODITIES</option>
                          <option value="INDICES">INDICES</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="baseCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda Base</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="EUR" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quoteCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda de Cotización</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="USD" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pipDecimalPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posición Decimal del Pip</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || 4)
                          }
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
                      setEditingSymbol(null);
                      form.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createSymbol.isPending || updateSymbol.isPending}
                  >
                    {editingSymbol ? "Actualizar" : "Crear"}
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
