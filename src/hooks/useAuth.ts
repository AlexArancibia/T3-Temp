import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { notifications } from "@/lib/notifications";
import type { AuthUser } from "@/types/user";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // biome-ignore lint/correctness/useExhaustiveDependencies: checkAuth no necesita estar en dependencias
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Verificar si hay un token en localStorage
      const token = localStorage.getItem("auth_token");
      if (token) {
        // Si hay token, verificar la sesión
        const response = await fetch("/api/auth/session", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          } else {
            // No hay usuario en la respuesta, limpiar token
            localStorage.removeItem("auth_token");
            setUser(null);
          }
        } else {
          // Token inválido, limpiar
          localStorage.removeItem("auth_token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      window.location.href = "/api/auth/google/login";
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/trpc/auth.login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.result?.data) {
        // Guardar el token JWT
        localStorage.setItem("auth_token", result.result.data);
        // Actualizar el estado del usuario
        await checkAuth();
        notifications.loginSuccess();
        return { success: true };
      } else {
        const errorMessage = result.error?.message || "Error al iniciar sesión";
        notifications.handleApiError(result.error, "Inicio de Sesión");
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error("Error signing in:", error);
      notifications.handleApiError(error, "Inicio de Sesión");
      return { success: false, error: "Error de red o servidor" };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("auth_token");
      setUser(null);
      notifications.logoutSuccess();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      notifications.handleApiError(error, "Cierre de Sesión");
    }
  };

  const refreshSession = async () => {
    await checkAuth();
  };

  return {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
    refreshSession,
    isAuthenticated: !!user,
  };
}
