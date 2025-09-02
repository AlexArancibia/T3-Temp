import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  isConfirmed: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // biome-ignore lint/correctness/useExhaustiveDependencies: checkAuth no necesita estar en dependencias
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    console.log("🔵 Hook: signInWithGoogle iniciado");
    try {
      console.log("🔵 Hook: Redirigiendo a /api/auth/google/login");
      window.location.href = "/api/auth/google/login";
    } catch (error) {
      console.error("❌ Hook: Error signing in with Google:", error);
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshSession = async () => {
    await checkAuth();
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
    refreshSession,
    isAuthenticated: !!user,
  };
}
