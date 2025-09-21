"use client";

import {
  CreditCard,
  Eye,
  EyeOff,
  Key,
  Mail,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "@/AuthContext";
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

interface ExtendedUser {
  id?: string;
  name?: string;
  email?: string;
  createdAt?: Date;
  provider?: string;
}

export default function ProfilePage() {
  const { user } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const extendedUser = user as ExtendedUser;
  const [isGoogleUser] = useState(extendedUser?.provider === "google");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Perfil</h1>
        <p className="text-sm text-gray-600 mt-0.5">
          Gestiona tu cuenta, plan y configuración personal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualiza tu información personal y de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    defaultValue={user?.name?.split(" ")[0] || ""}
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    defaultValue={
                      user?.name?.split(" ").slice(1).join(" ") || ""
                    }
                    placeholder="Tu apellido"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El correo no se puede cambiar
                </p>
              </div>
              <Button className="w-full sm:w-auto">
                <Settings className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>

          {/* Cambio de Contraseña - Solo si no es usuario de Google */}
          {!isGoogleUser && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Cambiar Contraseña
                </CardTitle>
                <CardDescription>
                  Actualiza tu contraseña para mantener tu cuenta segura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu nueva contraseña"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">
                    Confirmar Nueva Contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
                <Button className="w-full sm:w-auto">
                  <Key className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Mensaje para usuarios de Google */}
          {isGoogleUser && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Autenticación con Google
                </CardTitle>
                <CardDescription>
                  Tu cuenta está vinculada con Google
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Al registrarte con Google, tu contraseña se gestiona a través
                  de tu cuenta de Google. Para cambiar tu contraseña, visita tu{" "}
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    configuración de seguridad de Google
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Plan Actual */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Plan Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  Gratuito
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Plan básico con funcionalidades limitadas
                </p>
                <Button className="w-full" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Actualizar Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Información de Cuenta */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Información de Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ID de Usuario:</span>
                <span className="font-mono text-xs">
                  {user?.id?.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Proveedor:</span>
                <span className="capitalize">
                  {extendedUser?.provider || "Email"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Miembro desde:</span>
                <span>
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
