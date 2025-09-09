"use client";

import {
  CheckCircle,
  Eye,
  Loader2,
  Settings,
  Shield,
  Target,
  XCircle,
} from "lucide-react";
import { useAuthContext } from "@/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRBAC } from "@/hooks/useRBAC";

export default function RBACTestPage() {
  const { user } = useAuthContext();
  const {
    userRoles,
    userPermissions,
    isAdmin,
    isSuperAdmin,
    canManageUsers,
    canManageRoles,
    canAccessAdmin,
    canManageTradingAccounts,
    canManageTrades,
    canViewDashboard,
    hasRole,
    isLoading,
  } = useRBAC();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando información de RBAC...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const permissionTests = [
    {
      name: "Gestionar Usuarios",
      permission: "MANAGE",
      resource: "USER",
      hasPermission: canManageUsers,
    },
    {
      name: "Gestionar Roles",
      permission: "MANAGE",
      resource: "ROLE",
      hasPermission: canManageRoles,
    },
    {
      name: "Acceso a Admin",
      permission: "MANAGE",
      resource: "ADMIN",
      hasPermission: canAccessAdmin,
    },
    {
      name: "Gestionar Cuentas de Trading",
      permission: "MANAGE",
      resource: "TRADING_ACCOUNT",
      hasPermission: canManageTradingAccounts,
    },
    {
      name: "Gestionar Trades",
      permission: "MANAGE",
      resource: "TRADE",
      hasPermission: canManageTrades,
    },
    {
      name: "Ver Dashboard",
      permission: "READ",
      resource: "DASHBOARD",
      hasPermission: canViewDashboard,
    },
  ];

  const roleTests = [
    { name: "Super Admin", hasRole: isSuperAdmin },
    { name: "Admin", hasRole: isAdmin },
    { name: "Trader", hasRole: hasRole("trader") },
    { name: "Viewer", hasRole: hasRole("viewer") },
    { name: "Moderator", hasRole: hasRole("moderator") },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Prueba del Sistema RBAC
            </h1>
            <p className="text-gray-600">
              Esta página demuestra cómo funciona el sistema de roles y permisos
            </p>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información del Usuario
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre:</p>
                <p className="font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Es Admin:</p>
                <p className="font-medium">{user?.isAdmin ? "Sí" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cuenta Confirmada:</p>
                <p className="font-medium">{user?.isConfirmed ? "Sí" : "No"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Roles */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Roles del Usuario
              </h2>
              <div className="space-y-3">
                {roleTests.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium">{role.name}</span>
                    <div className="flex items-center">
                      {role.hasRole ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Roles asignados:</strong> {userRoles.length}
                </p>
                <div className="mt-2">
                  {userRoles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                    >
                      {role.displayName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Permisos del Usuario
              </h2>
              <div className="space-y-3">
                {permissionTests.map((permission, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                  >
                    <div>
                      <span className="font-medium">{permission.name}</span>
                      <p className="text-xs text-gray-500">
                        {permission.permission}.{permission.resource}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {permission.hasPermission ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Permisos asignados:</strong> {userPermissions.length}
                </p>
                <div className="mt-2 max-h-32 overflow-y-auto">
                  {userPermissions.map((permission, index) => (
                    <span
                      key={index}
                      className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                    >
                      {permission.action}.{permission.resource}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Content Based on Permissions */}
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Contenido Condicional Basado en Permisos
            </h2>

            {/* Admin Content */}
            {isSuperAdmin || isAdmin ? (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Contenido de Administrador
                </h3>
                <p className="text-purple-700 mb-4">
                  Este contenido solo es visible para administradores y super
                  administradores.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-gray-900">
                      Gestión de Usuarios
                    </h4>
                    <p className="text-sm text-gray-600">
                      Administrar usuarios del sistema
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-gray-900">Configuración</h4>
                    <p className="text-sm text-gray-600">Ajustes del sistema</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-gray-900">Reportes</h4>
                    <p className="text-sm text-gray-600">
                      Estadísticas completas
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Trader Content */}
            {hasRole("trader") ? (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Contenido de Trader
                </h3>
                <p className="text-green-700 mb-4">
                  Este contenido solo es visible para traders.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-gray-900">Mis Trades</h4>
                    <p className="text-sm text-gray-600">
                      Gestionar posiciones abiertas
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-gray-900">Análisis</h4>
                    <p className="text-sm text-gray-600">
                      Herramientas de análisis
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-gray-900">Cuentas</h4>
                    <p className="text-sm text-gray-600">
                      Gestionar cuentas de trading
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Viewer Content */}
            {hasRole("viewer") ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Contenido de Viewer
                </h3>
                <p className="text-blue-700 mb-4">
                  Este contenido solo es visible para viewers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900">Reportes</h4>
                    <p className="text-sm text-gray-600">
                      Ver reportes disponibles
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900">
                      Dashboard Público
                    </h4>
                    <p className="text-sm text-gray-600">Métricas públicas</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900">Documentación</h4>
                    <p className="text-sm text-gray-600">Leer documentación</p>
                  </div>
                </div>
              </div>
            ) : null}

            {/* No Role Content */}
            {!hasRole("admin") &&
            !hasRole("trader") &&
            !hasRole("viewer") &&
            !isSuperAdmin ? (
              <div className="bg-gradient-to-r from-gray-50 to-yellow-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sin Rol Asignado
                </h3>
                <p className="text-gray-700 mb-4">
                  No tienes un rol específico asignado. Contacta al
                  administrador para obtener permisos.
                </p>
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Nota:</strong> Este es el contenido por defecto para
                    usuarios sin roles específicos.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Debug Information */}
          <div className="mt-8 bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información de Debug
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">isSuperAdmin:</p>
                <p className="text-gray-600">
                  {isSuperAdmin ? "true" : "false"}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">isAdmin:</p>
                <p className="text-gray-600">{isAdmin ? "true" : "false"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">canManageUsers:</p>
                <p className="text-gray-600">
                  {canManageUsers ? "true" : "false"}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">canViewDashboard:</p>
                <p className="text-gray-600">
                  {canViewDashboard ? "true" : "false"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
