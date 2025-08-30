"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"pending"|"success"|"error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token no encontrado");
      return;
    }
    fetch("/api/trpc/auth.confirmEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          setMessage("¡Correo confirmado correctamente!");
        } else {
          const data = await res.json();
          setStatus("error");
          setMessage(data.message || "Error al confirmar correo");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Error de red o servidor");
      });
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Confirmación de correo</h2>
        {status === "pending" && <p>Confirmando...</p>}
        {status === "success" && <p className="text-green-600 font-semibold">{message}</p>}
        {status === "error" && <p className="text-red-600 font-semibold">{message}</p>}
      </div>
    </div>
  );
}
