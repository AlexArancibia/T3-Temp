"use client";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Copy,
  Edit,
  PauseCircle,
  PlayCircle,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { TradingCalculator } from "@/components/trader/TradingCalculator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TableColumn } from "@/components/ui/scrollable-table";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { trpc } from "@/utils/trpc";

interface TradingAccount {
  id: string;
  accountName: string;
  accountType: string;
  propfirm?: {
    displayName: string;
  } | null;
  broker?: {
    displayName: string;
  } | null;
}

interface AccountLink {
  id: string;
  propfirmAccountId: string;
  brokerAccountId: string;
  autoCopyEnabled: boolean;
  maxRiskPerTrade: number;
  isActive: boolean;
  propfirmAccount: TradingAccount;
  brokerAccount: TradingAccount;
}

interface Trade {
  id: string;
  symbol: string;
  netProfit: string | number;
  status?: string;
  direction?: string;
  lotSize?: number;
  openPrice?: number;
  closePrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreateTradeModalProps {
  connection: AccountLink;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateTradeModal({
  connection,
  isOpen,
  onClose,
  onSuccess,
}: CreateTradeModalProps) {
  const [formData, setFormData] = useState({
    symbol: "",
    direction: "buy" as "buy" | "sell",
    lotSize: "0.1",
    openPrice: "",
    closePrice: "",
    netProfit: "",
    status: "OPEN" as "OPEN" | "CLOSED",
    openTime: new Date().toISOString().slice(0, 16), // datetime-local format
    closeTime: "",
  });

  const { data: symbols } = trpc.symbol.getAll.useQuery({});
  const createTradePair = trpc.trade.createPair.useMutation({
    onSuccess: () => {
      onSuccess();
      // Reset form
      setFormData({
        symbol: "",
        direction: "buy",
        lotSize: "0.1",
        openPrice: "",
        closePrice: "",
        netProfit: "",
        status: "OPEN",
        openTime: new Date().toISOString().slice(0, 16),
        closeTime: "",
      });
    },
    onError: (error) => {
      console.error("Error creating trade pair:", error.message);
      alert("Error al crear la operación: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.symbol || !formData.openPrice || !formData.lotSize) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const tradeData = {
      symbolId: formData.symbol,
      direction: formData.direction,
      lotSize: parseFloat(formData.lotSize),
      openPrice: parseFloat(formData.openPrice),
      closePrice: formData.closePrice
        ? parseFloat(formData.closePrice)
        : undefined,
      netProfit: formData.netProfit ? parseFloat(formData.netProfit) : 0,
      status: formData.status,
      openTime: new Date(formData.openTime),
      closeTime: formData.closeTime ? new Date(formData.closeTime) : undefined,
      propfirmAccountId: connection.propfirmAccountId,
      brokerAccountId: connection.brokerAccountId,
    };

    createTradePair.mutate(tradeData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0 bg-transparent border-0">
        {/* Gradient background similar to CreateTradingAccountDialog */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-slate-700/50">
          {/* Subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

          {/* Content */}
          <div className="relative p-6 text-white">
            {/* Header */}
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-emerald-400 mr-3" />
              <h2 className="text-xl font-semibold">
                Registrar Nueva Operación
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="max-h-[450px] overflow-y-auto space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="symbol" className="text-slate-200 text-sm">
                      Símbolo *
                    </Label>
                    <select
                      id="symbol"
                      value={formData.symbol}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          symbol: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 bg-slate-700/50 border-slate-600 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="" className="bg-slate-700 text-slate-400">
                        Selecciona un símbolo
                      </option>
                      {symbols?.data?.map((symbol) => (
                        <option
                          key={symbol.id}
                          value={symbol.id}
                          className="bg-slate-700 text-white"
                        >
                          {symbol.symbol} - {symbol.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="direction"
                      className="text-slate-200 text-sm"
                    >
                      Dirección *
                    </Label>
                    <select
                      id="direction"
                      value={formData.direction}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          direction: e.target.value as "buy" | "sell",
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 bg-slate-700/50 border-slate-600 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="buy" className="bg-slate-700 text-white">
                        Compra
                      </option>
                      <option value="sell" className="bg-slate-700 text-white">
                        Venta
                      </option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="lotSize" className="text-slate-200 text-sm">
                      Tamaño (Lotes) *
                    </Label>
                    <Input
                      id="lotSize"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.lotSize}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lotSize: e.target.value,
                        }))
                      }
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="openPrice"
                      className="text-slate-200 text-sm"
                    >
                      Precio de Apertura *
                    </Label>
                    <Input
                      id="openPrice"
                      type="number"
                      step="0.00001"
                      min="0"
                      value={formData.openPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          openPrice: e.target.value,
                        }))
                      }
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="closePrice"
                      className="text-slate-200 text-sm"
                    >
                      Precio de Cierre
                    </Label>
                    <Input
                      id="closePrice"
                      type="number"
                      step="0.00001"
                      min="0"
                      value={formData.closePrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          closePrice: e.target.value,
                        }))
                      }
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="netProfit"
                      className="text-slate-200 text-sm"
                    >
                      P&L Neto
                    </Label>
                    <Input
                      id="netProfit"
                      type="number"
                      step="0.01"
                      value={formData.netProfit}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          netProfit: e.target.value,
                        }))
                      }
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-slate-200 text-sm">
                      Estado
                    </Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as "OPEN" | "CLOSED",
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 bg-slate-700/50 border-slate-600 text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="OPEN" className="bg-slate-700 text-white">
                        Abierta
                      </option>
                      <option
                        value="CLOSED"
                        className="bg-slate-700 text-white"
                      >
                        Cerrada
                      </option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="openTime"
                      className="text-slate-200 text-sm"
                    >
                      Fecha de Apertura *
                    </Label>
                    <Input
                      id="openTime"
                      type="datetime-local"
                      value={formData.openTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          openTime: e.target.value,
                        }))
                      }
                      className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>

                  {formData.status === "CLOSED" && (
                    <div>
                      <Label
                        htmlFor="closeTime"
                        className="text-slate-200 text-sm"
                      >
                        Fecha de Cierre
                      </Label>
                      <Input
                        id="closeTime"
                        type="datetime-local"
                        value={formData.closeTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            closeTime: e.target.value,
                          }))
                        }
                        className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-400 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Operación en Par
                  </h4>
                  <p className="text-sm text-slate-300">
                    Esta operación se registrará automáticamente en ambas
                    cuentas:
                  </p>
                  <ul className="text-sm text-slate-300 mt-2 space-y-1">
                    <li>
                      • <strong className="text-purple-400">Propfirm:</strong>{" "}
                      {connection.propfirmAccount.accountName}
                    </li>
                    <li>
                      • <strong className="text-blue-400">Broker:</strong>{" "}
                      {connection.brokerAccount.accountName}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createTradePair.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {createTradePair.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar Operación"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CalculationsTabProps {
  connection: AccountLink;
}

function CalculationsTab({ connection }: CalculationsTabProps) {
  if (!connection) return null;

  const propfirmTrades = connection.propfirmAccount?.trades || [];
  const brokerTrades = connection.brokerAccount?.trades || [];
  const allTrades = [...propfirmTrades, ...brokerTrades];

  // Cálculos principales
  const totalTrades = allTrades.length;
  const openTrades = allTrades.filter(
    (trade) => trade.status === "OPEN",
  ).length;
  const closedTrades = allTrades.filter(
    (trade) => trade.status === "CLOSED",
  ).length;

  const winningTrades = allTrades.filter(
    (trade) => trade.status === "CLOSED" && Number(trade.netProfit || 0) > 0,
  ).length;

  const losingTrades = allTrades.filter(
    (trade) => trade.status === "CLOSED" && Number(trade.netProfit || 0) < 0,
  ).length;

  const totalPnL = allTrades.reduce(
    (sum, trade) => sum + Number(trade.netProfit || 0),
    0,
  );
  const winRate = closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;

  // Cálculos por cuenta
  const propfirmPnL = propfirmTrades.reduce(
    (sum: number, trade: Trade) => sum + Number(trade.netProfit || 0),
    0,
  );
  const brokerPnL = brokerTrades.reduce(
    (sum: number, trade: Trade) => sum + Number(trade.netProfit || 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Trading Calculator */}
      <TradingCalculator />

      {/* Performance Analysis with Real Data */}
      {allTrades.length > 0 && (
        <>
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Análisis de Rendimiento
            </h2>
            <p className="text-gray-600">
              Métricas calculadas de tus operaciones reales
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${totalPnL.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">P&L Total</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {closedTrades > 0 ? winRate.toFixed(1) : "0"}%
                </div>
                <div className="text-sm text-gray-600">
                  Tasa de Éxito ({winningTrades}/{closedTrades})
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {totalTrades}
                </div>
                <div className="text-sm text-gray-600">Total Operaciones</div>
              </div>
            </div>
          </div>

          {/* Account Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cuenta Propfirm
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">
                    {connection.propfirmAccount?.accountName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operaciones:</span>
                  <span className="font-medium">{propfirmTrades.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">P&L:</span>
                  <span
                    className={`font-medium ${propfirmPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    ${propfirmPnL.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cuenta Broker
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">
                    {connection.brokerAccount?.accountName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operaciones:</span>
                  <span className="font-medium">{brokerTrades.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">P&L:</span>
                  <span
                    className={`font-medium ${brokerPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    ${brokerPnL.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Operation Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumen de Operaciones
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {totalTrades}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-xl font-bold text-emerald-900">
                  {winningTrades}
                </div>
                <div className="text-sm text-emerald-700">Ganadoras</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-900">
                  {losingTrades}
                </div>
                <div className="text-sm text-red-700">Perdedoras</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-900">
                  {openTrades}
                </div>
                <div className="text-sm text-blue-700">Abiertas</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* No Data State */}
      {allTrades.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sin Operaciones
          </h3>
          <p className="text-gray-600">
            Registra operaciones para ver análisis de rendimiento y métricas
            calculadas
          </p>
        </div>
      )}
    </div>
  );
}

export default function ConnectionDetailPage() {
  const params = useParams();
  const connectionId = params.id as string;
  const [activeTab, setActiveTab] = useState("trades");
  const [isCreateTradeModalOpen, setIsCreateTradeModalOpen] = useState(false);

  // Real tRPC queries
  const {
    data: connection,
    isLoading,
    error,
    refetch,
  } = trpc.accountLink.getById.useQuery({ id: connectionId });

  const updateConnection = trpc.accountLink.update.useMutation({
    onSuccess: () => {
      // Refetch connection data
    },
    onError: (error) => {
      console.error("Error updating connection:", error.message);
    },
  });

  const tabs = [
    { id: "trades", label: "Operaciones", icon: TrendingUp },
    { id: "calculations", label: "Cálculos", icon: Activity },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !connection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Conexión no encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            La conexión que buscas no existe o no tienes acceso a ella.
          </p>
          <Link href="/trader/connections">
            <Button>Volver a Conexiones</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleStatus = () => {
    updateConnection.mutate({
      id: connection.id,
      isActive: !connection.isActive,
    });
  };

  // Calculate performance stats with defensive checks
  const propfirmTrades = connection.propfirmAccount?.trades || [];
  const brokerTrades = connection.brokerAccount?.trades || [];
  const allTrades = [...propfirmTrades, ...brokerTrades];

  const totalTrades = allTrades?.length || 0;
  const totalPnL =
    allTrades?.reduce((sum, trade) => sum + Number(trade?.netProfit || 0), 0) ||
    0;
  const closedTrades =
    allTrades?.filter((trade) => trade?.status === "CLOSED") || [];
  const winningTrades = closedTrades.filter(
    (trade) => Number(trade?.netProfit || 0) > 0,
  );
  const winRate =
    closedTrades.length > 0
      ? (winningTrades.length / closedTrades.length) * 100
      : 0;

  const avgWin =
    winningTrades.length > 0
      ? winningTrades.reduce(
          (sum, trade) => sum + Number(trade?.netProfit || 0),
          0,
        ) / winningTrades.length
      : 0;
  const losingTrades = closedTrades.filter(
    (trade) => Number(trade?.netProfit || 0) < 0,
  );
  const avgLoss =
    losingTrades.length > 0
      ? Math.abs(
          losingTrades.reduce(
            (sum, trade) => sum + Number(trade?.netProfit || 0),
            0,
          ) / losingTrades.length,
        )
      : 0;
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

  // Recent trades columns for table
  const tradesColumns: TableColumn<(typeof allTrades)[0]>[] = [
    {
      key: "symbol",
      title: "Símbolo",
      sortable: false,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <div
            className={`h-8 w-8 rounded-lg flex items-center justify-center ${
              record.direction === "buy"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {record.direction === "buy" ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
          <div>
            <div className="font-medium">{record.symbol?.symbol || "N/A"}</div>
            <div className="text-sm text-gray-500">
              {record.direction === "buy" ? "COMPRA" : "VENTA"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "size",
      title: "Tamaño",
      sortable: false,
      render: (_, record) => (
        <div className="text-sm">{Number(record.lotSize)} lotes</div>
      ),
    },
    {
      key: "pnl",
      title: "P&L",
      sortable: false,
      render: (_, record) => (
        <div
          className={`text-sm font-medium ${
            Number(record.netProfit || 0) >= 0
              ? "text-emerald-600"
              : "text-red-600"
          }`}
        >
          {Number(record.netProfit || 0) >= 0 ? "+" : ""}$
          {Number(record.netProfit || 0).toFixed(2)}
        </div>
      ),
    },
    {
      key: "status",
      title: "Estado",
      sortable: false,
      render: (_, record) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            record.status === "OPEN"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {record.status === "OPEN" ? "ABIERTA" : "CERRADA"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/trader/connections">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Conexiones
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {connection.propfirmAccount.propfirm?.displayName ||
                connection.propfirmAccount.accountName}
              →
              {connection.brokerAccount.broker?.displayName ||
                connection.brokerAccount.accountName}
            </h1>
            <p className="text-gray-600 mt-1">
              Conexión creada el{" "}
              {new Date(connection.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Duplicar
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button onClick={handleToggleStatus}>
            {connection.isActive ? (
              <>
                <PauseCircle className="h-4 w-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Activar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`rounded-2xl p-4 border ${
          connection.isActive
            ? "bg-emerald-50 border-emerald-200"
            : "bg-orange-50 border-orange-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {connection.isActive ? (
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            )}
            <div>
              <p
                className={`font-semibold ${
                  connection.isActive ? "text-emerald-900" : "text-orange-900"
                }`}
              >
                La conexión está {connection.isActive ? "activa" : "inactiva"}
              </p>
              <p
                className={`text-sm ${
                  connection.isActive ? "text-emerald-700" : "text-orange-700"
                }`}
              >
                Auto-copia{" "}
                {connection.autoCopyEnabled ? "habilitada" : "deshabilitada"} •
                Última actividad:{" "}
                {connection.lastCopyAt
                  ? new Date(connection.lastCopyAt).toLocaleString()
                  : "Nunca"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${
                connection.isActive ? "bg-emerald-500" : "bg-orange-500"
              } animate-pulse`}
            />
            <span
              className={`text-sm font-medium ${
                connection.isActive ? "text-emerald-700" : "text-orange-700"
              }`}
            >
              {connection.isActive ? "En Vivo" : "Pausada"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg shadow-gray-900/5">
        <div className="border-b border-gray-200/30">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Performance Stats - Subtle Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        P&L Total
                      </p>
                      <p
                        className={`text-xl font-semibold ${totalPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {totalPnL >= 0 ? "+" : ""}${totalPnL.toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Tasa de Éxito
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        {winRate.toFixed(1)}%
                      </p>
                    </div>
                    <Activity className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Total Operaciones
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        {totalTrades}
                      </p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Factor de Ganancia
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        {profitFactor.toFixed(2)}
                      </p>
                    </div>
                    <Zap className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Account Cards - Subtle Design */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Propfirm Account */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Cuenta Propfirm
                    </h3>
                    <Wallet className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">
                        {connection.propfirmAccount.propfirm?.displayName ||
                          "Propfirm"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {connection.propfirmAccount.accountName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        #
                        {connection.propfirmAccount.accountNumber ||
                          connection.propfirmAccount.id.slice(-8)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-gray-500 text-xs">Balance</p>
                        <p className="text-sm font-medium text-gray-900">
                          $
                          {Number(
                            connection.propfirmAccount.currentBalance,
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Equity</p>
                        <p className="text-sm font-medium text-gray-900">
                          $
                          {Number(
                            connection.propfirmAccount.equity,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Broker Account */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Cuenta Broker
                    </h3>
                    <Activity className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wide">
                        {connection.brokerAccount.broker?.displayName ||
                          "Broker"}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {connection.brokerAccount.accountName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        #
                        {connection.brokerAccount.accountNumber ||
                          connection.brokerAccount.id.slice(-8)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-gray-500 text-xs">Balance</p>
                        <p className="text-sm font-medium text-gray-900">
                          $
                          {Number(
                            connection.brokerAccount.currentBalance,
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Equity</p>
                        <p className="text-sm font-medium text-gray-900">
                          $
                          {Number(
                            connection.brokerAccount.equity,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Trades */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Operaciones Recientes
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("trades")}
                  >
                    Ver Todas
                  </Button>
                </div>

                {allTrades.length > 0 ? (
                  <ScrollableTable
                    data={allTrades.slice(0, 10)}
                    columns={tradesColumns}
                    pagination={{
                      page: 1,
                      limit: 10,
                      total: allTrades.length,
                      totalPages: 1,
                      hasNext: false,
                      hasPrev: false,
                    }}
                    onPageChange={() => {
                      /* No pagination needed for summary */
                    }}
                    onPageSizeChange={() => {
                      /* No pagination needed for summary */
                    }}
                    loading={false}
                    showPagination={false}
                  />
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No se encontraron operaciones para esta conexión
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "trades" && (
            <div className="space-y-6">
              {/* Calculate metrics for the trades tab */}
              {(() => {
                const totalTrades = allTrades.length;
                const openTrades = allTrades.filter(
                  (trade) => trade.status === "OPEN",
                ).length;
                const closedTrades = allTrades.filter(
                  (trade) => trade.status === "CLOSED",
                ).length;
                const winningTrades = allTrades.filter(
                  (trade) =>
                    trade.status === "CLOSED" &&
                    Number(trade.netProfit || 0) > 0,
                ).length;
                const totalPnL = allTrades.reduce(
                  (sum, trade) => sum + Number(trade.netProfit || 0),
                  0,
                );
                const winRate =
                  closedTrades > 0 ? (winningTrades / closedTrades) * 100 : 0;

                return (
                  <>
                    {/* Performance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-blue-900">
                            P&L Total
                          </h3>
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-900">
                          ${totalPnL.toFixed(2)}
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          Ganancia/Pérdida neta
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-emerald-900">
                            Tasa de Éxito
                          </h3>
                          <BarChart3 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="text-2xl font-bold text-emerald-900">
                          {closedTrades > 0 ? winRate.toFixed(1) : "0"}%
                        </div>
                        <div className="text-xs text-emerald-700 mt-1">
                          {winningTrades}/{closedTrades} operaciones ganadoras
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-purple-900">
                            Total Operaciones
                          </h3>
                          <Activity className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-purple-900">
                          {totalTrades}
                        </div>
                        <div className="text-xs text-purple-700 mt-1">
                          {openTrades} abiertas, {closedTrades} cerradas
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-orange-900">
                            Estado Conexión
                          </h3>
                          <div
                            className={`h-3 w-3 rounded-full ${
                              connection.isActive
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            connection.isActive
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {connection.isActive ? "Activa" : "Inactiva"}
                        </div>
                        <div className="text-xs text-orange-700 mt-1">
                          {connection.isActive
                            ? "Copiando operaciones"
                            : "Pausada"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Historial de Operaciones
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                          Total: {allTrades.length} operaciones
                        </span>
                        <Button
                          onClick={() => setIsCreateTradeModalOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Registrar Operación
                        </Button>
                      </div>
                    </div>

                    {allTrades.length > 0 ? (
                      <ScrollableTable
                        data={allTrades}
                        columns={[
                          {
                            key: "symbol",
                            title: "Símbolo",
                            sortable: true,
                            render: (_, record) => (
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                    record.direction === "buy"
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {record.direction === "buy" ? (
                                    <TrendingUp className="h-4 w-4" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {record.symbol?.symbol || "N/A"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {record.direction === "buy"
                                      ? "COMPRA"
                                      : "VENTA"}
                                  </div>
                                </div>
                              </div>
                            ),
                          },
                          {
                            key: "size",
                            title: "Tamaño",
                            sortable: true,
                            render: (_, record) => (
                              <div className="text-sm font-medium">
                                {Number(record.lotSize).toFixed(2)} lotes
                              </div>
                            ),
                          },
                          {
                            key: "entryPrice",
                            title: "Precio Apertura",
                            sortable: true,
                            render: (_, record) => (
                              <div className="text-sm">
                                {record.entryPrice
                                  ? Number(record.entryPrice).toFixed(5)
                                  : "-"}
                              </div>
                            ),
                          },
                          {
                            key: "exitPrice",
                            title: "Precio Cierre",
                            sortable: true,
                            render: (_, record) => (
                              <div className="text-sm">
                                {record.exitPrice
                                  ? Number(record.exitPrice).toFixed(5)
                                  : "-"}
                              </div>
                            ),
                          },
                          {
                            key: "pnl",
                            title: "P&L",
                            sortable: true,
                            render: (_, record) => (
                              <div
                                className={`text-sm font-medium ${
                                  Number(record.netProfit || 0) >= 0
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {Number(record.netProfit || 0) >= 0 ? "+" : ""}$
                                {Number(record.netProfit || 0).toFixed(2)}
                              </div>
                            ),
                          },
                          {
                            key: "duration",
                            title: "Duración",
                            sortable: false,
                            render: (_, record) => {
                              if (!record.openTime)
                                return (
                                  <span className="text-sm text-gray-400">
                                    -
                                  </span>
                                );

                              const openTime = new Date(record.openTime);
                              const closeTime = record.closeTime
                                ? new Date(record.closeTime)
                                : new Date();
                              const durationMs =
                                closeTime.getTime() - openTime.getTime();
                              const hours = Math.floor(
                                durationMs / (1000 * 60 * 60),
                              );
                              const minutes = Math.floor(
                                (durationMs % (1000 * 60 * 60)) / (1000 * 60),
                              );

                              if (hours > 24) {
                                const days = Math.floor(hours / 24);
                                return (
                                  <span className="text-sm">
                                    {days}d {hours % 24}h
                                  </span>
                                );
                              } else if (hours > 0) {
                                return (
                                  <span className="text-sm">
                                    {hours}h {minutes}m
                                  </span>
                                );
                              } else {
                                return (
                                  <span className="text-sm">{minutes}m</span>
                                );
                              }
                            },
                          },
                          {
                            key: "status",
                            title: "Estado",
                            sortable: true,
                            render: (_, record) => (
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  record.status === "OPEN"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {record.status === "OPEN"
                                  ? "ABIERTA"
                                  : "CERRADA"}
                              </span>
                            ),
                          },
                          {
                            key: "openTime",
                            title: "Fecha Apertura",
                            sortable: true,
                            render: (_, record) => (
                              <div className="text-sm">
                                {record.openTime
                                  ? new Date(record.openTime).toLocaleString()
                                  : "-"}
                              </div>
                            ),
                          },
                        ]}
                        pagination={{
                          page: 1,
                          limit: 25,
                          total: allTrades.length,
                          totalPages: Math.ceil(allTrades.length / 25),
                          hasNext: allTrades.length > 25,
                          hasPrev: false,
                        }}
                        onPageChange={() => {
                          /* No pagination needed for display only */
                        }}
                        onPageSizeChange={() => {
                          /* No pagination needed for display only */
                        }}
                        loading={false}
                        searchable={true}
                        searchPlaceholder="Buscar por símbolo, tipo, etc..."
                        showPagination={true}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Sin Operaciones
                        </h3>
                        <p className="text-gray-600">
                          No hay operaciones registradas para esta conexión
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === "calculations" && (
            <CalculationsTab connection={connection} />
          )}
        </div>
      </div>

      {/* Create Trade Modal */}
      {isCreateTradeModalOpen && (
        <CreateTradeModal
          connection={connection}
          isOpen={isCreateTradeModalOpen}
          onClose={() => setIsCreateTradeModalOpen(false)}
          onSuccess={() => {
            // Refetch connection data to update trades
            refetch();
            setIsCreateTradeModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
