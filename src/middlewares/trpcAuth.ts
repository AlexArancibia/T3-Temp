import { initTRPC } from "@trpc/server";

interface ReqWithHeaders {
  headers?: Record<string, string>;
}
const t = initTRPC.context<{ req: ReqWithHeaders }>().create();

export const trpcAuth = t.middleware(async ({ ctx, next }) => {
  const authHeader =
    ctx.req?.headers?.authorization ||
    ctx.req?.headers?.Authorization ||
    ctx.req?.headers?.AUTHORIZATION;
  console.log("Authorization header (multi-case):", authHeader);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  console.log("Authorization header:", authHeader);
  if (!authHeader) throw new Error("No autorizado");
  const token = authHeader.replace("Bearer ", "");
  console.log("Token recibido:", token);
  try {
    const payload = require("jsonwebtoken").verify(
      token,
      process.env.JWT_SECRET || "secret",
    );
    console.log("Payload JWT:", payload);
    return next({ ctx: { ...ctx, user: payload } });
  } catch (err) {
    console.error("Error al verificar JWT:", err);
    throw new Error("Token inválido");
  }
});
