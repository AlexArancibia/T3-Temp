import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Dashboard",
  description:
    "Panel de control administrativo para gestionar usuarios, propfirms, brokers y configuraciones del sistema.",
  keywords: [
    "dashboard",
    "admin",
    "panel de control",
    "gestión",
    "administración",
  ],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Container principal - considera la altura del navbar (h-16 = 64px) */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - 300px de ancho fijo */}
        <DashboardSidebar />

        {/* Área de contenido principal */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
