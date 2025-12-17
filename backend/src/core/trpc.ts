// backend/src/core/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Request, Response } from 'express';

// Define the context type directly here to avoid import issues
export interface Context {
  req: Request;
  res: Response;
  user: any | null; // Substitua por seu tipo de usuário real quando estiver definido
}

// Initialize TRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Public middleware (no auth required)
export const publicProcedure = t.procedure;

// Protected middleware (auth required)
export const protectedProcedure = t.procedure;

// Router builder
export const router = t.router;