import type { Metadata } from "next";

import "../../styles/globals.css";
import { AuthProvider } from "@/AuthContext";
import GlobalNavbar from "@/components/GlobalNavbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { TRPCProvider } from "@/utils/trpc";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <TRPCProvider>
            <AuthProvider>
              <GlobalNavbar />
              {children}
              <Toaster />
            </AuthProvider>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
