import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function LoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [view, setView] = useState<"login" | "register" | "reset">("login");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/60 to-purple-900/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="bg-white dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl border border-zinc-200 dark:border-zinc-800 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in">
          <Dialog.Title className="text-2xl font-extrabold text-center mb-6 text-zinc-800 dark:text-white tracking-tight">
            {view === "login" && "Iniciar sesión"}
            {view === "register" && "Crear cuenta"}
            {view === "reset" && "Reestablecer contraseña"}
          </Dialog.Title>
          {view === "login" && (
            <LoginForm
              onRegister={() => setView("register")}
              onReset={() => setView("reset")}
            />
          )}
          {view === "register" && (
            <RegisterForm onLogin={() => setView("login")} />
          )}
          {view === "reset" && (
            <ResetPasswordForm onLogin={() => setView("login")} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
