"use client";

import {
  AlertCircle,
  Cable,
  CheckCircle,
  Edit,
  Eye,
  PauseCircle,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ScrollableTable,
  type TableAction,
  type TableColumn,
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
  maxRiskPerTrade: string | number;
  isActive: boolean;
  lastCopyAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  propfirmAccount: {
    id: string;
    accountName: string;
    accountNumber: string | null;
    currentBalance: number | string;
    equity: number | string;
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
    currentBalance: number | string;
    equity: number | string;
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
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    icon: CheckCircle,
    dotColor: "bg-green-500",
  },
  inactive: {
    label: "Inactiva",
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    icon: PauseCircle,
    dotColor: "bg-yellow-500",
  },
  error: {
    label: "Error",
    color: "bg-destructive/10 text-destructive",
    icon: AlertCircle,
    dotColor: "bg-destructive",
  },
};

export default function ConnectionsPage() {
  const [_searchTerm, _setSearchTerm] = useState("");
  const [_statusFilter, _setStatusFilter] = useState("all");

  const pagination = usePagination({ defaultLimit: 10 });
  const {
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

  const _updateConnection = trpc.accountLink.update.useMutation({
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
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <Cable className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">
              {record.propfirmAccount.propfirm?.displayName ||
                record.propfirmAccount.accountName}
              →
              {record.brokerAccount.broker?.displayName ||
                record.brokerAccount.accountName}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(record.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "propfirmAccount",
      title: "Cuenta propfirm",
      sortable: false,
      render: (_, record) => (
        <div>
          <div className="text-sm font-medium text-foreground">
            {record.propfirmAccount.accountName}
          </div>
          <div className="text-xs text-muted-foreground">
            Bal: $
            {Number(record.propfirmAccount.currentBalance).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            Eq: ${Number(record.propfirmAccount.equity).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: "brokerAccount",
      title: "Cuenta broker",
      sortable: false,
      render: (_, record) => (
        <div>
          <div className="text-sm font-medium text-foreground">
            {record.brokerAccount.accountName}
          </div>
          <div className="text-xs text-muted-foreground">
            Bal: ${Number(record.brokerAccount.currentBalance).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            Eq: ${Number(record.brokerAccount.equity).toLocaleString()}
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
          <div className="flex items-center space-x-1.5">
            <div
              className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotColor}`}
            />
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
        );
      },
    },
    {
      key: "lastActivity",
      title: "Última actividad",
      sortable: true,
      render: (_, record) => (
        <div className="text-xs text-muted-foreground">
          {record.lastCopyAt
            ? new Date(record.lastCopyAt).toLocaleDateString()
            : "-"}
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
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Conexiones</h1>
          <p className="text-sm text-muted-foreground mt-0.5 mr-8">
            Gestiona conexiones entre cuentas propfirm y broker
          </p>
        </div>
        <Link href="/trader/connections/create">
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-0 md:mr-1.5 " />
            <span className="hidden md:block">Nueva Conexión</span>
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
        onPageSizeChange={pagination.setLimit}
        onSortChange={handleSort}
        searchable={false}
        loading={isLoading}
        emptyMessage="No se encontraron conexiones"
        emptyIcon={<Cable className="h-12 w-12 text-muted-foreground" />}
      />
    </div>
  );
}
