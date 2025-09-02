import type { Metadata } from "next";

import "../../styles/globals.css";
import { AuthProvider } from "@/frontend/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Bun Next.js Boilerplate",
  description:
    "A modern Next.js boilerplate with Bun, TypeScript, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
