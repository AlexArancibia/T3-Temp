"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function NotificationDemo() {
  const handleSuccess = () => {
    toast.success("¡Éxito!", {
      description: "Operación completada exitosamente",
    });
  };

  const handleError = () => {
    toast.error("Error", {
      description: "Algo salió mal en la operación",
    });
  };

  const handleWarning = () => {
    toast.warning("Advertencia", {
      description: "Esta acción requiere confirmación",
    });
  };

  const handleInfo = () => {
    toast.info("Información", {
      description: "Información importante para el usuario",
    });
  };

  const handleLoading = () => {
    const id = toast.loading("Cargando", {
      description: "Procesando solicitud...",
    });

    // Simular operación asíncrona
    setTimeout(() => {
      toast.success("¡Completado!", {
        id,
        description: "Operación completada",
      });
    }, 3000);
  };

  const handleApiError = () => {
    toast.error("Error del Servidor", {
      description: "Error de validación en el servidor",
    });
  };

  const handleFormError = () => {
    toast.error("Error de Validación", {
      description:
        "Email es requerido, Contraseña debe tener al menos 6 caracteres",
    });
  };

  const handleCustomAction = () => {
    toast.error("Error de Archivo", {
      description: "Archivo no encontrado",
      action: {
        label: "Reintentar",
        onClick: () => {
          toast.info("Reintentando operación...");
        },
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Demo del Sistema de Notificaciones
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          onClick={handleSuccess}
          variant="default"
          className="bg-green-600 hover:bg-green-700"
        >
          Éxito
        </Button>
        <Button onClick={handleError} variant="destructive">
          Error
        </Button>
        <Button
          onClick={handleWarning}
          variant="outline"
          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
        >
          Advertencia
        </Button>
        <Button
          onClick={handleInfo}
          variant="outline"
          className="border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          Información
        </Button>
        <Button
          onClick={handleLoading}
          variant="outline"
          className="border-purple-500 text-purple-600 hover:bg-purple-50"
        >
          Loading
        </Button>
        <Button
          onClick={handleApiError}
          variant="outline"
          className="border-red-500 text-red-600 hover:bg-red-50"
        >
          Error API
        </Button>
        <Button
          onClick={handleFormError}
          variant="outline"
          className="border-orange-500 text-orange-600 hover:bg-orange-50"
        >
          Error Form
        </Button>
        <Button
          onClick={handleCustomAction}
          variant="outline"
          className="border-gray-500 text-gray-600 hover:bg-gray-50"
        >
          Con Acción
        </Button>
      </div>
    </div>
  );
}
