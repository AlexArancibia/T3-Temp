import * as Toast from "@radix-ui/react-toast";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import GoogleIcon from "@/frontend/components/icons/GoogleIcon";

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

export default function RegisterForm({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const form = useForm({
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
    formState: { errors },
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
        setToastMsg("Cuenta creada correctamente");
        setToastOpen(true);
      } else {
        setToastType("error");
        setToastMsg(result.message || "Error al crear cuenta");
        setToastOpen(true);
      }
    } catch {
      setToastType("error");
      setToastMsg("Error de red o servidor");
      setToastOpen(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-center">Crear cuenta</h2>
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
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Teléfono requerido" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Teléfono" {...field} />
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
                    placeholder="Correo electrónico"
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
                  <div className="relative mb-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ul className="mb-4 text-sm">
            {passwordRules.map((rule) => {
              const valid = rule.test(password);
              return (
                <li
                  key={rule.label}
                  className={
                    valid
                      ? "text-green-600 flex items-center gap-1"
                      : "text-zinc-500 flex items-center gap-1"
                  }
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full"
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
                  <div className="relative mb-2">
                    <Input
                      type={showRepeatPassword ? "text" : "password"}
                      placeholder="Repite la contraseña"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500"
                      onClick={() => setShowRepeatPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showRepeatPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
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
          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}
          {errors.repeatPassword && (
            <div className="text-red-500 text-sm">
              {errors.repeatPassword.message}
            </div>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 via-teal-500 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-200"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              className={`flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-100 transition-colors font-medium ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  window.location.href = "/api/auth/google/login";
                } catch {
                  setToastType("error");
                  setToastMsg("No se pudo redirigir a Google");
                  setToastOpen(true);
                }
                setLoading(false);
              }}
            >
              <GoogleIcon className="w-5 h-5" />
              {loading ? "Redirigiendo..." : "Crear cuenta con Google"}
            </button>
            <div className="flex justify-center text-sm">
              <button
                type="button"
                className="text-indigo-600 hover:underline"
                onClick={onLogin}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </div>
        </form>
      </Form>
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
    </>
  );
}
