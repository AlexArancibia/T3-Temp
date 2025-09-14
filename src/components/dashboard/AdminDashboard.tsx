"use client";

import {
  BarChart3,
  Building2,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import PropfirmCRUD from "@/components/admin/PropfirmCRUD";
import RoleCRUD from "@/components/admin/RoleCRUD";
import UserCRUD from "@/components/admin/UserCRUD";
import { Button } from "@/components/ui/button";

interface AdminDashboardProps {
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    isConfirmed: boolean;
  } | null;
}

type AdminSection = "users" | "roles" | "propfirms" | "analytics" | "settings";

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminSections = [
    {
      id: "users" as AdminSection,
      title: "Usuarios",
      description: "Gestionar usuarios del sistema",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "roles" as AdminSection,
      title: "Roles y Permisos",
      description: "Configurar sistema RBAC",
      icon: <Shield className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "propfirms" as AdminSection,
      title: "Propfirms",
      description: "Gestionar propfirms del sistema",
      icon: <Building2 className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "analytics" as AdminSection,
      title: "Analíticas",
      description: "Estadísticas y reportes",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "settings" as AdminSection,
      title: "Configuración",
      description: "Ajustes del sistema",
      icon: <Settings className="h-5 w-5" />,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UserCRUD />;
      case "roles":
        return <RoleCRUD />;
      case "propfirms":
        return <PropfirmCRUD />;
      case "analytics":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analíticas en desarrollo
              </h3>
              <p className="text-gray-500">
                Esta sección estará disponible próximamente
              </p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Configuración en desarrollo
              </h3>
              <p className="text-gray-500">
                Esta sección estará disponible próximamente
              </p>
            </div>
          </div>
        );
      default:
        return <UserCRUD />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-500">
                  Bienvenido, {user?.firstName || "Administrador"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">
                Super Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 px-4 py-6 space-y-2">
              {adminSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? `${section.bgColor} ${section.color} border-l-4 border-current`
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex-shrink-0 mr-3">{section.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{section.title}</div>
                    <div className="text-xs text-gray-500">
                      {section.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="px-4 sm:px-6 lg:px-8 py-6">{renderContent()}</div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
