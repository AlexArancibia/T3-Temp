import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/mailer";
import type { GoogleProfile } from "@/types/auth";

const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "BETTER_AUTH_SECRET",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendResetPasswordEmail(user.email, url);
      } catch (_error) {
        throw new Error("Failed to send password reset email");
      }
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendVerificationEmail(user.email, url);
      } catch (_error) {
        throw new Error("Failed to send verification email");
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile: GoogleProfile) => {
        return {
          name:
            profile.name ||
            `${profile.given_name || ""} ${profile.family_name || ""}`.trim(),
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture,
        };
      },
    },
  },

  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: { id: string };
      account: { providerId?: string };
    }) {
      if (account?.providerId === "google") {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true },
          });
        } catch (_error) {
          // Continue even if update fails
        }
      }
      return true;
    },
  },

  security: {
    corsOrigin:
      process.env.NODE_ENV === "production"
        ? [process.env.SITE_URL || "https://your-domain.com"]
        : ["http://localhost:3000"],
  },

  logger: {
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
  },
});
