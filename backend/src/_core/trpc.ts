import { initTRPC, TRPCError } from "@trpc/server";
import type { TrpcContext } from "./context";

// Define error messages locally since we don't have @shared
const UNAUTHED_ERR_MSG = 'Unauthorized: User must be logged in';
const NOT_ADMIN_ERR_MSG = 'Forbidden: Admin role required';

const t = initTRPC.context<TrpcContext>().create({
  // Removed transformer for simplicity
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
