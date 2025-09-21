"use client";

import { LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "@/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserRole } from "@/hooks/useUserRole";

export default function GlobalNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuthContext();
  const { primaryRole } = useUserRole();
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

  const getDashboardUrl = () => {
    switch (primaryRole) {
      case "trader":
        return "/trader";
      case "admin":
      case "super_admin":
      case "viewer":
        return "/dashboard";
      default:
        return "/trader"; // Default to trader for unknown roles
    }
  };

  return (
    <>
      <nav
        className="border-b border-gray-700 shadow-lg"
        style={{ backgroundColor: "#20252F" }}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-[#F5BA35] to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="ml-2 text-xl font-medium text-white">
                  Feniz
                </span>
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    {/* User Name */}
                    <span className="text-white font-medium text-sm">
                      {user?.name || "Usuario"}
                    </span>

                    {/* User Avatar Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all">
                          {user?.image ? (
                            <AvatarImage
                              src={user.image}
                              alt={user?.name || "Usuario"}
                            />
                          ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user?.name
                                ? user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)
                                : "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56 border border-border"
                        align="end"
                        forceMount
                      >
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user?.name || "Usuario"}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user?.email || ""}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => router.push(getDashboardUrl())}
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <div className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span className="mr-auto">Tema</span>
                            <ThemeToggle />
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleSignOut}
                          className="text-red-600 focus:text-red-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Cerrar sesión</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <ThemeToggle />
                    <button
                      onClick={handleSignIn}
                      className="text-muted-foreground hover:text-card-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Iniciar Sesión
                    </button>
                    <Link
                      href="/signup"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
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
            <div
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700"
              style={{ backgroundColor: "#20252F" }}
            >
              {/* Mobile Auth Section */}
              <div className="pt-2">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <Avatar>
                        {user?.image ? (
                          <AvatarImage
                            src={user.image}
                            alt={user?.name || "Usuario"}
                          />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.name
                              ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                              : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {user?.name || "Usuario"}
                        </span>
                        <span className="text-xs text-gray-300">
                          {user?.email || ""}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        router.push(getDashboardUrl());
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-300 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>

                    <div className="px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-gray-300" />
                          <span className="text-sm font-medium text-gray-300">
                            Tema
                          </span>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-accent transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-gray-300" />
                          <span className="text-sm font-medium text-gray-300">
                            Tema
                          </span>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>
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
