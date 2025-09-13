"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import React, { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { AppRouter } from "../server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [queryClient] = React.useState(() => new QueryClient());

  const trpcClient = useMemo(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          headers() {
            // Get token from localStorage
            const token = localStorage.getItem("auth_token");
            console.log(
              "tRPC client sending token:",
              token ? "Present" : "Missing",
              "User:",
              user?.email,
            );
            return {
              authorization: token ? `Bearer ${token}` : "",
            };
          },
        }),
      ],
    });
  }, [user]); // Recreate client when user changes

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
