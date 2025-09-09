import { toast } from "sonner";

// Re-export toast for direct usage
export { toast };

// Simple utility functions for common notifications
export const notifications = {
  // Basic notifications
  success: (title: string, description?: string) =>
    toast.success(title, { description }),

  error: (title: string, description?: string) =>
    toast.error(title, { description }),

  warning: (title: string, description?: string) =>
    toast.warning(title, { description }),

  info: (title: string, description?: string) =>
    toast.info(title, { description }),

  loading: (title: string, description?: string) =>
    toast.loading(title, { description }),

  // Common app notifications
  userCreated: () =>
    toast.success("Usuario Creado", {
      description: "Usuario creado exitosamente",
    }),

  userUpdated: () =>
    toast.success("Usuario Actualizado", {
      description: "Usuario actualizado exitosamente",
    }),

  userDeleted: () =>
    toast.success("Usuario Eliminado", {
      description: "Usuario eliminado exitosamente",
    }),

  loginSuccess: () =>
    toast.success("Bienvenido", {
      description: "Sesión iniciada correctamente",
    }),

  logoutSuccess: () =>
    toast.success("Hasta Luego", {
      description: "Sesión cerrada correctamente",
    }),

  emailConfirmed: () =>
    toast.success("Email Verificado", {
      description: "Email confirmado exitosamente",
    }),

  passwordReset: () =>
    toast.success("Contraseña Actualizada", {
      description: "Contraseña restablecida exitosamente",
    }),

  roleAssigned: () =>
    toast.success("Rol Asignado", {
      description: "Rol asignado correctamente",
    }),

  permissionGranted: () =>
    toast.success("Permiso Otorgado", {
      description: "Permiso otorgado correctamente",
    }),

  settingsSaved: () =>
    toast.success("Configuración Guardada", {
      description: "Configuración guardada exitosamente",
    }),

  // Error handling
  handleApiError: (error: unknown, context?: string) => {
    let message = "Ha ocurrido un error inesperado";
    let title = context ? `Error en ${context}` : "Error del Servidor";

    if (error && typeof error === "object" && "message" in error) {
      message = (error as { message: string }).message;
    } else if (typeof error === "string") {
      message = error;
    }

    return toast.error(title, { description: message });
  },

  handleFormError: (errors: Record<string, { message: string }>) => {
    const errorMessages = Object.values(errors).map((error) => error.message);
    const message = errorMessages.join(", ");
    return toast.error("Error de Validación", { description: message });
  },
};
