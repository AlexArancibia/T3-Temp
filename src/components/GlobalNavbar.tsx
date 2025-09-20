"use client";

import { LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "@/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function GlobalNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthContext();
  const router = useRouter();

  // No mostrar navbar solo en páginas de registro y recuperación de contraseña
  if (
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password")
  ) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      router.push("/");
    } catch (_error) {
      // Error handled by Better Auth
    }
  };

  const handleSignIn = () => {
    router.push("/signin");
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { name: "Inicio", href: "/" },
    { name: "Funcionalidades", href: "/#demo" },
    { name: "Precios", href: "/pricing" },
    { name: "Contacto", href: "/#contact" },
  ];

  return (
    <>
      <nav className="bg-gray-900 dark:bg-black shadow-lg border-b border-gray-800 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-cyan-500 dark:to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="ml-2 text-xl font-bold text-white dark:text-gray-100">
                  MiApp
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                {/* Theme Toggle */}
                <ThemeToggle />
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-2">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-white">
                        {user?.name || "Usuario"}
                      </span>
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                      <button
                        onClick={() => router.push("/dashboard")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Dashboard
                      </button>
                    </div>

                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="text-gray-300 hover:text-red-400 p-2 rounded-md transition-colors"
                      title="Cerrar sesión"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSignIn}
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Iniciar Sesión
                    </button>
                    <Link
                      href="/signup"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-md transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-800">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-800">
                {/* Theme Toggle for Mobile */}
                <div className="px-3 py-2">
                  <ThemeToggle />
                </div>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-white">
                        {user?.name || "Usuario"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-white hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleSignIn}
                      className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Iniciar Sesión
                    </button>
                    <Link
                      href="/signup"
                      className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
