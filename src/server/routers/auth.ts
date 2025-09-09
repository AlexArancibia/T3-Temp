import { z } from "zod";
import {
  confirmUser,
  loginUser,
  registerUser,
  resetPassword,
  sendPasswordReset,
} from "../../services/authService";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  register: publicProcedure
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

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      return await loginUser(input.email, input.password);
    }),

  confirmEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      return await confirmUser(input.token);
    }),

  recoverPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      return await sendPasswordReset(input.email);
    }),

  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), newPassword: z.string().min(6) }))
    .mutation(async ({ input }) => {
      return await resetPassword(input.token, input.newPassword);
    }),
});
