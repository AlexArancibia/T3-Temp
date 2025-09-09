"use client";

import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  Database,
  DollarSign,
  FileText,
  Settings,
  Shield,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationDemo from "@/components/NotificationDemo";

interface AdminDashboardProps {
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    isConfirmed: boolean;
  } | null;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();

  const adminStats = {
    totalUsers: 156,
    activeUsers: 142,
    pendingVerifications: 8,
    systemAlerts: 3,
    totalTradingAccounts: 89,
    activeTrades: 234,
    totalRevenue: 45678,
    systemUptime: 99.9,
  };

  const adminActivities = [
    {
      id: 1,
      type: "user_registered",
      message: "Nuevo usuario registrado: juan.perez@email.com",
      time: "Hace 5 minutos",
      icon: <User className="h-4 w-4 text-blue-600" />,
      priority: "low",
    },
    {
      id: 2,
      type: "system_alert",
      message: "Alerta: Alto uso de CPU en servidor principal",
      time: "Hace 15 minutos",
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
      priority: "high",
    },
    {
      id: 3,
      type: "role_assigned",
      message: "Rol 'Trader' asignado a maria.garcia@email.com",
      time: "Hace 1 hora",
      icon: <Shield className="h-4 w-4 text-purple-600" />,
      priority: "medium",
    },
    {
      id: 4,
      type: "trading_alert",
      message: "Trade de alto valor ejecutado: $50,000",
      time: "Hace 2 horas",
      icon: <DollarSign className="h-4 w-4 text-green-600" />,
      priority: "high",
    },
  ];

  const adminQuickActions = [
    {
      title: "Gestión de Usuarios",
      description: "Administrar usuarios y permisos",
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      href: "/admin/users",
    },
    {
      title: "Roles y Permisos",
      description: "Configurar sistema RBAC",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-purple-500",
      href: "/admin/roles",
    },
    {
      title: "Cuentas de Trading",
      description: "Gestionar cuentas de trading",
      icon: <Database className="h-6 w-6" />,
      color: "bg-green-500",
      href: "/admin/trading-accounts",
    },
    {
      title: "Reportes del Sistema",
      description: "Ver estadísticas completas",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-orange-500",
      href: "/admin/reports",
    },
    {
      title: "Configuración",
      description: "Ajustes del sistema",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-gray-500",
      href: "/admin/settings",
    },
    {
      title: "Monitoreo",
      description: "Estado del sistema",
      icon: <Activity className="h-6 w-6" />,
      color: "bg-red-500",
      href: "/admin/monitoring",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <p className="text-purple-100 mt-1">
                  Bienvenido, {user?.firstName || "Administrador"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-purple-200" />
                <span className="text-sm font-medium">Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Usuarios
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminStats.totalUsers}
                </p>
                <p className="text-xs text-green-600">
                  +{adminStats.activeUsers} activos
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Cuentas Trading
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminStats.totalTradingAccounts}
                </p>
                <p className="text-xs text-blue-600">
                  {adminStats.activeTrades} trades activos
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${adminStats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% este mes
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminStats.systemUptime}%
                </p>
                <p className="text-xs text-red-600">
                  {adminStats.systemAlerts} alertas
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Herramientas de Administración
              </h3>
              <div className="space-y-3">
                {adminQuickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(action.href)}
                    className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`p-2 ${action.color} rounded-lg text-white mr-3`}
                    >
                      {action.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Admin Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actividad del Sistema
              </h3>
              <div className="space-y-4">
                {adminActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      activity.priority === "high"
                        ? "bg-red-50 border-l-4 border-red-400"
                        : activity.priority === "medium"
                          ? "bg-yellow-50 border-l-4 border-yellow-400"
                          : "bg-gray-50"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                    {activity.priority === "high" && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgente
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Ver todos los logs del sistema
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Demo */}
        <div className="mt-8">
          <NotificationDemo />
        </div>

        {/* System Status */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Estado del Sistema
                  </h3>
                  <p className="text-sm text-gray-600">
                    Todos los servicios funcionando correctamente
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Última verificación</p>
                <p className="text-sm font-medium text-gray-900">
                  Hace 2 minutos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
