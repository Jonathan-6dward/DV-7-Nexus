// tRPC Client Configuration - DV-7 Nexus
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../backend/src/routers';

// Create tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Get API URL from environment variables
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return import.meta.env.VITE_TRPC_URL || 'http://localhost:3000/api/trpc';
  }
  // SSR should use absolute URL
  return import.meta.env.VITE_TRPC_URL || 'http://localhost:3000/api/trpc';
};

// Create tRPC client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getBaseUrl(),
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          // authorization: getAuthCookie(),
        };
      },
      // Enable credentials for cookies
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});
