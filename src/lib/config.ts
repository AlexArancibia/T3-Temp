export const config = {
  auth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
    },
    nextAuth: {
      url: process.env.NEXTAUTH_URL || "http://localhost:3000",
      secret: process.env.NEXTAUTH_SECRET!,
    },
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  },
} as const;

// Validación de variables de entorno requeridas
export function validateConfig() {
  const requiredEnvVars = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "JWT_SECRET",
    "NEXTAUTH_SECRET",
    "DATABASE_URL",
    "SMTP_USER",
    "SMTP_PASS",
  ];

  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
}
