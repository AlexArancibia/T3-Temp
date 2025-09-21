import type { Metadata } from "next";
import { TraderSidebar } from "@/components/trader/TraderSidebar";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Trading Platform",
  description:
    "Plataforma de trading profesional para gestionar tus cuentas propfirm y broker de forma eficiente.",
  keywords: [
    "trading",
    "propfirm",
    "broker",
    "gestión",
    "cuentas",
    "copy trading",
  ],
});

export default function TraderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Container principal - considera la altura del navbar (h-16 = 64px) */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - 280px de ancho fijo con diseño moderno */}
        <TraderSidebar />

        {/* Área de contenido principal */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
