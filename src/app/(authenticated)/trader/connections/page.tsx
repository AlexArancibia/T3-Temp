"use client";

import {
  AlertCircle,
  Cable,
  CheckCircle,
  Edit,
  Eye,
  Filter,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ScrollableTable,
  TableAction,
  TableColumn,
} from "@/components/ui/scrollable-table";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/utils/trpc";

// Type for the connection data with included relations
type Connection = {
  id: string;
  userId: string;
  propfirmAccountId: string;
  brokerAccountId: string;
  autoCopyEnabled: boolean;
  maxRiskPerTrade: number;
  isActive: boolean;
  lastCopyAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  propfirmAccount: {
    id: string;
    accountName: string;
    accountNumber: string | null;
    currentBalance: number;
    equity: number;
    propfirm: {
      name: string;
      displayName: string;
    } | null;
    broker: {
      name: string;
      displayName: string;
    } | null;
  };
  brokerAccount: {
    id: string;
    accountName: string;
    accountNumber: string | null;
    currentBalance: number;
    equity: number;
    propfirm: {
      name: string;
      displayName: string;
    } | null;
    broker: {
      name: string;
      displayName: string;
    } | null;
  };
};

const statusConfig = {
  active: {
    label: "Activa",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
    dotColor: "bg-emerald-500",
  },
  inactive: {
    label: "Inactiva",
    color: "bg-orange-100 text-orange-700",
    icon: PauseCircle,
    dotColor: "bg-orange-500",
  },
  error: {
    label: "Error",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
    dotColor: "bg-red-500",
  },
};

export default function ConnectionsPage() {
  const [_searchTerm, _setSearchTerm] = useState("");
  const [_statusFilter, _setStatusFilter] = useState("all");

  const pagination = usePagination({ defaultLimit: 10 });
  const {
    search,
    setSearch,
    sortBy: _sortBy,
    sortOrder: _sortOrder,
    setSortBy: _setSortBy,
    setSortOrder: _setSortOrder,
  } = pagination;
  const queryParams = pagination.getQueryParams();

  // Real tRPC queries
  const {
    data: response,
    refetch,
    error: _error,
    isLoading,
  } = trpc.accountLink.getAll.useQuery(queryParams);

  const updateConnection = trpc.accountLink.update.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error updating connection:", error.message);
    },
  });

  const deleteConnection = trpc.accountLink.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting connection:", error.message);
    },
  });

  const connections = response?.data || [];
  const paginationInfo = response?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const handleEdit = (connection: Connection) => {
    // TODO: Open edit modal
    console.log("Edit connection:", connection.id);
  };

  const handleDelete = (connection: Connection) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta conexión?")) {
      deleteConnection.mutate({ id: connection.id });
    }
  };

  const handleToggleStatus = (connection: Connection) => {
    updateConnection.mutate({
      id: connection.id,
      isActive: !connection.isActive,
    });
  };

  const _handleToggleAutoCopy = (connection: Connection) => {
    updateConnection.mutate({
      id: connection.id,
      autoCopyEnabled: !connection.autoCopyEnabled,
    });
  };

  const handleSort = (sortByField: string, sortOrderField: "asc" | "desc") => {
    _setSortBy(sortByField);
    _setSortOrder(sortOrderField);
  };

  // Define table columns
  const columns: TableColumn<Connection>[] = [
    {
      key: "connection",
      title: "Conexión",
      sortable: false,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Cable className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {record.propfirmAccount.propfirm?.displayName ||
                record.propfirmAccount.accountName}
              →
              {record.brokerAccount.broker?.displayName ||
                record.brokerAccount.accountName}
            </div>
            <div className="text-sm text-gray-500">
              Creada {new Date(record.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "propfirmAccount",
      title: "Cuenta Propfirm",
      sortable: false,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.propfirmAccount.accountName}
          </div>
          <div className="text-sm text-gray-500">
            Balance: $
            {Number(record.propfirmAccount.currentBalance).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Equity: ${Number(record.propfirmAccount.equity).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: "brokerAccount",
      title: "Cuenta Broker",
      sortable: false,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.brokerAccount.accountName}
          </div>
          <div className="text-sm text-gray-500">
            Balance: $
            {Number(record.brokerAccount.currentBalance).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Equity: ${Number(record.brokerAccount.equity).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: "settings",
      title: "Configuración",
      sortable: false,
      render: (_, record) => (
        <div>
          <div className="text-sm">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                record.autoCopyEnabled
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Copia Auto {record.autoCopyEnabled ? "ON" : "OFF"}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Riesgo: {Number(record.maxRiskPerTrade)}% por operación
          </div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Estado",
      sortable: true,
      render: (_, record) => {
        const status = record.isActive ? "active" : "inactive";
        const statusInfo = statusConfig[status];

        return (
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${statusInfo.dotColor}`} />
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
        );
      },
    },
    {
      key: "lastActivity",
      title: "Última Actividad",
      sortable: true,
      render: (_, record) => (
        <div className="text-sm text-gray-500">
          {record.lastCopyAt
            ? new Date(record.lastCopyAt).toLocaleString()
            : "Nunca"}
        </div>
      ),
    },
  ];

  // Define table actions
  const actions: TableAction<Connection>[] = [
    {
      label: "Ver Detalles",
      icon: <Eye className="h-4 w-4" />,
      onClick: (connection) =>
        window.open(`/trader/connections/${connection.id}`, "_self"),
      variant: "default",
    },
    {
      label: (record) => (record.isActive ? "Pausar" : "Activar"),
      icon: (record) =>
        record.isActive ? (
          <PauseCircle className="h-4 w-4" />
        ) : (
          <PlayCircle className="h-4 w-4" />
        ),
      onClick: handleToggleStatus,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conexiones</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus conexiones entre cuentas propfirm y broker para copy
            trading
          </p>
        </div>
        <Link href="/trader/connections/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Conexión
          </Button>
        </Link>
      </div>

      {/* Table with ScrollableTable */}
      <ScrollableTable<Connection>
        data={connections}
        columns={columns}
        actions={actions}
        pagination={paginationInfo}
        onPageChange={pagination.setPage}
        onLimitChange={pagination.setLimit}
        onSearch={setSearch}
        onSort={handleSort}
        searchValue={search}
        isLoading={isLoading}
        emptyMessage="No se encontraron conexiones"
        emptyIcon={<Cable className="h-12 w-12 text-gray-400" />}
      />
    </div>
  );
}
