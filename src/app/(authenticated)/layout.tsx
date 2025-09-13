import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Dashboard",
  description:
    "Panel de control personalizado según tu rol y permisos en la plataforma.",
  keywords: ["dashboard", "panel de control", "gestión", "usuario"],
});

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
