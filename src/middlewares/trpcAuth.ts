import { initTRPC, TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { RBACService } from "@/services/rbacService";
import type { JWTPayload } from "@/types/auth";
import type { RBACContext } from "@/types/rbac";

interface ReqWithHeaders {
  headers?: Record<string, string>;
}

const t = initTRPC.context<{ req: ReqWithHeaders }>().create();

// Validar JWT_SECRET al inicializar
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const trpcAuth = t.middleware(async ({ ctx, next }) => {
  const authHeader = ctx.req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authorization header required",
    });
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (!payload.userId || !payload.email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid token payload",
      });
    }

    // Get RBAC context for the user
    let rbacContext: RBACContext | null = null;
    try {
      rbacContext = await RBACService.getRBACContext(payload.userId);
    } catch (error) {
      console.warn("Failed to load RBAC context:", error);
      // Continue without RBAC context if it fails
    }

    return next({
      ctx: {
        ...ctx,
        user: payload,
        rbac: rbacContext,
      },
    });
  } catch (err) {
    console.error("Error al verificar JWT:", err);
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
});
