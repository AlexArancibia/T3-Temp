"use client";

import {
  Cable,
  Calculator,
  Grid3X3,
  LogOut,
  Settings,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/AuthContext";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Panel Principal",
    href: "/trader",
    icon: Grid3X3,
    description: "Vista general de tu actividad",
  },
  {
    title: "Conexiones",
    href: "/trader/connections",
    icon: Cable,
    description: "Gestiona tus conexiones propfirm-broker",
  },
  {
    title: "Cuentas de Trading",
    href: "/trader/accounts",
    icon: Wallet,
    description: "Administra todas tus cuentas",
  },
  {
    title: "Calculadora",
    href: "/trader/calculator",
    icon: Calculator,
    description: "Calculadora de capital y lotaje",
  },
];

export function TraderSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthContext();

  return (
    <div className="w-72 bg-card border border-border shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-medium tracking-tight text-card-foreground">
              Centro de Trading
            </h2>
            <p className="text-sm text-muted-foreground">
              Plataforma Profesional
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/trader" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-white to-primary/20 text-foreground shadow-none border border-primary/20"
                    : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                }
              `}
            >
              <item.icon
                className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-accent-foreground"
                }`}
              />
              <div className="flex-1">
                <div
                  className={`font-medium ${isActive ? "text-foreground" : "text-card-foreground"}`}
                >
                  {item.title}
                </div>
                <div
                  className={`text-xs ${
                    isActive ? "text-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {item.description}
                </div>
              </div>
              {item.badge && (
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/trader/settings"
          className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-card-foreground hover:bg-accent rounded-lg transition-colors duration-200"
        >
          <Settings className="mr-3 h-4 w-4" />
          Configuración
        </Link>
        <Link
          href="/trader/profile"
          className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-card-foreground hover:bg-accent rounded-lg transition-colors duration-200"
        >
          <User className="mr-3 h-4 w-4" />
          Perfil
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center px-4 py-2 text-sm text-destructive hover:text-destructive-foreground hover:bg-destructive/10 rounded-lg transition-colors duration-200"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
