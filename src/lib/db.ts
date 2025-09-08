import { PrismaClient } from "@prisma/client";

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const globalForPrisma = global as GlobalWithPrisma;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
