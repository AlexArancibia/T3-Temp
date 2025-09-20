"use client";

import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Plus,
  Server,
  Settings,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { CreateTradingAccountDialog } from "@/components/trader/CreateTradingAccountDialog";
import { Button } from "@/components/ui/button";
import type {
  TableAction,
  TableColumn,
} from "@/components/ui/scrollable-table";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { usePagination } from "@/hooks/usePagination";
import { trpc } from "@/utils/trpc";

// Type for trading account with relations
type TradingAccount = {
  id: string;
  userId: string;
  accountName: string;
  accountType: "PROPFIRM" | "BROKER";
  accountNumber: string | null;
  server: string | null;
  propfirmId: string | null;
  brokerId: string | null;
  accountTypeId: string | null;
  initialBalance: string | number;
  currentBalance: string | number;
  equity: string | number;
  currentPhaseId: string | null;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  propfirm: {
    name: string;
    displayName: string;
  } | null;
  broker: {
    name: string;
    displayName: string;
  } | null;
  accountTypeRef: {
    typeName: string;
    displayName: string;
  } | null;
  currentPhase: {
    phaseName: string;
    displayName: string;
  } | null;
  trades: Array<{
    netProfit: string | number;
    status: string;
  }>;
  _count: {
    trades: number;
  };
};

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
    dotColor: "bg-emerald-500",
  },
  warning: {
    label: "Warning",
    color: "bg-orange-100 text-orange-700",
    icon: AlertCircle,
    dotColor: "bg-orange-500",
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-100 text-gray-700",
    icon: Clock,
    dotColor: "bg-gray-500",
  },
};

const typeConfig = {
  PROPFIRM: {
    label: "Propfirm",
    color: "bg-purple-100 text-purple-700",
    gradient: "from-purple-500 to-indigo-600",
  },
  BROKER: {
    label: "Broker",
    color: "bg-blue-100 text-blue-700",
    gradient: "from-blue-500 to-cyan-600",
  },
};

export default function AccountsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const pagination = usePagination({ defaultLimit: 10 });
  const { search, setSearch, setSortBy, setSortOrder } = pagination;
  const queryParams = pagination.getQueryParams();

  // Real tRPC queries
  const {
    data: response,
    refetch,
    isLoading,
  } = trpc.tradingAccount.getAll.useQuery(queryParams);

  const deleteAccount = trpc.tradingAccount.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting account:", error.message);
    },
  });

  const accounts = response?.data || [];
  const paginationInfo = response?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  // Calculate summary stats with defensive checks
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.currentBalance || 0),
    0,
  );
  const totalEquity = accounts.reduce(
    (sum, acc) => sum + Number(acc.equity || 0),
    0,
  );
  const totalPnL = accounts.reduce((sum, acc) => {
    const trades = acc.trades || [];
    const accountPnL = trades.reduce(
      (tradeSum, trade) => tradeSum + Number(trade?.netProfit || 0),
      0,
    );
    return sum + accountPnL;
  }, 0);

  const handleEdit = (account: TradingAccount) => {
    // TODO: Open edit modal
    console.log("Edit account:", account.id);
  };

  const handleDelete = (account: TradingAccount) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta cuenta?")) {
      deleteAccount.mutate({ id: account.id });
    }
  };

  const handleSort = (sortByField: string, sortOrderField: "asc" | "desc") => {
    setSortBy(sortByField);
    setSortOrder(sortOrderField);
  };

  // Define table columns
  const columns: TableColumn<TradingAccount>[] = [
    {
      key: "account",
      title: "Account",
      sortable: true,
      render: (_, record) => {
        const typeInfo = typeConfig[record.accountType];
        return (
          <div className="flex items-center space-x-3">
            <div
              className={`h-10 w-10 bg-gradient-to-br ${typeInfo.gradient} rounded-xl flex items-center justify-center`}
            >
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {record.accountName}
              </div>
              <div className="text-sm text-gray-500">
                #{record.accountNumber || record.id.slice(-8)}
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${typeInfo.color}`}
              >
                {typeInfo.label}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "provider",
      title: "Provider",
      sortable: false,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.propfirm?.displayName ||
              record.broker?.displayName ||
              "Unknown"}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Server className="h-3 w-3 mr-1" />
            {record.server || "No server"}
          </div>
          {record.accountTypeRef && (
            <div className="text-xs text-gray-500">
              {record.accountTypeRef.displayName}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "balance",
      title: "Balance & Equity",
      sortable: true,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            ${Number(record.currentBalance).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Equity: ${Number(record.equity).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            Initial: ${Number(record.initialBalance).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: "trades",
      title: "Trading Activity",
      sortable: false,
      render: (_, record) => {
        const totalTrades = record._count?.trades || 0;
        const trades = record.trades || [];
        const openTrades = trades.filter((t) => t?.status === "OPEN").length;
        const accountPnL = trades.reduce(
          (sum, trade) => sum + Number(trade?.netProfit || 0),
          0,
        );

        return (
          <div>
            <div className="text-sm">
              <span className="font-medium">{totalTrades}</span> total trades
            </div>
            <div className="text-sm text-blue-600">
              {openTrades} open positions
            </div>
            <div
              className={`text-sm font-medium ${accountPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {accountPnL >= 0 ? "+" : ""}${accountPnL.toLocaleString()} P&L
            </div>
          </div>
        );
      },
    },
    {
      key: "performance",
      title: "Performance",
      sortable: false,
      render: (_, record) => {
        const initialBalance = Number(record.initialBalance);
        const currentBalance = Number(record.currentBalance);
        const returnPct =
          ((currentBalance - initialBalance) / initialBalance) * 100;

        return (
          <div>
            <div
              className={`text-sm font-medium ${returnPct >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {returnPct >= 0 ? "+" : ""}
              {returnPct.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500">Return on initial</div>
            {record.currentPhase && (
              <div className="text-xs text-blue-600">
                {record.currentPhase.displayName}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (_, record) => {
        const statusInfo =
          statusConfig[record.status as keyof typeof statusConfig] ||
          statusConfig.active;

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
      title: "Last Update",
      sortable: true,
      render: (_, record) => (
        <div className="text-sm text-gray-500">
          {new Date(record.updatedAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  // Define table actions
  const actions: TableAction<TradingAccount>[] = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (account) =>
        window.open(`/trader/accounts/${account.id}`, "_self"),
      variant: "default",
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: handleEdit,
      variant: "default",
    },
    {
      label: "Delete",
      icon: <Settings className="h-4 w-4" />,
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
          <h1 className="text-3xl font-bold text-gray-900">
            Cuentas de Trading
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona todas tus cuentas propfirm y broker para trading
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Cuenta
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg shadow-gray-900/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Balance Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalBalance.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg shadow-gray-900/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Equity Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalEquity.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg shadow-gray-900/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">P&L Total</p>
              <p
                className={`text-2xl font-bold ${totalPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {totalPnL >= 0 ? "+" : ""}${totalPnL.toLocaleString()}
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                totalPnL >= 0
                  ? "bg-gradient-to-br from-emerald-500 to-green-600"
                  : "bg-gradient-to-br from-red-500 to-rose-600"
              }`}
            >
              {totalPnL >= 0 ? (
                <TrendingUp className="h-6 w-6 text-white" />
              ) : (
                <TrendingDown className="h-6 w-6 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table with ScrollableTable */}
      <ScrollableTable<TradingAccount>
        data={accounts}
        columns={columns}
        actions={actions}
        pagination={paginationInfo}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setLimit}
        onSearchChange={setSearch}
        onSortChange={handleSort}
        searchValue={search}
        loading={isLoading}
        emptyMessage="No se encontraron cuentas de trading"
        emptyIcon={<Wallet className="h-12 w-12 text-gray-400" />}
      />

      {/* Create Account Dialog */}
      <CreateTradingAccountDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
