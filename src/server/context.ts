import { initTRPC } from "@trpc/server";
import { auth } from "@/lib/auth";

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
    // Skip auth during build time when DATABASE_URL is not available
    if (!process.env.DATABASE_URL) {
      return {};
    }

    // Get session from Better Auth using cookies
    const session = await auth.api.getSession({
      headers: opts.req.headers,
    });

    if (!session?.user) {
      return {};
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    };
  } catch (_error) {
    return {};
  }
};

export const t = initTRPC.context<Context>().create();
