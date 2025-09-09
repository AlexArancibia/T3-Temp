import { z } from "zod";
import { prisma } from "../../lib/db";
import { validateEmail } from "../../utils/validate";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getAll: protectedProcedure.query(async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isConfirmed: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { id: input.id } });
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    }),

  create: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        firstName: z.string(),
      }),
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
          firstName: input.firstName,
          isConfirmed: false,
        },
      });
      return { id: user.id, email: user.email, firstName: user.firstName };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { id: input.id } });
      if (!user) throw new Error("Usuario no encontrado");
      if (input.email && !validateEmail(input.email))
        throw new Error("Email inválido");
      const updated = await prisma.user.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
        },
      });
      return {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { id: input.id } });
      if (!user) throw new Error("Usuario no encontrado");
      await prisma.user.delete({ where: { id: input.id } });
      return true;
    }),
});
