import { prisma } from "@backend/lib/db";
import { sendMail } from "@backend/lib/mailer";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { toNextJsHandler } from "better-auth/next-js";

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
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

export const { GET, POST } = toNextJsHandler(auth);
