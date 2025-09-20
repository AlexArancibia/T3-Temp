"use client";

import {
  BarChart3,
  Briefcase,
  Building2,
  LayoutDashboard,
  Settings,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRBAC } from "@/hooks/useRBAC";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  requiredRoles?: string[];
  requiredPermissions?: Array<{ action: string; resource: string }>;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isSuperAdmin, isAdmin, hasRole } = useRBAC();

  // Configuración de navegación por rol
  const getSidebarSections = (): SidebarSection[] => {
    // Super Admin - acceso completo
    if (isSuperAdmin) {
      return [
        {
          title: "Dashboard",
          items: [
            {
              name: "Inicio",
              href: "/dashboard",
              icon: LayoutDashboard,
              description: "Vista general del sistema",
            },
          ],
        },
        {
          title: "Administración",
          items: [
            {
              name: "Usuarios",
              href: "/dashboard/users",
              icon: Users,
              description: "Gestión de usuarios del sistema",
            },
            {
              name: "Roles",
              href: "/dashboard/roles",
              icon: Shield,
              description: "Gestión de roles y permisos",
            },
          ],
        },
        {
          title: "Trading",
          items: [
            {
              name: "Propfirms",
              href: "/dashboard/propfirms",
              icon: Briefcase,
              description: "Gestión de firmas de prop trading",
            },
            {
              name: "Brokers",
              href: "/dashboard/brokers",
              icon: Building2,
              description: "Gestión de brokers",
            },
            {
              name: "Símbolos",
              href: "/dashboard/symbols",
              icon: TrendingUp,
              description: "Gestión de instrumentos financieros",
            },
            {
              name: "Configuraciones",
              href: "/dashboard/symbol-configs",
              icon: Settings,
              description: "Configuración de símbolos por broker/propfirm",
            },
          ],
        },
      ];
    }

    // Admin - TODO: definir permisos específicos
    if (isAdmin) {
      return [
        {
          title: "Dashboard",
          items: [
            {
              name: "Inicio",
              href: "/dashboard",
              icon: LayoutDashboard,
              description: "Vista general",
            },
          ],
        },
        {
          title: "Gestión",
          items: [
            // TODO: Definir rutas específicas para admin
            {
              name: "Usuarios",
              href: "/dashboard/users",
              icon: Users,
              description: "Gestión básica de usuarios",
            },
          ],
        },
      ];
    }

    // Trader - TODO: definir rutas específicas
    if (hasRole("trader")) {
      return [
        {
          title: "Dashboard",
          items: [
            {
              name: "Inicio",
              href: "/dashboard",
              icon: LayoutDashboard,
              description: "Mi dashboard de trading",
            },
          ],
        },
        {
          title: "Trading",
          items: [
            // TODO: Definir rutas específicas para trader
            {
              name: "Mis Cuentas",
              href: "/dashboard/my-accounts",
              icon: Briefcase,
              description: "Mis cuentas de trading",
            },
            {
              name: "Mis Trades",
              href: "/dashboard/my-trades",
              icon: BarChart3,
              description: "Historial de operaciones",
            },
            {
              name: "Análisis",
              href: "/dashboard/analytics",
              icon: TrendingUp,
              description: "Análisis de rendimiento",
            },
          ],
        },
      ];
    }

    // Viewer - TODO: definir rutas específicas
    if (hasRole("viewer")) {
      return [
        {
          title: "Dashboard",
          items: [
            {
              name: "Inicio",
              href: "/dashboard",
              icon: LayoutDashboard,
              description: "Vista de solo lectura",
            },
          ],
        },
        {
          title: "Informes",
          items: [
            // TODO: Definir rutas específicas para viewer
            {
              name: "Reportes",
              href: "/dashboard/reports",
              icon: BarChart3,
              description: "Visualización de reportes",
            },
          ],
        },
      ];
    }

    // Por defecto - acceso mínimo
    return [
      {
        title: "Dashboard",
        items: [
          {
            name: "Inicio",
            href: "/dashboard",
            icon: LayoutDashboard,
            description: "Dashboard básico",
          },
        ],
      },
    ];
  };

  const sidebarSections = getSidebarSections();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    // Para rutas con parámetros dinámicos (ej: /dashboard/propfirms/[id])
    if (
      href === "/dashboard/propfirms" &&
      pathname.startsWith("/dashboard/propfirms/")
    ) {
      return true;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          {isSuperAdmin
            ? "Super Administrador"
            : isAdmin
              ? "Administrador"
              : hasRole("trader")
                ? "Trader"
                : hasRole("viewer")
                  ? "Viewer"
                  : "Usuario"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        active
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div
                          className={`text-xs mt-0.5 ${
                            active ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          {isSuperAdmin && (
            <div className="flex items-center justify-center space-x-1 text-green-600">
              <UserCheck className="h-3 w-3" />
              <span>Acceso Total</span>
            </div>
          )}
          {!isSuperAdmin && (
            <div className="text-gray-400">Acceso limitado por rol</div>
          )}
        </div>
      </div>
    </div>
  );
}
