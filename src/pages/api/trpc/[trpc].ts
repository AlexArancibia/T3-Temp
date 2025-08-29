import type { AppRouter } from "@backend/trpc/appRouter";
import { appRouter } from "@backend/trpc/appRouter";
import { createNextApiHandler } from "@trpc/server/adapters/next";

export default createNextApiHandler({
  router: appRouter,
  createContext: ({ req, res }) => ({ req, res }),
});
