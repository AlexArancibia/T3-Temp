import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
      // Verificar si hay un token en la URL (desde Google OAuth)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");

      if (tokenFromUrl) {
        // Si hay token en la URL, guardarlo en localStorage y limpiar la URL
        localStorage.setItem("auth_token", tokenFromUrl);
        // Limpiar la URL sin recargar la página
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("token");
        window.history.replaceState({}, "", newUrl.toString());
      }

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
        toast.success("Bienvenido", {
          description: "Sesión iniciada correctamente",
        });
        return { success: true };
      } else {
        const errorMessage = result.error?.message || "Error al iniciar sesión";
        toast.error("Error en Inicio de Sesión", {
          description:
            result.error?.message || "Ha ocurrido un error inesperado",
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Error en Inicio de Sesión", {
        description: "Error de red o servidor",
      });
      return { success: false, error: "Error de red o servidor" };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("auth_token");
      setUser(null);
      toast.success("Hasta Luego", {
        description: "Sesión cerrada correctamente",
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error en Cierre de Sesión", {
        description: "Ha ocurrido un error inesperado",
      });
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
