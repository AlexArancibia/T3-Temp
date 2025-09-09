import { initTRPC } from "@trpc/server";

export interface Context {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
  };
}

export const createContext = (): Context => {
  return {};
};

export const t = initTRPC.context<Context>().create();
