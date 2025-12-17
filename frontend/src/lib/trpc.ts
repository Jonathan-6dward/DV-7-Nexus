// tRPC Client Configuration
// Este é o cliente tRPC configurado para conexão com o backend DV-7 Nexus

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import superjson from 'superjson';
import { QueryClient } from '@tanstack/react-query';
import type {
  Video,
  Transcript,
  Dubbing,
  RenderedVideo,
  User,
  VideoSubmitInput,
  TranscriptCreateInput,
  DubbingCreateInput,
  VideoStatus,
  TranscriptStatus,
  DubbingStatus,
  RenderStatus,
  RenderType,
} from '../types';

// Configuração do Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Configuração do tRPC client para conexão com o backend DV-7 Nexus
export const trpc = createTRPCReact<{
  auth: {
    me: {
      query: () => Promise<User>;
    };
    logout: {
      mutate: () => Promise<{ success: boolean }>;
    };
  };
  videos: {
    list: {
      query: () => Promise<Video[]>;
    };
    get: {
      query: (input: { id: number }) => Promise<Video>;
    };
    submit: {
      mutate: (input: VideoSubmitInput) => Promise<Video>;
    };
    update: {
      mutate: (input: { id: number; title?: string; status?: VideoStatus }) => Promise<void>;
    };
    delete: {
      mutate: (input: { id: number }) => Promise<void>;
    };
  };
  transcription: {
    get: {
      query: (input: { videoId: number }) => Promise<Transcript>;
    };
    create: {
      mutate: (input: TranscriptCreateInput) => Promise<Transcript>;
    };
  };
  dubbing: {
    get: {
      query: (input: { videoId: number }) => Promise<Dubbing>;
    };
    create: {
      mutate: (input: DubbingCreateInput) => Promise<Dubbing>;
    };
  };
  renderedVideos: {
    get: {
      query: (input: { videoId: number }) => Promise<RenderedVideo>;
    };
  };
}>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${window.location.origin}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

// Contexto para a aplicação
export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${window.location.origin}/api/trpc`,
      transformer: superjson,
    }),
  ],
});