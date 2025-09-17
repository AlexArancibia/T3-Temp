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
        name: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          image: true,
          phone: true,
          language: true,
          defaultRiskPercentage: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        image: true,
        phone: true,
        language: true,
        defaultRiskPercentage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        language: z.enum(["ES", "EN", "PT"]).optional(),
        defaultRiskPercentage: z.number().min(0.01).max(100).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findUnique({ where: { id: ctx.user.id } });
      if (!user) throw new Error("Usuario no encontrado");

      if (input.email && !validateEmail(input.email))
        throw new Error("Email inválido");

      // Check if email is already taken by another user
      if (input.email && input.email !== user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: input.email },
        });
        if (existingUser) throw new Error("Email ya registrado");
      }

      const updated = await prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          language: input.language,
          defaultRiskPercentage: input.defaultRiskPercentage,
        },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          image: true,
          phone: true,
          language: true,
          defaultRiskPercentage: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Only allow users to delete their own account or admins to delete any account
      if (input.id !== ctx.user.id) {
        // TODO: Add admin role check here
        throw new Error("No tienes permisos para eliminar este usuario");
      }

      const user = await prisma.user.findUnique({ where: { id: input.id } });
      if (!user) throw new Error("Usuario no encontrado");

      await prisma.user.delete({ where: { id: input.id } });
      return true;
    }),
});
