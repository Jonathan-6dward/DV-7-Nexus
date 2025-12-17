import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Videos table - armazena informações sobre vídeos processados pelo DV-7 Nexus
 * Cada vídeo pode ter transcrições e dublagens associadas
 */
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Relacionado ao usuário que iniciou o processamento
  url: varchar("url", { length: 500 }).notNull(), // URL original do vídeo
  title: varchar("title", { length: 500 }), // Título do vídeo extraído
  duration: int("duration"), // Duração em segundos
  filePath: varchar("filePath", { length: 500 }).notNull(), // Caminho local onde o vídeo está armazenado
  status: mysqlEnum("status", ["pending", "processing", "completed", "error", "cancelled"]).default("pending").notNull(),
  sourcePlatform: varchar("sourcePlatform", { length: 50 }), // Plataforma de origem (YouTube, TikTok, etc.)
  language: varchar("language", { length: 10 }), // Idioma detectado do vídeo original
  fileSize: int("fileSize"), // Tamanho do arquivo em bytes
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }), // URL da thumbnail
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Transcripts table - armazena transcrições geradas para vídeos
 */
export const transcripts = mysqlTable("transcripts", {
  id: int("id").autoincrement().primaryKey(),
  videoId: int("videoId").notNull(), // Relacionado ao vídeo
  language: varchar("language", { length: 10 }).notNull(), // Idioma da transcrição
  content: text("content").notNull(), // Conteúdo da transcrição
  segments: json("segments"), // Segmentos de tempo de fala (start, end, text)
  status: mysqlEnum("status", ["pending", "processing", "completed", "error"]).default("pending").notNull(),
  processingTime: int("processingTime"), // Tempo de processamento em segundos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transcript = typeof transcripts.$inferSelect;
export type InsertTranscript = typeof transcripts.$inferInsert;

/**
 * Dubbing table - armazena informações sobre dublagens geradas
 */
export const dubbing = mysqlTable("dubbing", {
  id: int("id").autoincrement().primaryKey(),
  videoId: int("videoId").notNull(), // Relacionado ao vídeo original
  transcriptId: int("transcriptId").notNull(), // Relacionado à transcrição usada
  targetLanguage: varchar("targetLanguage", { length: 10 }).notNull(), // Idioma alvo da dublagem
  voiceProfile: varchar("voiceProfile", { length: 100 }), // Perfil de voz usado (ex: "female_neural_en")
  outputUrl: varchar("outputUrl", { length: 500 }), // URL do vídeo dublado
  outputFilePath: varchar("outputFilePath", { length: 500 }), // Caminho local do vídeo dublado
  status: mysqlEnum("status", ["pending", "processing", "completed", "error", "cancelled"]).default("pending").notNull(),
  processingTime: int("processingTime"), // Tempo de processamento em segundos
  voiceParams: json("voiceParams"), // Parâmetros da voz (pitch, speed, etc.)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dubbing = typeof dubbing.$inferSelect;
export type InsertDubbing = typeof dubbing.$inferInsert;

/**
 * RenderedVideos table - armazena vídeos finais renderizados (vídeo original + dublagem)
 */
export const renderedVideos = mysqlTable("renderedVideos", {
  id: int("id").autoincrement().primaryKey(),
  videoId: int("videoId").notNull(), // Relacionado ao vídeo original
  dubbingId: int("dubbingId"), // Relacionado à dublagem (pode ser null se for apenas legendas)
  targetLanguage: varchar("targetLanguage", { length: 10 }), // Idioma do conteúdo final
  outputUrl: varchar("outputUrl", { length: 500 }), // URL do vídeo renderizado
  outputFilePath: varchar("outputFilePath", { length: 500 }), // Caminho local do vídeo renderizado
  renderType: mysqlEnum("renderType", ["dubbing", "subtitles", "both"]).notNull(), // Tipo de renderização
  status: mysqlEnum("status", ["pending", "processing", "completed", "error", "cancelled"]).default("pending").notNull(),
  processingTime: int("processingTime"), // Tempo de processamento em segundos
  fileSize: int("fileSize"), // Tamanho do arquivo renderizado em bytes
  duration: int("duration"), // Duração em segundos do vídeo renderizado
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RenderedVideo = typeof renderedVideos.$inferSelect;
export type InsertRenderedVideo = typeof renderedVideos.$inferInsert;

/**
 * Tasks table - armazena tarefas de processamento (pode ser transcrição, dublagem, renderização)
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  videoId: int("videoId").notNull(), // Relacionado ao vídeo
  type: mysqlEnum("type", ["capture", "transcription", "dubbing", "rendering", "export"]).notNull(), // Tipo de tarefa
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "processing", "completed", "error", "cancelled"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  progress: int("progress").default(0).notNull(), // Progresso de 0 a 100
  progressMessage: varchar("progressMessage", { length: 500 }), // Mensagem de status do progresso
  errorDetails: text("errorDetails"), // Detalhes do erro se ocorrer
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Comments table - comentários/feedback sobre vídeos processados
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").notNull(), // Relacionado à tarefa
  userId: int("userId").notNull(), // Relacionado ao usuário que fez o comentário
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Relations - definem os relacionamentos entre tabelas para queries otimizadas
 */
export const usersRelations = relations(users, ({ many }) => ({
  videos: many(videos),
  tasks: many(tasks),
  comments: many(comments),
}));

export const videosRelations = relations(videos, ({ one, many }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  transcripts: many(transcripts),
  dubbing: many(dubbing),
  renderedVideos: many(renderedVideos),
  tasks: many(tasks),
}));

export const transcriptsRelations = relations(transcripts, ({ one, many }) => ({
  video: one(videos, {
    fields: [transcripts.videoId],
    references: [videos.id],
  }),
  dubbing: many(dubbing),
}));

export const dubbingRelations = relations(dubbing, ({ one, many }) => ({
  video: one(videos, {
    fields: [dubbing.videoId],
    references: [videos.id],
  }),
  transcript: one(transcripts, {
    fields: [dubbing.transcriptId],
    references: [transcripts.id],
  }),
  renderedVideos: many(renderedVideos),
}));

export const renderedVideosRelations = relations(renderedVideos, ({ one }) => ({
  video: one(videos, {
    fields: [renderedVideos.videoId],
    references: [videos.id],
  }),
  dubbing: one(dubbing, {
    fields: [renderedVideos.dubbingId],
    references: [dubbing.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [tasks.videoId],
    references: [videos.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));