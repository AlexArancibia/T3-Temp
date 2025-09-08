// Servicio de autenticación y gestión de usuario

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { sendMail } from "../lib/mailer";
import type { User } from "../types/user";
import { validateEmail } from "../utils/validate";

const prisma = new PrismaClient();

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  lastname: string,
  phone: string,
): Promise<User> => {
  if (!validateEmail(email)) throw new Error("Email inválido");
  const hashed = await bcrypt.hash(password, 10);
  const confirmationToken = randomUUID();
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      lastname,
      phone,
      isConfirmed: false,
      confirmationToken,
    },
  });
  await sendMail(
    user.email,
    "Confirma tu cuenta",
    `<div style="font-family:sans-serif;padding:2rem;text-align:center;">
      <h2>Confirma tu cuenta</h2>
      <p>Haz clic en el botón para confirmar tu correo electrónico:</p>
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/confirm-email?token=${confirmationToken}" style="display:inline-block;padding:0.75rem 1.5rem;background:#22c55e;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:1rem;">Confirmar correo</a>
      <p style="margin-top:2rem;font-size:0.9rem;color:#555;">Si no puedes hacer clic, copia y pega el siguiente enlace en tu navegador:</p>
      <code style="background:#f3f3f3;padding:0.5rem;border-radius:4px;display:block;word-break:break-all;">${process.env.NEXTAUTH_URL || "http://localhost:3000"}/confirm-email?token=${confirmationToken}</code>
    </div>`,
  );
  return {
    ...user,
    lastname: user.lastname ?? undefined,
    phone: user.phone ?? undefined,
    confirmationToken: user.confirmationToken ?? undefined,
    resetToken: user.resetToken ?? undefined,
    resetTokenExpiry: user.resetTokenExpiry ?? undefined,
  };
};

export const confirmUser = async (token: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { confirmationToken: token },
  });
  if (!user) return false;
  await prisma.user.update({
    where: { id: user.id },
    data: { isConfirmed: true, confirmationToken: null },
  });
  return true;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado");
  if (!user.password) throw new Error("Usuario sin contraseña local");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Contraseña incorrecta");
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" },
  );
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado");
  const resetToken = randomUUID();
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family:Arial,sans-serif;padding:24px;">
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el siguiente botón para cambiar tu contraseña:</p>
      <a href="${resetUrl}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">Cambiar contraseña</a>
      <p style="margin-top:24px;font-size:14px;color:#555;">Si no solicitaste este cambio, ignora este correo.</p>
    </div>
  `;
  await sendMail(email, "Recuperación de contraseña", html);
};

export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { resetToken: token } });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date())
    return false;
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  });
  return true;
};
