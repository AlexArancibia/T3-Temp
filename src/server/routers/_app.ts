import { router } from "../trpc";
import { authRouter } from "./auth";
import { propfirmRouter } from "./propfirm";
import { rbacRouter } from "./rbac";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  rbac: rbacRouter,
  propfirm: propfirmRouter,
});

export type AppRouter = typeof appRouter;
