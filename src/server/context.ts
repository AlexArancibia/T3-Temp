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
  console.log("Creating tRPC context...");

  try {
    // Get the authorization header
    const authHeader = opts.req.headers.get("authorization");
    console.log("Auth header:", authHeader ? "Present" : "Missing");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid auth header found");
      return {};
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    console.log("Token found, length:", token.length);

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
      email: string;
    };
    console.log("Token decoded for user:", decoded.userId);

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
      console.log("User not found in database");
      return {};
    }

    console.log("User found:", user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || undefined,
      },
    };
  } catch (error) {
    console.error("Error creating context:", error);
    return {};
  }
};

export const t = initTRPC.context<Context>().create();
