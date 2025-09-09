// src/app/_trpc/trpc.ts

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/trpc/appRouter";

export const trpc = createTRPCReact<AppRouter>();
