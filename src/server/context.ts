import { initTRPC } from "@trpc/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export interface Context {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  rbac?: unknown;
}

export const createContext = async (opts: {
  req: Request;
}): Promise<Context> => {
  try {
    // Get session from Better Auth using cookies
    const session = await auth.api.getSession({
      headers: opts.req.headers,
    });

    if (!session?.user) {
      return {};
    }

    // Get user from database for additional info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return {};
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (_error) {
    return {};
  }
};

export const t = initTRPC.context<Context>().create();
