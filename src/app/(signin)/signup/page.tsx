"use client";

import * as Toast from "@radix-ui/react-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import GoogleIcon from "@/components/icons/GoogleIcon";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const passwordRules = [
  { label: "Mínimo 8 caracteres", test: (v: string) => v.length >= 8 },
  { label: "Una mayúscula", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Un número", test: (v: string) => /[0-9]/.test(v) },
  {
    label: "Un carácter especial",
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
];

type RegisterFormValues = {
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      lastname: "",
      phone: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setError: setFormError,
    clearErrors,
    formState: { errors: _errors },
  } = form;

  const password = watch("password");
  const repeatPassword = watch("repeatPassword");

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    clearErrors();

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setFormError("email", {
        type: "manual",
        message: "Ingresa un correo válido",
      });
      setToastType("error");
      setToastMsg("Ingresa un correo válido");
      setToastOpen(true);
      setLoading(false);
      return;
    }

    // Validación de contraseñas
    if (data.password !== data.repeatPassword) {
      setFormError("repeatPassword", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      });
      setLoading(false);
      return;
    }

    // Validación de reglas de contraseña
    const failedRule = passwordRules.find((rule) => !rule.test(data.password));
    if (failedRule) {
      setFormError("password", {
        type: "manual",
        message: `La contraseña debe cumplir: ${failedRule.label}`,
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/trpc/auth.register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          lastname: data.lastname,
          phone: data.phone,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setToastType("success");
        setToastMsg(
          "¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.",
        );
        setToastOpen(true);

        // Redirigir al inicio después de un breve delay
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setToastType("error");
        setToastMsg(result.error?.message || "Error al crear cuenta");
        setToastOpen(true);
      }
    } catch (_error) {
      setToastType("error");
      setToastMsg("Error de red o servidor");
      setToastOpen(true);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      window.location.href = "/api/auth/google/login";
    } catch (_error) {
      setToastType("error");
      setToastMsg("No se pudo redirigir a Google");
      setToastOpen(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Nombre requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  name="lastname"
                  control={control}
                  rules={{ required: "Apellido requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Controller
                name="phone"
                control={control}
                rules={{ required: "Teléfono requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{ required: "Correo requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{ required: "Contraseña requerida" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Rules */}
              <ul className="text-sm space-y-1">
                {passwordRules.map((rule) => {
                  const valid = rule.test(password);
                  return (
                    <li
                      key={rule.label}
                      className={
                        valid
                          ? "text-green-600 flex items-center gap-1"
                          : "text-gray-500 flex items-center gap-1"
                      }
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: valid ? "#22c55e" : "#d1d5db" }}
                      ></span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>

              <Controller
                name="repeatPassword"
                control={control}
                rules={{ required: "Repite la contraseña" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repite la contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showRepeatPassword ? "text" : "password"}
                          placeholder="Repite tu contraseña"
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setShowRepeatPassword(!showRepeatPassword)
                          }
                        >
                          {showRepeatPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {repeatPassword.length > 0 && (
                <div
                  className={
                    password === repeatPassword
                      ? "text-green-600 text-sm"
                      : "text-red-600 text-sm"
                  }
                >
                  {password === repeatPassword
                    ? "Las contraseñas coinciden"
                    : "Las contraseñas no coinciden"}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </form>
          </Form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  O continúa con
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <GoogleIcon className="w-5 h-5 mr-2" />
                {loading ? "Redirigiendo..." : "Google"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={
            toastType === "success"
              ? "bg-green-600 text-white px-4 py-2 rounded"
              : "bg-red-600 text-white px-4 py-2 rounded"
          }
        >
          <Toast.Title>
            {toastType === "success" ? "Éxito" : "Error"}
          </Toast.Title>
          <Toast.Description>{toastMsg}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4 z-50" />
      </Toast.Provider>
    </div>
  );
}
