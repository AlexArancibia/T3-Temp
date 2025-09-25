"use client";

import { Building2, Globe, Mail, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";

// Helper function to get user-friendly field names
function getFieldDisplayName(fieldName: string): string {
  const fieldNames: Record<string, string> = {
    name: "Nombre de la empresa",
    displayName: "Nombre para mostrar",
    description: "Descripción",
    email: "Correo electrónico",
    phone: "Teléfono",
    address: "Dirección",
    city: "Ciudad",
    country: "País",
    website: "Sitio web",
    facebookUrl: "Facebook",
    twitterUrl: "Twitter",
    instagramUrl: "Instagram",
    linkedinUrl: "LinkedIn",
    youtubeUrl: "YouTube",
    foundedYear: "Año de fundación",
    logoUrl: "URL del logo",
    faviconUrl: "URL del favicon",
    metaTitle: "Título SEO",
    metaDescription: "Descripción SEO",
    metaKeywords: "Palabras clave SEO",
    termsUrl: "URL de términos",
    privacyUrl: "URL de privacidad",
    cookiesUrl: "URL de cookies",
    complaintsUrl: "URL de reclamaciones",
  };
  return fieldNames[fieldName] || fieldName;
}

// Helper function to get user-friendly error messages
function getFieldErrorMessage(errorCode: string, fieldName: string): string {
  switch (errorCode) {
    case "invalid_format":
      if (fieldName.includes("Url") || fieldName === "website") {
        return "Debe ser una URL válida (ejemplo: https://ejemplo.com)";
      }
      if (fieldName === "email") {
        return "Debe ser un correo electrónico válido (ejemplo: usuario@ejemplo.com)";
      }
      return "Formato inválido";
    case "too_small":
      return "El campo es muy corto";
    case "too_big":
      return "El campo es muy largo";
    case "invalid_type":
      return "Tipo de dato inválido";
    default:
      return "Valor inválido";
  }
}

export default function CompanyInfoPage() {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    website: "",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
    foundedYear: "",
    logoUrl: "",
    faviconUrl: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    termsUrl: "",
    privacyUrl: "",
    cookiesUrl: "",
    complaintsUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Get company info
  const { data: companyInfo, refetch } = trpc.companyInfo.get.useQuery();

  // Load data into form when companyInfo is available
  useEffect(() => {
    if (companyInfo) {
      setFormData({
        name: companyInfo.name || "",
        displayName: companyInfo.displayName || "",
        description: companyInfo.description || "",
        email: companyInfo.email || "",
        phone: companyInfo.phone || "",
        address: companyInfo.address || "",
        city: companyInfo.city || "",
        country: companyInfo.country || "",
        website: companyInfo.website || "",
        facebookUrl: companyInfo.facebookUrl || "",
        twitterUrl: companyInfo.twitterUrl || "",
        instagramUrl: companyInfo.instagramUrl || "",
        linkedinUrl: companyInfo.linkedinUrl || "",
        youtubeUrl: companyInfo.youtubeUrl || "",
        foundedYear: companyInfo.foundedYear?.toString() || "",
        logoUrl: companyInfo.logoUrl || "",
        faviconUrl: companyInfo.faviconUrl || "",
        metaTitle: companyInfo.metaTitle || "",
        metaDescription: companyInfo.metaDescription || "",
        metaKeywords: companyInfo.metaKeywords || "",
        termsUrl: companyInfo.termsUrl || "",
        privacyUrl: companyInfo.privacyUrl || "",
        cookiesUrl: companyInfo.cookiesUrl || "",
        complaintsUrl: companyInfo.complaintsUrl || "",
      });
    }
  }, [companyInfo]);

  // Update company info mutation
  const updateCompanyInfo = trpc.companyInfo.update.useMutation({
    onSuccess: () => {
      toast.success("Información de la empresa actualizada exitosamente");
      refetch();
    },
    onError: (error) => {
      // Parse and format error messages to be more user-friendly
      let errorMessage = "Error al actualizar la información";

      try {
        // Check if it's a validation error with multiple issues
        if (error.message.includes("[") && error.message.includes("]")) {
          const errorData = JSON.parse(error.message);
          if (Array.isArray(errorData)) {
            const fieldErrors = errorData.map(
              (err: { path: string[]; code: string }) => {
                const fieldName = getFieldDisplayName(err.path[0]);
                return `• ${fieldName}: ${getFieldErrorMessage(err.code, err.path[0])}`;
              },
            );
            errorMessage =
              "Por favor corrige los siguientes errores:\n" +
              fieldErrors.join("\n");
          }
        } else {
          errorMessage = error.message;
        }
      } catch {
        // If parsing fails, use a generic message
        errorMessage =
          "Error al actualizar la información. Por favor, verifica que todos los campos estén correctamente completados.";
      }

      // Show user-friendly error message
      toast.error(errorMessage);

      // Prevent the error from propagating to Next.js error boundary
      return false;
    },
  });

  // Initialize form data when company info is loaded
  useState(() => {
    if (companyInfo) {
      setFormData({
        name: companyInfo.name || "",
        displayName: companyInfo.displayName || "",
        description: companyInfo.description || "",
        email: companyInfo.email || "",
        phone: companyInfo.phone || "",
        address: companyInfo.address || "",
        city: companyInfo.city || "",
        country: companyInfo.country || "",
        website: companyInfo.website || "",
        facebookUrl: companyInfo.facebookUrl || "",
        twitterUrl: companyInfo.twitterUrl || "",
        instagramUrl: companyInfo.instagramUrl || "",
        linkedinUrl: companyInfo.linkedinUrl || "",
        youtubeUrl: companyInfo.youtubeUrl || "",
        foundedYear: companyInfo.foundedYear?.toString() || "",
        logoUrl: companyInfo.logoUrl || "",
        faviconUrl: companyInfo.faviconUrl || "",
        metaTitle: companyInfo.metaTitle || "",
        metaDescription: companyInfo.metaDescription || "",
        metaKeywords: companyInfo.metaKeywords || "",
        termsUrl: companyInfo.termsUrl || "",
        privacyUrl: companyInfo.privacyUrl || "",
        cookiesUrl: companyInfo.cookiesUrl || "",
        complaintsUrl: companyInfo.complaintsUrl || "",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateCompanyInfo.mutateAsync({
        ...formData,
        foundedYear: formData.foundedYear
          ? parseInt(formData.foundedYear)
          : undefined,
        facebookUrl: formData.facebookUrl || null,
        twitterUrl: formData.twitterUrl || null,
        instagramUrl: formData.instagramUrl || null,
        linkedinUrl: formData.linkedinUrl || null,
        youtubeUrl: formData.youtubeUrl || null,
        logoUrl: formData.logoUrl || null,
        faviconUrl: formData.faviconUrl || null,
      });
    } catch (_error) {
      // Error is already handled by the mutation's onError callback
      // Don't re-throw to prevent Next.js error boundary from showing
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Información de la Empresa
          </h1>
          <p className="text-muted-foreground">
            Gestiona la información general de Feniz
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información Básica
            </CardTitle>
            <CardDescription>
              Configura la información principal de la empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Empresa</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Feniz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Nombre para Mostrar</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  placeholder="Feniz Trading Platform"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Descripción de la empresa..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="foundedYear">Año de Fundación</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) =>
                    handleInputChange("foundedYear", e.target.value)
                  }
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://feniz.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
            <CardDescription>Datos de contacto y ubicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="info@feniz.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (234) 567-890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Dirección completa"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Lima"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Perú"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Redes Sociales
            </CardTitle>
            <CardDescription>
              Enlaces a las redes sociales de la empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook</Label>
                <Input
                  id="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={(e) =>
                    handleInputChange("facebookUrl", e.target.value)
                  }
                  placeholder="https://facebook.com/feniz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter</Label>
                <Input
                  id="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={(e) =>
                    handleInputChange("twitterUrl", e.target.value)
                  }
                  placeholder="https://twitter.com/feniz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram</Label>
                <Input
                  id="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={(e) =>
                    handleInputChange("instagramUrl", e.target.value)
                  }
                  placeholder="https://instagram.com/feniz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn</Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) =>
                    handleInputChange("linkedinUrl", e.target.value)
                  }
                  placeholder="https://linkedin.com/company/feniz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube</Label>
                <Input
                  id="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    handleInputChange("youtubeUrl", e.target.value)
                  }
                  placeholder="https://youtube.com/@feniz"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              SEO y Metadatos
            </CardTitle>
            <CardDescription>
              Información para motores de búsqueda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Título SEO</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                placeholder="Feniz - Trading Platform"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Descripción SEO</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) =>
                  handleInputChange("metaDescription", e.target.value)
                }
                placeholder="Descripción para motores de búsqueda..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Palabras Clave</Label>
              <Input
                id="metaKeywords"
                value={formData.metaKeywords}
                onChange={(e) =>
                  handleInputChange("metaKeywords", e.target.value)
                }
                placeholder="trading, propfirm, broker, gestión"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="min-w-[200px]">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
