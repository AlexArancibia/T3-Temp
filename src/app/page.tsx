"use client";
import React, { useEffect, useState } from "react";
import LoginModal from "@/frontend/components/LoginModal";
import { useAuthContext } from "@/frontend/contexts/AuthContext";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated && user) {
      setToastMsg(`¡Bienvenido, ${user.name || user.email}!`);
      setToastOpen(true);
    }
  }, [isAuthenticated, user]);

  // Bloque de información de usuario
  const UserInfo = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 flex flex-col items-center max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-2">Información de usuario</h3>
      {user?.image && (
        <img
          src={user.image}
          alt="Avatar"
          className="w-16 h-16 rounded-full mb-2"
        />
      )}
      <div className="text-gray-800 font-medium">
        {user?.name || "Sin nombre"}
      </div>
      <div className="text-gray-500">{user?.email}</div>
      <div className="text-xs text-green-600 mt-2">
        {user?.isConfirmed ? "Cuenta confirmada" : "Cuenta no confirmada"}
      </div>
    </div>
  );

  const testGoogleAuth = () => {
    window.location.href = "/api/auth/google/login";
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {isAuthenticated && user && <UserInfo />}
      {!isAuthenticated && (
        <div className="flex flex-col gap-4">
          <button
            className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg text-2xl font-bold hover:bg-blue-700 transition"
            onClick={() => setOpen(true)}
          >
            Login
          </button>
          <button
            className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg text-xl font-bold hover:bg-green-700 transition"
            onClick={testGoogleAuth}
          >
            🔍 Probar Google Auth Directo
          </button>
        </div>
      )}
      <LoginModal open={open} onOpenChange={setOpen} />
      {/* Toast de bienvenida */}
      {toastOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {toastMsg}
          <button
            className="ml-4 text-white font-bold"
            onClick={() => setToastOpen(false)}
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}
