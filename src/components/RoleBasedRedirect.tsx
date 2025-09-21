"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

export function RoleBasedRedirect({ children }: RoleBasedRedirectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { primaryRole, isLoading: roleLoading } = useUserRole();

  useEffect(() => {
    // Don't redirect if still loading or not authenticated
    if (authLoading || roleLoading || !isAuthenticated) {
      return;
    }

    // Define routes that should be accessible to authenticated users without redirection
    const isOnSignInRoutes =
      pathname.startsWith("/signin") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/confirm-email");

    const isOnLandingPage = pathname === "/"; // Allow authenticated users to visit landing page
    const isOnApiRoutes = pathname.startsWith("/api");
    const isOnPublicRoutes = pathname.startsWith("/(public)"); // Allow access to public routes

    // Don't redirect if user is on allowed routes
    if (
      isOnSignInRoutes ||
      isOnLandingPage ||
      isOnApiRoutes ||
      isOnPublicRoutes
    ) {
      return;
    }

    // Redirect based on user role
    switch (primaryRole) {
      case "trader":
        // Redirect traders to /trader unless they're already there
        if (!pathname.startsWith("/trader")) {
          router.replace("/trader");
        }
        break;

      case "admin":
      case "super_admin":
        // Redirect admins to /dashboard unless they're already there
        if (!pathname.startsWith("/dashboard")) {
          router.replace("/dashboard");
        }
        break;

      case "viewer":
        // Redirect viewers to a read-only dashboard or specific viewer route
        if (!pathname.startsWith("/dashboard")) {
          router.replace("/dashboard");
        }
        break;

      default:
        // For unknown roles, redirect to trader by default (most common use case)
        if (!pathname.startsWith("/trader")) {
          router.replace("/trader");
        }
        break;
    }
  }, [
    primaryRole,
    pathname,
    router,
    isAuthenticated,
    authLoading,
    roleLoading,
  ]);

  // Show loading state while determining role
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
