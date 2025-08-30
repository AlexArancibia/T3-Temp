import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
  confirmUser,
  loginUser,
  registerUser,
  resetPassword,
  sendPasswordReset,
} from "../services/authService";

const t = initTRPC.context<{}>().create();

export const authRouter = t.router({
  register: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(2),
        lastname: z.string().min(2),
        phone: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      return await registerUser(
        input.email,
        input.password,
        input.name,
        input.lastname,
        input.phone,
      );
    }),

  login: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      return await loginUser(input.email, input.password);
    }),

  confirmEmail: t.procedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      return await confirmUser(input.token);
    }),

  recoverPassword: t.procedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      return await sendPasswordReset(input.email);
    }),

  resetPassword: t.procedure
    .input(z.object({ token: z.string(), newPassword: z.string().min(6) }))
    .mutation(async ({ input }) => {
      return await resetPassword(input.token, input.newPassword);
    }),

  // Puedes agregar un procedimiento 'me' si tienes la lógica en el servicio
});
