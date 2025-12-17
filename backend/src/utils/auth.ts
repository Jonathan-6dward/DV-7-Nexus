// backend/src/utils/auth.ts
import { User } from '../types';

/**
 * Validates and extracts user information from authentication token
 * @param token Authentication token from request
 * @returns User object if valid, throws error if invalid
 */
export async function getUserFromToken(token: string): Promise<User | null> {
  // This is a simplified implementation
  // In a real application, this would validate against a JWT or database
  
  if (!token || token.length < 10) {
    throw new Error('Invalid token format');
  }

  // Simulate retrieving user from database
  // In real implementation, this would decode JWT and fetch user from DB
  const userId = parseInt(token.substring(0, 10), 36) % 1000; // Simple mock user ID generation
  
  // Return mock user object - in real implementation would fetch from DB
  return {
    id: userId,
    openId: `user_${userId}`,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    role: 'user',
    createdAt: new Date(),
    lastSignedIn: new Date(),
  };
}

/**
 * Generates authentication token for user
 * @param user User object to generate token for
 * @returns Authentication token string
 */
export async function generateAuthToken(user: User): Promise<string> {
  // This is a simplified token generation
  // In a real application, this would create a JWT token
  
  const tokenPayload = {
    userId: user.id,
    openId: user.openId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
  };
  
  // In real implementation, use JWT.sign() with secret
  return btoa(JSON.stringify(tokenPayload)); // Base64 encoding for mock purposes
}

/**
 * Verifies if a user has required permissions
 * @param user User object to check permissions for
 * @param requiredRole Required role level
 * @returns Boolean indicating if user has required permissions
 */
export function hasPermission(user: User | null, requiredRole: string): boolean {
  if (!user) return false;
  
  if (requiredRole === 'admin') {
    return user.role === 'admin';
  }
  
  // For 'user' role or lower permissions, allow if user is authenticated
  return true;
}