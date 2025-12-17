// backend/src/context.ts
import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getUserFromToken } from './utils/auth';

/**
 * Creates context for tRPC calls
 * @param opts CreateExpressContextOptions from express adapter
 * @returns Context object with user and response objects
 */
export async function createContext(opts: CreateExpressContextOptions) {
  const { req, res } = opts;
  
  let user = null;
  try {
    // Extract token from header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || req.cookies?.token; // Fallback to cookie
    
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

export type Context = inferAsyncReturnType<typeof createContext>;