"use client";

import * as Toast from "@radix-ui/react-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ConfirmEmailPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const confirmEmail = useCallback(
    async (token: string) => {
      try {
        const response = await fetch("/api/trpc/auth.confirmEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok && result.result?.data === true) {
          setSuccess(true);
          setToastType("success");
          setToastMsg("¡Email confirmado exitosamente!");
          setToastOpen(true);

          // Redirigir al inicio después de 3 segundos
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setError("Token inválido o expirado");
          setToastType("error");
          setToastMsg("Error al confirmar el email");
          setToastOpen(true);
        }
      } catch (_err) {
        setError("Error de conexión");
        setToastType("error");
        setToastMsg("Error de conexión al confirmar el email");
        setToastOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    if (!token) {
      setError("Token de confirmación no encontrado");
      setLoading(false);
      return;
    }

    confirmEmail(token);
  }, [token, confirmEmail]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirmando tu email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {success ? (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Email Confirmado!
            </h1>
            <p className="text-gray-600 mb-6">
              Tu cuenta ha sido confirmada exitosamente. Serás redirigido al
              inicio en unos segundos.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al inicio
            </button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Error de Confirmación
            </h1>
            <p className="text-gray-600 mb-6">
              {error ||
                "No se pudo confirmar tu email. El enlace puede ser inválido o haber expirado."}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir al inicio
              </button>
              <button
                onClick={() => router.push("/?show=register")}
                className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Registrarse nuevamente
              </button>
            </div>
          </div>
        )}
      </div>

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
