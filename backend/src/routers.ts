import { publicProcedure, protectedProcedure, router } from "./core/trpc";
import { z } from "zod";
import {
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskComments,
  createComment,
  deleteComment,
  getUserByOpenId,
  getVideoById,
  getUserVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getTranscriptByVideoId,
  createTranscript,
  getDubbingByVideoId,
  createDubbing,
  getRenderedVideoByVideoId,
  createRenderedVideo,
} from "./db";

export const appRouter = router({
  health: publicProcedure.query(() => ({ status: 'OK', service: 'DV-7 Nexus Backend', timestamp: new Date() })),

  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie('session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      return { success: true };
    }),
  }),

  // DV-7 Nexus Video Processing Routes
  videos: router({
    list: protectedProcedure.query(({ ctx }) => getUserVideos(ctx.user.id)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const video = await getVideoById(input.id);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Vídeo não encontrado ou não autorizado');
        }
        return video;
      }),

    submit: protectedProcedure
      .input(
        z.object({
          url: z.string().url(),
          targetLanguage: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
          voiceProfile: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const video = await createVideo(ctx.user.id, {
          url: input.url,
          status: 'pending',
          sourcePlatform: extractPlatformFromUrl(input.url),
          filePath: '', // Será preenchido durante o processamento
        });

        return video;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        status: z.enum(['pending', 'processing', 'completed', 'error', 'cancelled']).optional(),
      }))
      .mutation(({ input, ctx }) => {
        const { id, ...data } = input;
        return updateVideo(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => deleteVideo(input.id, ctx.user.id)),
  }),

  transcription: router({
    get: protectedProcedure
      .input(z.object({ videoId: z.number() }))
      .query(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Vídeo não encontrado ou não autorizado');
        }
        return getTranscriptByVideoId(input.videoId);
      }),

    create: protectedProcedure
      .input(z.object({
        videoId: z.number(),
        language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
      }))
      .mutation(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Vídeo não encontrado ou não autorizado');
        }

        return createTranscript({
          videoId: input.videoId,
          language: input.language,
          content: '', // Preenchido após processamento
          status: 'pending',
        });
      }),
  }),

  dubbing: router({
    get: protectedProcedure
      .input(z.object({ videoId: z.number() }))
      .query(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Vídeo não encontrado ou não autorizado');
        }
        return getDubbingByVideoId(input.videoId);
      }),

    create: protectedProcedure
      .input(z.object({
        videoId: z.number(),
        targetLanguage: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
        voiceProfile: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Vídeo não encontrado ou não autorizado');
        }

        return createDubbing({
          videoId: input.videoId,
          transcriptId: 1, // Será dinâmico na implementação real
          targetLanguage: input.targetLanguage,
          voiceProfile: input.voiceProfile,
          status: 'pending',
        });
      }),
  }),

  renderedVideos: router({
    get: protectedProcedure
      .input(z.object({ videoId: z.number() }))
      .query(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Vídeo não encontrado ou não autorizado');
        }
        return getRenderedVideoByVideoId(input.videoId);
      }),
  }),

  tasks: router({
    list: protectedProcedure.query(({ ctx }) => getUserTasks(ctx.user.id)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const task = await getTaskById(input.id);
        if (!task || task.userId !== ctx.user.id) {
          throw new Error('Tarefa não encontrada ou não autorizada');
        }
        return task;
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(['pending', 'processing', 'completed', 'error', 'cancelled']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
      }))
      .mutation(({ input, ctx }) =>
        createTask(ctx.user.id, {
          title: input.title,
          description: input.description,
          status: input.status || 'pending',
          priority: input.priority || 'medium',
          completed: false,
        })
      ),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        status: z.enum(['pending', 'processing', 'completed', 'error', 'cancelled']).optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        completed: z.boolean().optional(),
      }))
      .mutation(({ input, ctx }) => {
        const { id, ...data } = input;
        return updateTask(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => deleteTask(input.id, ctx.user.id)),
  }),

  comments: router({
    list: protectedProcedure
      .input(z.object({ taskId: z.number() }))
      .query(({ input }) => getTaskComments(input.taskId)),

    create: protectedProcedure
      .input(z.object({
        taskId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(({ input, ctx }) =>
        createComment(input.taskId, ctx.user.id, input.content)
      ),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => deleteComment(input.id, ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;

// Helper function to extract platform from URL
function extractPlatformFromUrl(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('reddit.com')) return 'reddit';
  return 'other';
}
