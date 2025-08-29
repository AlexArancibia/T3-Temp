// src/lib/trpc.ts

import type { AppRouter } from "@backend/trpc/appRouter";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
