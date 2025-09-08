import type { Metadata } from "next";

import "../../styles/globals.css";
import { AuthProvider } from "@/AuthContext";
import GlobalNavbar from "@/components/GlobalNavbar";

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
        <AuthProvider>
          <GlobalNavbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
