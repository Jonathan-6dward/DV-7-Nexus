// backend/src/core/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getUserFromToken } from '../utils/auth';
import superjson from 'superjson';

// Initialize TRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Create middleware for authentication
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  // Check for auth token in headers or cookies
  const authHeader = ctx.req.headers.authorization;
  const token = authHeader?.split(' ')[1] || ctx.req.cookies?.token;

  if (!token) {
    return next({
      ctx: {
        user: null,
      },
    });
  }

  try {
    const user = await getUserFromToken(token);
    return next({
      ctx: {
        user,
      },
    });
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
  }
});

// Public middleware (no auth required)
export const publicProcedure = t.procedure;

// Protected middleware (auth required)
export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        user: ctx.user,
      },
    });
  })
);

// Router builder
export const router = t.router;

// Context type
export type Context = {
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
  user: import('../types').User | null;
};