import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Platform",
  description: "Plataforma de trading y gestión administrativa.",
  keywords: ["platform", "trading", "gestión", "dashboard"],
});

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout básico - cada ruta tendrá su propio layout específico
  return <>{children}</>;
}
