"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Cable,
  DollarSign,
  Eye,
  Plus,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";

export default function TraderDashboard() {
  const { user } = useAuthContext();

  // Real tRPC queries
  const { data: userAccountLinks, isLoading: linksLoading } =
    trpc.accountLink.getByUser.useQuery();
  const { data: userTradingAccounts, isLoading: accountsLoading } =
    trpc.tradingAccount.getByUser.useQuery();
  const { data: userTrades, isLoading: tradesLoading } =
    trpc.trade.getByUser.useQuery();

  // Calculate real stats
  const totalBalance =
    userTradingAccounts?.reduce(
      (sum, acc) => sum + Number(acc.currentBalance),
      0,
    ) || 0;
  const totalPnL =
    userTrades?.reduce((sum, trade) => sum + Number(trade.netProfit), 0) || 0;
  const activeConnections =
    userAccountLinks?.filter((link) => link.isActive).length || 0;
  const _totalTrades = userTrades?.length || 0;

  const closedTrades =
    userTrades?.filter((trade) => trade.status === "CLOSED") || [];
  const winningTrades = closedTrades.filter(
    (trade) => Number(trade.netProfit) > 0,
  );
  const winRate =
    closedTrades.length > 0
      ? (winningTrades.length / closedTrades.length) * 100
      : 0;

  // Today's trades
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTrades =
    userTrades?.filter((trade) => {
      const tradeDate = new Date(trade.createdAt);
      return tradeDate >= today;
    }) || [];
  const dailyPnL = todayTrades.reduce(
    (sum, trade) => sum + Number(trade.netProfit),
    0,
  );

  const isLoading = linksLoading || accountsLoading || tradesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido de vuelta, {user?.name?.split(" ")[0] || "Trader"}
          </h1>
          <p className="text-gray-600 mt-1">
            Esto es lo que está pasando con tu trading hoy
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Conexión
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg shadow-gray-900/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Conexiones Activas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activeConnections}
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Cable className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg shadow-gray-900/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-gray-900">
                {winRate.toFixed(1)}%
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Active Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Connections */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg shadow-gray-900/5">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Conexiones Activas
                </h3>
                <Button variant="ghost" size="sm">
                  Ver Todas
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {userAccountLinks?.slice(0, 3).map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        link.isActive
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      <Cable className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Conexión #{link.id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {link.lastCopyAt
                          ? new Date(link.lastCopyAt).toLocaleString()
                          : "Nunca copiado"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      Riesgo: {Number(link.maxRiskPerTrade)}%
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        link.isActive ? "text-emerald-600" : "text-orange-600"
                      }`}
                    >
                      {link.isActive ? "Activa" : "Inactiva"}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">
                  No se encontraron conexiones
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg shadow-gray-900/5 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="ghost">
                <Plus className="h-4 w-4 mr-3" />
                Crear Conexión
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Wallet className="h-4 w-4 mr-3" />
                Agregar Cuenta
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <BarChart3 className="h-4 w-4 mr-3" />
                Ver Análisis
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Activity className="h-4 w-4 mr-3" />
                Ver Rendimiento
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Rendimiento de Hoy</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-100">P&L Diario</span>
                <span className="font-semibold">
                  {dailyPnL >= 0 ? "+" : ""}${dailyPnL.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Operaciones Hoy</span>
                <span className="font-semibold">{todayTrades.length}</span>
              </div>
              <div className="flex items-center">
                {dailyPnL >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                )}
                <span className="text-sm text-blue-100">
                  {Math.abs(dailyPnL)} vs ayer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
