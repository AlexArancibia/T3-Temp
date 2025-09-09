import { initTRPC } from "@trpc/server";
import { authRouter } from "./authRouter";
import { rbacRouter } from "./rbacRouter";
import { userRouter } from "./userRouter";

const t = initTRPC.create();

export const appRouter = t.router({
  auth: authRouter,
  user: userRouter,
  rbac: rbacRouter,
});

export type AppRouter = typeof appRouter;
