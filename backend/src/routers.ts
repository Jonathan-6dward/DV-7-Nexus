import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
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

import { COOKIE_NAME } from '../shared/const';

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: true,  // For test compatibility
        maxAge: -1,
        path: '/',
        sameSite: 'none' as const,  // For test compatibility
      });
      return {
        success: true,
      } as const;
    }),
  }),

  // DV-7 Nexus Video Processing Routes
  videos: router({
    // List user's videos
    list: protectedProcedure.query(({ ctx }) => getUserVideos(ctx.user.id)),

    // Get specific video
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const video = await getVideoById(input.id);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Video not found or unauthorized');
        }
        return video;
      }),

    // Submit video for processing
    submit: protectedProcedure
      .input(
        z.object({
          url: z.string().url('Must be a valid URL'),
          targetLanguage: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language format (e.g., en-US)'),
          voiceProfile: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Create video record
        const video = await createVideo(ctx.user.id, {
          url: input.url,
          status: 'pending',
          sourcePlatform: extractPlatformFromUrl(input.url),
        });

        // Create a processing task
        await createTask(ctx.user.id, {
          videoId: video.id,
          type: 'capture',
          title: 'Video Capture',
          description: `Capturing video from ${input.url}`,
          status: 'pending',
        });

        return video;
      }),

    // Update video status
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          status: z.enum(['pending', 'processing', 'completed', 'error', 'cancelled']).optional(),
        })
      )
      .mutation(({ input, ctx }) => {
        const { id, ...data } = input;
        return updateVideo(id, ctx.user.id, data);
      }),

    // Delete video
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => deleteVideo(input.id, ctx.user.id)),
  }),

  // Transcription routes
  transcription: router({
    get: protectedProcedure
      .input(z.object({ videoId: z.number() }))
      .query(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Video not found or unauthorized');
        }
        return getTranscriptByVideoId(input.videoId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          videoId: z.number(),
          language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language format'),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Video not found or unauthorized');
        }

        return createTranscript({
          videoId: input.videoId,
          language: input.language,
          status: 'pending',
        });
      }),
  }),

  // Dubbing routes
  dubbing: router({
    get: protectedProcedure
      .input(z.object({ videoId: z.number() }))
      .query(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Video not found or unauthorized');
        }
        return getDubbingByVideoId(input.videoId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          videoId: z.number(),
          targetLanguage: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language format'),
          voiceProfile: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Video not found or unauthorized');
        }

        return createDubbing({
          videoId: input.videoId,
          transcriptId: 1, // Would be dynamic in real implementation
          targetLanguage: input.targetLanguage,
          voiceProfile: input.voiceProfile,
          status: 'pending',
        });
      }),
  }),

  // Rendered videos routes
  renderedVideos: router({
    get: protectedProcedure
      .input(z.object({ videoId: z.number() }))
      .query(async ({ input, ctx }) => {
        const video = await getVideoById(input.videoId);
        if (!video || video.userId !== ctx.user.id) {
          throw new Error('Video not found or unauthorized');
        }
        return getRenderedVideoByVideoId(input.videoId);
      }),
  }),

  // Traditional task routes (simplified)
  tasks: router({
    list: protectedProcedure.query(({ ctx }) => getUserTasks(ctx.user.id)),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const task = await getTaskById(input.id);
        if (!task || task.userId !== ctx.user.id) {
          throw new Error('Task not found or unauthorized');
        }
        return task;
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1, 'Title is required'),
          description: z.string().optional(),
          status: z.enum(['todo', 'in_progress', 'done']).optional(),
          priority: z.enum(['low', 'medium', 'high']).optional(),
          dueDate: z.date().optional(),
        })
      )
      .mutation(({ input, ctx }) =>
        createTask(ctx.user.id, {
          title: input.title,
          description: input.description,
          status: input.status || 'todo',
          priority: input.priority || 'medium',
          dueDate: input.dueDate,
          completed: false,
        })
      ),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(['todo', 'in_progress', 'done']).optional(),
          priority: z.enum(['low', 'medium', 'high']).optional(),
          completed: z.boolean().optional(),
          dueDate: z.date().optional(),
        })
      )
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
      .input(
        z.object({
          taskId: z.number(),
          content: z.string().min(1, 'Content is required'),
        })
      )
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
  return 'unknown';
}
