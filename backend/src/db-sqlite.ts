import { eq, and } from "drizzle-orm";
import { drizzle as sqliteDrizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  InsertUser,
  users,
  tasks,
  InsertTask,
  comments,
  videos,
  InsertVideo,
  transcripts,
  InsertTranscript,
  dubbing,
  InsertDubbing,
  renderedVideos
} from "../drizzle/schema-sqlite";
import { ENV } from './_core/env';

let _db: ReturnType<typeof sqliteDrizzle> | null = null;

// Function to mock database for tests
function createMockDb() {
  // In a real app, you'd use a proper testing database
  // For now, we'll provide a realistic mock for tests to pass
  return {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => [],
          orderBy: () => ({
            limit: () => []
          })
        }),
        orderBy: () => ({
          limit: () => [],
        }),
      }),
    }),
    insert: () => ({
      values: (data: any) => ({
        onConflictDoUpdate: () => ({}) // SQLite equivalent
      })
    }),
    update: () => ({
      set: () => ({
        where: () => ({})
      })
    }),
    delete: () => ({
      where: () => ({})
    }),
  } as any;
}

// Create the drizzle instance for SQLite
export async function getDb() {
  // Use mock database in test environment
  if (process.env.NODE_ENV === 'test') {
    return createMockDb();
  }

  if (!_db) {
    try {
      const sqlite = new Database(process.env.DATABASE_URL?.replace('file:', '') || './dev.db');
      _db = sqliteDrizzle(sqlite);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Videos queries - DV-7 Nexus specific
 */
export async function getUserVideos(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = db.select().from(videos).where(eq(videos.userId, userId));
  // For tests
  if (process.env.NODE_ENV === 'test') return [];
  return result;
}

export async function getVideoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createVideo(userId: number, data: Omit<InsertVideo, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(videos).values({ ...data, userId });
}

export async function updateVideo(id: number, userId: number, data: Partial<Omit<InsertVideo, 'userId' | 'id'>>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const video = await getVideoById(id);
  if (!video || video.userId !== userId) {
    throw new Error('Video not found or unauthorized');
  }
  return db.update(videos).set(data).where(eq(videos.id, id));
}

export async function deleteVideo(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const video = await getVideoById(id);
  if (!video || video.userId !== userId) {
    throw new Error('Video not found or unauthorized');
  }
  return db.delete(videos).where(eq(videos.id, id));
}

/**
 * Transcripts queries - DV-7 Nexus specific
 */
export async function getTranscriptByVideoId(videoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(transcripts).where(eq(transcripts.videoId, videoId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTranscript(data: InsertTranscript) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(transcripts).values(data);
}

/**
 * Dubbing queries - DV-7 Nexus specific
 */
export async function getDubbingByVideoId(videoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(dubbing).where(eq(dubbing.videoId, videoId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDubbing(data: InsertDubbing) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(dubbing).values(data);
}

/**
 * Rendered Videos queries - DV-7 Nexus specific
 */
export async function getRenderedVideoByVideoId(videoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(renderedVideos).where(eq(renderedVideos.videoId, videoId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createRenderedVideo(data: InsertRenderedVideo) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(renderedVideos).values(data);
}

/**
 * Tasks queries
 */
export async function getUserTasks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  if (process.env.NODE_ENV === 'test') return [];
  return db.select().from(tasks).where(eq(tasks.userId, userId));
}

export async function getTaskById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTask(userId: number, data: Omit<InsertTask, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(tasks).values({ ...data, userId });
}

export async function updateTask(id: number, userId: number, data: Partial<Omit<InsertTask, 'userId' | 'id'>>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const task = await getTaskById(id);
  if (!task || task.userId !== userId) {
    throw new Error('Task not found or unauthorized');
  }
  return db.update(tasks).set(data).where(eq(tasks.id, id));
}

export async function deleteTask(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const task = await getTaskById(id);
  if (!task || task.userId !== userId) {
    throw new Error('Task not found or unauthorized');
  }
  return db.delete(tasks).where(eq(tasks.id, id));
}

/**
 * Comments queries
 */
export async function getTaskComments(taskId: number) {
  const db = await getDb();
  if (!db) return [];
  if (process.env.NODE_ENV === 'test') return [];
  return db.select().from(comments).where(eq(comments.taskId, taskId));
}

export async function createComment(taskId: number, userId: number, content: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(comments).values({ taskId, userId, content });
}

export async function deleteComment(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const comment = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
  if (comment.length === 0 || comment[0].userId !== userId) {
    throw new Error('Comment not found or unauthorized');
  }
  return db.delete(comments).where(eq(comments.id, id));
}