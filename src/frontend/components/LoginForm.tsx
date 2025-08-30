import * as Toast from "@radix-ui/react-toast";
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

type LoginFormValues = { email: string; password: string };

export default function LoginForm({
  onRegister,
  onReset,
}: {
  onRegister: () => void;
  onReset: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    clearErrors();
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("email", {
        type: "manual",
        message: "Ingresa un correo válido",
      });
      setToastType("error");
      setToastMsg("Ingresa un correo válido");
      setToastOpen(true);
      setLoading(false);
      return;
    }
    if (!data.password) {
      setError("password", {
        type: "manual",
        message: "Ingresa tu contraseña",
      });
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/trpc/auth.login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const result = await res.json();
      if (res.ok) {
        setToastType("success");
        setToastMsg("Login exitoso");
        setToastOpen(true);
        // Aquí podrías redirigir o cerrar el modal
      } else {
        setToastType("error");
        setToastMsg(result.message || "Error al iniciar sesión");
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
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>
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
                  <Input type="password" placeholder="Contraseña" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}
          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-200"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <div className="flex justify-between text-sm mt-2">
            <button
              type="button"
              className="text-indigo-600 hover:underline"
              onClick={onRegister}
            >
              ¿No tienes cuenta? Regístrate
            </button>
            <button
              type="button"
              className="text-yellow-600 hover:underline"
              onClick={onReset}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </Form>
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={
            toastType === "success"
              ? "bg-blue-600 text-white px-4 py-2 rounded"
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
