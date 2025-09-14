import { initTRPC } from "@trpc/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

export interface Context {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
  };
}

export const createContext = async (opts: {
  req: Request;
}): Promise<Context> => {
  try {
    // Get the authorization header
    const authHeader = opts.req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {};
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
      email: string;
    };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return {};
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || undefined,
      },
    };
  } catch (_error) {
    return {};
  }
};

export const t = initTRPC.context<Context>().create();
