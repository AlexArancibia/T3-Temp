"use client";

import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TraderDashboard from "@/components/dashboard/TraderDashboard";
import ViewerDashboard from "@/components/dashboard/ViewerDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRBAC } from "@/hooks/useRBAC";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const {
    isSuperAdmin,
    isAdmin,
    hasRole,
    canViewDashboard,
    isLoading,
    userRoles,
    userPermissions,
  } = useRBAC();

  // Mostrar loading mientras se cargan los permisos
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Verificar si el usuario tiene permisos para ver el dashboard
  if (!canViewDashboard && !isAdmin && !isSuperAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-gray-600 mb-6">
              No tienes permisos para acceder al dashboard.
            </p>

            {/* Información del usuario */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de tu cuenta
              </h3>

              <div className="space-y-4">
                {/* Tipo de usuario */}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Tipo de usuario:
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    {user?.isAdmin ? "Administrador" : "Usuario estándar"}
                  </span>
                </div>

                {/* Estado de confirmación */}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Estado de cuenta:
                  </span>
                  <span
                    className={`ml-2 text-sm ${user?.isConfirmed ? "text-green-600" : "text-red-600"}`}
                  >
                    {user?.isConfirmed ? "Verificada" : "Sin verificar"}
                  </span>
                </div>

                {/* Roles asignados */}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Roles asignados:
                  </span>
                  <div className="mt-1">
                    {userRoles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userRoles.map((role) => (
                          <span
                            key={role.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {role.displayName || role.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">
                        Sin roles asignados
                      </span>
                    )}
                  </div>
                </div>

                {/* Permisos disponibles */}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Permisos disponibles:
                  </span>
                  <div className="mt-1">
                    {userPermissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userPermissions.slice(0, 5).map((permission) => (
                          <span
                            key={permission.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {permission.action} {permission.resource}
                          </span>
                        ))}
                        {userPermissions.length > 5 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{userPermissions.length - 5} más
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">
                        Sin permisos asignados
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>¿Necesitas acceso?</strong> Contacta al administrador
                  del sistema para que te asigne los roles y permisos
                  necesarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Renderizar el dashboard apropiado según el rol del usuario
  if (isSuperAdmin || isAdmin) {
    return <AdminDashboard user={user} />;
  }

  if (hasRole("trader")) {
    return <TraderDashboard user={user} />;
  }

  if (hasRole("viewer")) {
    return <ViewerDashboard user={user} />;
  }

  // Dashboard por defecto para usuarios sin rol específico
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Bienvenido, {user?.firstName || "Usuario"}!
            </h1>
            <p className="text-gray-600 mb-8">
              Tu cuenta está siendo configurada. Contacta al administrador para
              asignar roles y permisos.
            </p>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Estado de la Cuenta
              </h3>
              <p className="text-sm text-gray-600">
                {user?.isConfirmed
                  ? "Tu cuenta está verificada y activa"
                  : "Tu cuenta necesita ser verificada. Revisa tu email."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
