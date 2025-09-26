import { PrismaClient } from "@prisma/client";

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const globalForPrisma = global as GlobalWithPrisma;

// Check if DATABASE_URL is available, if not provide a fallback for build time
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Graceful shutdown
if (typeof process !== "undefined") {
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
