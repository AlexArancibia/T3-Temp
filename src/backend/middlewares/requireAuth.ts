import { auth } from "@backend/api/auth";
import type { AuthenticatedRequest } from "@backend/types/request";
import type { ApiResponse } from "@backend/types/response";
import type { NextApiHandler } from "next";
export const requireAuth = (
  handler: (req: AuthenticatedRequest, res: ApiResponse) => void,
): NextApiHandler => {
  return async (req: AuthenticatedRequest, res: ApiResponse) => {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value)
        headers.append(key, Array.isArray(value) ? value.join(",") : value);
    });
    const session = await auth.api.getSession({ headers });
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    return handler(req, res);
  };
};
