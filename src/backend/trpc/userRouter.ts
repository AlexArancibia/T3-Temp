import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { trpcAuth } from "../middlewares/trpcAuth";
import { validateEmail } from "../utils/validate";

const prisma = new PrismaClient();
const t = initTRPC.create();

export const userRouter = t.router({
  getAll: t.procedure.use(trpcAuth).query(async () => {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, isConfirmed: true },
    });
  }),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .use(trpcAuth)
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { id: input.id } });
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    }),
  create: t.procedure
    .input(
      z.object({ email: z.string(), password: z.string(), name: z.string() }),
    )
    .mutation(async ({ input }) => {
      if (!validateEmail(input.email)) throw new Error("Email inválido");
      const exists = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (exists) throw new Error("Email ya registrado");
      const hashed = await import("bcryptjs").then((b) =>
        b.default.hash(input.password, 10),
      );
      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashed,
          name: input.name,
          isConfirmed: false,
        },
      });
      return { id: user.id, email: user.email, name: user.name };
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .use(trpcAuth)
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { id: input.id } });
      if (!user) throw new Error("Usuario no encontrado");
      if (input.email && !validateEmail(input.email))
        throw new Error("Email inválido");
      const updated = await prisma.user.update({
        where: { id: input.id },
        data: { name: input.name, email: input.email },
      });
      return { id: updated.id, email: updated.email, name: updated.name };
    }),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .use(trpcAuth)
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { id: input.id } });
      if (!user) throw new Error("Usuario no encontrado");
      await prisma.user.delete({ where: { id: input.id } });
      return true;
    }),
});
