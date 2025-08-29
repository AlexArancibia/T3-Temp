// Servicio de autenticación y gestión de usuario

import { sendMail } from "@backend/lib/mailer";
import type { User } from "@backend/types/user";
import { validateEmail } from "@backend/utils/validate";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerUser = async (
  email: string,
  password: string,
  name: string,
): Promise<User> => {
  if (!validateEmail(email)) throw new Error("Email inválido");
  const hashed = await bcrypt.hash(password, 10);
  const confirmationToken = crypto.randomUUID();
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      isConfirmed: false,
      confirmationToken,
    },
  });
  await sendMail(
    user.email,
    "Confirma tu cuenta",
    `Por favor confirma tu cuenta usando este token: ${confirmationToken}`,
  );
  return user;
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
  const resetToken = crypto.randomUUID();
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });
  await sendMail(
    email,
    "Recuperación de contraseña",
    `Usa este token para recuperar tu contraseña: ${resetToken}`,
  );
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
