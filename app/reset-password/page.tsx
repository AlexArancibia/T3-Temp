"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToastMsg("");
    try {
      const res = await fetch("/api/trpc/auth.resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setToastMsg("Contraseña cambiada exitosamente");
        setTimeout(() => {
          router.push("/login"); // Redirige al login tras éxito
        }, 2000);
      } else {
        setToastMsg(data.message || "Error al cambiar la contraseña");
      }
    } catch (err) {
      setToastMsg("Error de red o servidor");
    }
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900/60 via-indigo-900/60 to-purple-900/60">
      <form
        className="bg-white dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-6 animate-fade-in"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-extrabold text-center mb-6 text-zinc-800 dark:text-white tracking-tight">
          Cambiar contraseña
        </h1>
        <input
          type="password"
          placeholder="Nueva contraseña"
          className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-200"
          disabled={loading}
        >
          {loading ? "Cambiando..." : "Cambiar contraseña"}
        </button>
        {toastMsg && (
          <div className={`text-center text-sm mt-2 ${success ? "text-green-600" : "text-red-500"}`}>
            {toastMsg}
          </div>
        )}
      </form>
    </main>
  );
}
