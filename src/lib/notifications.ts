import { toast } from "sonner";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  /**
   * Muestra una notificación de éxito
   */
  success(message: string, options?: NotificationOptions) {
    return toast.success(options?.title || "Éxito", {
      description: message,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, options?: NotificationOptions) {
    return toast.error(options?.title || "Error", {
      description: message,
      duration: options?.duration || 6000,
      action: options?.action,
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, options?: NotificationOptions) {
    return toast.warning(options?.title || "Advertencia", {
      description: message,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, options?: NotificationOptions) {
    return toast.info(options?.title || "Información", {
      description: message,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  }

  /**
   * Muestra una notificación de carga
   */
  loading(message: string, options?: NotificationOptions) {
    return toast.loading(options?.title || "Cargando", {
      description: message,
    });
  }

  /**
   * Actualiza una notificación de carga
   */
  updateLoading(
    id: string | number,
    type: NotificationType,
    message: string,
    options?: NotificationOptions,
  ) {
    const toastFunction = {
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
    }[type];

    return toastFunction(options?.title || this.getDefaultTitle(type), {
      id,
      description: message,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  }

  /**
   * Cierra una notificación específica
   */
  dismiss(id: string | number) {
    toast.dismiss(id);
  }

  /**
   * Cierra todas las notificaciones
   */
  dismissAll() {
    toast.dismiss();
  }

  /**
   * Maneja errores de API de manera inteligente
   */
  handleApiError(error: unknown, context?: string) {
    let message = "Ha ocurrido un error inesperado";
    let title = "Error del Servidor";

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        message = apiError.response.data.message;
      }
    } else if (error && typeof error === "object" && "message" in error) {
      const errorWithMessage = error as { message: string };
      message = errorWithMessage.message;
    } else if (typeof error === "string") {
      message = error;
    }

    if (context) {
      title = `Error en ${context}`;
    }

    // Errores específicos de tRPC
    if (error && typeof error === "object" && "data" in error) {
      const trpcError = error as {
        data?: { zodError?: Array<{ message: string }> };
      };
      if (trpcError.data?.zodError) {
        const zodError = trpcError.data.zodError;
        if (Array.isArray(zodError)) {
          message = zodError.map((err) => err.message).join(", ");
        }
      }
    }

    // Errores de validación
    if (error && typeof error === "object" && "code" in error) {
      const errorWithCode = error as { code: string };
      if (errorWithCode.code === "VALIDATION_ERROR") {
        title = "Error de Validación";
      } else if (errorWithCode.code === "UNAUTHORIZED") {
        title = "No Autorizado";
        message = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
      } else if (errorWithCode.code === "FORBIDDEN") {
        title = "Acceso Denegado";
        message = "No tienes permisos para realizar esta acción.";
      }
    }

    return this.error(message, { title });
  }

  /**
   * Maneja errores de validación de formularios
   */
  handleFormError(errors: Record<string, { message: string }>) {
    const errorMessages = Object.values(errors).map((error) => error.message);
    const message = errorMessages.join(", ");

    return this.error(message, {
      title: "Error de Validación",
      duration: 5000,
    });
  }

  /**
   * Muestra notificaciones de éxito para acciones comunes
   */
  // Usuario
  userCreated() {
    return this.success("Usuario creado exitosamente", {
      title: "Usuario Creado",
    });
  }

  userUpdated() {
    return this.success("Usuario actualizado exitosamente", {
      title: "Usuario Actualizado",
    });
  }

  userDeleted() {
    return this.success("Usuario eliminado exitosamente", {
      title: "Usuario Eliminado",
    });
  }

  // Autenticación
  loginSuccess() {
    return this.success("Sesión iniciada correctamente", {
      title: "Bienvenido",
    });
  }

  logoutSuccess() {
    return this.success("Sesión cerrada correctamente", {
      title: "Hasta Luego",
    });
  }

  emailConfirmed() {
    return this.success("Email confirmado exitosamente", {
      title: "Email Verificado",
    });
  }

  passwordReset() {
    return this.success("Contraseña restablecida exitosamente", {
      title: "Contraseña Actualizada",
    });
  }

  // RBAC
  roleAssigned() {
    return this.success("Rol asignado correctamente", {
      title: "Rol Asignado",
    });
  }

  permissionGranted() {
    return this.success("Permiso otorgado correctamente", {
      title: "Permiso Otorgado",
    });
  }

  // Trading
  tradeCreated() {
    return this.success("Trade creado exitosamente", {
      title: "Trade Creado",
    });
  }

  tradeUpdated() {
    return this.success("Trade actualizado exitosamente", {
      title: "Trade Actualizado",
    });
  }

  // Sistema
  settingsSaved() {
    return this.success("Configuración guardada exitosamente", {
      title: "Configuración Guardada",
    });
  }

  dataExported() {
    return this.success("Datos exportados exitosamente", {
      title: "Exportación Completada",
    });
  }

  private getDefaultTitle(type: NotificationType): string {
    const titles = {
      success: "Éxito",
      error: "Error",
      warning: "Advertencia",
      info: "Información",
    };
    return titles[type];
  }
}

// Instancia singleton
export const notifications = new NotificationService();

// Exportar también las funciones individuales para conveniencia
export const {
  success,
  error,
  warning,
  info,
  loading,
  updateLoading,
  dismiss,
  dismissAll,
  handleApiError,
  handleFormError,
  userCreated,
  userUpdated,
  userDeleted,
  loginSuccess,
  logoutSuccess,
  emailConfirmed,
  passwordReset,
  roleAssigned,
  permissionGranted,
  tradeCreated,
  tradeUpdated,
  settingsSaved,
  dataExported,
} = notifications;
