import { initTRPC } from "@trpc/server";
import { authRouter } from "./authRouter";
import { userRouter } from "./userRouter";

const t = initTRPC.create();

export const appRouter = t.router({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
