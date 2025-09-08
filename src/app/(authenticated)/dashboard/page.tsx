"use client";

import {
  AlertCircle,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "@/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [stats] = useState({
    totalProjects: 12,
    completedTasks: 45,
    pendingTasks: 8,
    teamMembers: 6,
  });

  const recentActivities = [
    {
      id: 1,
      type: "task_completed",
      message: "Completaste la tarea 'Diseño de interfaz'",
      time: "Hace 2 horas",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    },
    {
      id: 2,
      type: "project_created",
      message: "Creaste el proyecto 'Nueva funcionalidad'",
      time: "Hace 1 día",
      icon: <FileText className="h-4 w-4 text-blue-600" />,
    },
    {
      id: 3,
      type: "team_joined",
      message: "Te uniste al equipo 'Desarrollo Frontend'",
      time: "Hace 3 días",
      icon: <Users className="h-4 w-4 text-purple-600" />,
    },
    {
      id: 4,
      type: "deadline_approaching",
      message: "El proyecto 'API Integration' vence en 2 días",
      time: "Hace 5 días",
      icon: <AlertCircle className="h-4 w-4 text-orange-600" />,
    },
  ];

  const quickActions = [
    {
      title: "Nuevo Proyecto",
      description: "Crear un nuevo proyecto",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-blue-500",
      href: "/projects/new",
    },
    {
      title: "Ver Equipo",
      description: "Gestionar miembros del equipo",
      icon: <Users className="h-6 w-6" />,
      color: "bg-green-500",
      href: "/team",
    },
    {
      title: "Reportes",
      description: "Ver estadísticas y reportes",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-purple-500",
      href: "/reports",
    },
    {
      title: "Configuración",
      description: "Ajustar preferencias",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-gray-500",
      href: "/settings",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-2xl font-bold text-gray-900">
                ¡Bienvenido, {user?.name || "Usuario"}!
              </h1>
              <p className="text-gray-600 mt-1">
                Aquí tienes un resumen de tu actividad
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Proyectos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProjects}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Tareas Completadas
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completedTasks}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pendientes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingTasks}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Miembros del Equipo
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.teamMembers}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Acciones Rápidas
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
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

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actividad Reciente
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
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
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Ver toda la actividad
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${user?.isConfirmed ? "bg-green-100" : "bg-orange-100"}`}
                  >
                    {user?.isConfirmed ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Estado de la Cuenta
                    </h3>
                    <p className="text-sm text-gray-600">
                      {user?.isConfirmed
                        ? "Tu cuenta está verificada y activa"
                        : "Tu cuenta necesita ser verificada. Revisa tu email."}
                    </p>
                  </div>
                </div>
                {!user?.isConfirmed && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Reenviar verificación
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
