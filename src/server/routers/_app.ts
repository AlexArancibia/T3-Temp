import { router } from "../trpc";
import { propfirmRouter } from "./propfirm";
import { rbacRouter } from "./rbac";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  rbac: rbacRouter,
  propfirm: propfirmRouter,
});

export type AppRouter = typeof appRouter;
