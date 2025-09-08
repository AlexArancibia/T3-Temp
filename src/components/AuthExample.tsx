import { useState } from "react";
import { useAuth } from "@/frontend/hooks/useAuth";
import LoginForm from "./LoginForm";
import UserProfile from "./UserProfile";

export default function AuthExample() {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          ¡Bienvenido a la aplicación!
        </h1>
        <UserProfile />
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contenido protegido</h2>
          <p className="text-gray-600">
            Esta es una página de ejemplo que solo pueden ver usuarios
            autenticados. Puedes agregar aquí cualquier contenido que requiera
            autenticación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Iniciar sesión</h1>
      {showLogin ? (
        <LoginForm
          onRegister={() => setShowLogin(false)}
          onReset={() => setShowLogin(false)}
        />
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Para acceder al contenido protegido, inicia sesión con tu cuenta de
            Google.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Mostrar formulario de login
          </button>
        </div>
      )}
    </div>
  );
}
