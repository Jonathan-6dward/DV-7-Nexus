// backend/src/context.ts
import { type inferAsyncReturnType } from '@trpc/server';
import { getUserFromToken } from './utils/auth';
import type { Request, Response } from 'express';

// Define the context type
export interface Context {
  req: Request;
  res: Response;
  user: any | null; // Substitua por seu tipo de usuário real quando estiver definido
}

/**
 * Creates context for tRPC calls
 * @param opts Object containing express req and res
 * @returns Context object with user and response objects
 */
export async function createContext({ req, res }: { req: Request; res: Response }): Promise<Context> {
  let user = null;
  try {
    // Extract token from header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || (req.cookies as Record<string, string>)?.token; // Fallback to cookie

    if (token) {
      user = await getUserFromToken(token);
    }
  } catch (error) {
    // If token is invalid, user remains null
    console.warn('Invalid token, proceeding without authentication:', error);
  }

  return {
    req,
    res,
    user, // Will be null if not authenticated
  };
}

export type TrpcContext = inferAsyncReturnType<typeof createContext>;