import type { Metadata } from "next";

import "../../styles/globals.css";
import { AuthProvider } from "@/AuthContext";
import GlobalNavbar from "@/components/GlobalNavbar";
import { Toaster } from "@/components/ui/toaster";
import { TRPCProvider } from "./_trpc";

export const metadata: Metadata = {
  title: "MiApp - Plataforma de Productividad",
  description:
    "Una plataforma moderna para gestionar proyectos, colaborar en equipo y alcanzar tus objetivos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <TRPCProvider>
          <AuthProvider>
            <GlobalNavbar />
            {children}
            <Toaster />
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
