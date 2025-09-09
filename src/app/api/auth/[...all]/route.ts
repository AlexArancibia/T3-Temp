import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { toNextJsHandler } from "better-auth/next-js";
import { config } from "@/lib/config";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import type {
  AuthAccount,
  AuthSession,
  AuthToken,
  AuthUser,
  GoogleProfile,
} from "@/types/auth";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { email: string };
      url: string;
    }) => {
      await sendMail(
        user.email,
        "Confirma tu cuenta",
        `Haz click aquí: ${url}`,
      );
    },
    sendResetPassword: async ({
      user,
      url,
    }: {
      user: { email: string };
      url: string;
    }) => {
      await sendMail(
        user.email,
        "Restablece tu contraseña",
        `Haz click aquí: ${url}`,
      );
    },
  },
  socialProviders: {
    google: {
      clientId: config.auth.google.clientId,
      clientSecret: config.auth.google.clientSecret,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name || profile.name || "Usuario",
          lastName: profile.family_name || "",
          image: profile.picture,
          emailVerified: profile.email_verified,
        };
      },
    },
  },
  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7, // 7 días
  },
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: AuthUser;
      account: AuthAccount;
      profile: GoogleProfile;
    }) {
      try {
        // Si es un usuario de Google, marcarlo como confirmado
        if (account?.provider === "google") {
          await prisma.user.update({
            where: { id: user.id },
            data: { isConfirmed: true },
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true; // Permitir el login incluso si hay error en la actualización
      }
    },
    async session({
      session,
      token,
    }: {
      session: AuthSession;
      token: AuthToken;
    }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({
      token,
      user,
    }: {
      token: AuthToken;
      user: AuthUser;
      account: AuthAccount;
    }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});

export const { GET, POST } = toNextJsHandler(auth);
