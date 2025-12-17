import type { Request, Response } from 'express';

// Define the context type
export interface Context {
  req: Request;
  res: Response;
  user: any | null; // Substitua por seu tipo de usuário real quando estiver definido
}