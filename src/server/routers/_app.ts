import { router } from "../trpc";
import { authRouter } from "./auth";
import { rbacRouter } from "./rbac";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  rbac: rbacRouter,
});

export type AppRouter = typeof appRouter;
