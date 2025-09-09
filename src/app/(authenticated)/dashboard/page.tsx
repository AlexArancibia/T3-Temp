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
  const { isSuperAdmin, isAdmin, hasRole, canViewDashboard, isLoading } =
    useRBAC();

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-gray-600">
              No tienes permisos para acceder al dashboard.
            </p>
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
              ¡Bienvenido, {user?.name || "Usuario"}!
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
