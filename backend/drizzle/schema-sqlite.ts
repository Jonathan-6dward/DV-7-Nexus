import { integer, text, sqliteTable, blob } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  /**
   * Primary key for the user table.
   */
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Videos table - armazena informações sobre vídeos processados pelo DV-7 Nexus
 * Cada vídeo pode ter transcrições e dublagens associadas
 */
export const videos = sqliteTable("videos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(), // Relacionado ao usuário que iniciou o processamento
  url: text("url").notNull(), // URL original do vídeo
  title: text("title"), // Título do vídeo extraído
  duration: integer("duration"), // Duração em segundos
  filePath: text("filePath").notNull(), // Caminho local onde o vídeo está armazenado
  status: text("status", { enum: ["pending", "processing", "completed", "error", "cancelled"] }).default("pending").notNull(),
  sourcePlatform: text("sourcePlatform"), // Plataforma de origem (YouTube, TikTok, etc.)
  language: text("language"), // Idioma detectado do vídeo original
  fileSize: integer("fileSize"), // Tamanho do arquivo em bytes
  thumbnailUrl: text("thumbnailUrl"), // URL da thumbnail
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Transcripts table - armazena transcrições geradas para vídeos
 */
export const transcripts = sqliteTable("transcripts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  videoId: integer("videoId").notNull(), // Relacionado ao vídeo
  language: text("language").notNull(), // Idioma da transcrição
  content: text("content").notNull(), // Conteúdo da transcrição
  segments: blob("segments", { mode: "json" }), // Segmentos de tempo de fala (start, end, text)
  status: text("status", { enum: ["pending", "processing", "completed", "error"] }).default("pending").notNull(),
  processingTime: integer("processingTime"), // Tempo de processamento em segundos
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

export type Transcript = typeof transcripts.$inferSelect;
export type InsertTranscript = typeof transcripts.$inferInsert;

/**
 * Dubbing table - armazena informações sobre dublagens geradas
 */
export const dubbing = sqliteTable("dubbing", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  videoId: integer("videoId").notNull(), // Relacionado ao vídeo original
  transcriptId: integer("transcriptId").notNull(), // Relacionado à transcrição usada
  targetLanguage: text("targetLanguage").notNull(), // Idioma alvo da dublagem
  voiceProfile: text("voiceProfile"), // Perfil de voz usado (ex: "female_neural_en")
  outputUrl: text("outputUrl"), // URL do vídeo dublado
  outputFilePath: text("outputFilePath"), // Caminho local do vídeo dublado
  status: text("status", { enum: ["pending", "processing", "completed", "error", "cancelled"] }).default("pending").notNull(),
  processingTime: integer("processingTime"), // Tempo de processamento em segundos
  voiceParams: blob("voiceParams", { mode: "json" }), // Parâmetros da voz (pitch, speed, etc.)
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

export type Dubbing = typeof dubbing.$inferSelect;
export type InsertDubbing = typeof dubbing.$inferInsert;

/**
 * RenderedVideos table - armazena vídeos finais renderizados (vídeo original + dublagem)
 */
export const renderedVideos = sqliteTable("renderedVideos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  videoId: integer("videoId").notNull(), // Relacionado ao vídeo original
  dubbingId: integer("dubbingId"), // Relacionado à dublagem (pode ser null se for apenas legendas)
  targetLanguage: text("targetLanguage"), // Idioma do conteúdo final
  outputUrl: text("outputUrl"), // URL do vídeo renderizado
  outputFilePath: text("outputFilePath"), // Caminho local do vídeo renderizado
  renderType: text("renderType", { enum: ["dubbing", "subtitles", "both"] }).notNull(), // Tipo de renderização
  status: text("status", { enum: ["pending", "processing", "completed", "error", "cancelled"] }).default("pending").notNull(),
  processingTime: integer("processingTime"), // Tempo de processamento em segundos
  fileSize: integer("fileSize"), // Tamanho do arquivo renderizado em bytes
  duration: integer("duration"), // Duração em segundos do vídeo renderizado
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

export type RenderedVideo = typeof renderedVideos.$inferSelect;
export type InsertRenderedVideo = typeof renderedVideos.$inferInsert;

/**
 * Tasks table - armazena tarefas de processamento (pode ser transcrição, dublagem, renderização)
 */
export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  videoId: integer("videoId").notNull(), // Relacionado ao vídeo
  type: text("type", { enum: ["capture", "transcription", "dubbing", "rendering", "export"] }).notNull(), // Tipo de tarefa
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["pending", "processing", "completed", "error", "cancelled"] }).default("pending").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] }).default("medium").notNull(),
  progress: integer("progress").default(0).notNull(), // Progresso de 0 a 100
  progressMessage: text("progressMessage"), // Mensagem de status do progresso
  errorDetails: text("errorDetails"), // Detalhes do erro se ocorrer
  startedAt: integer("startedAt", { mode: "timestamp_ms" }),
  completedAt: integer("completedAt", { mode: "timestamp_ms" }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Comments table - comentários/feedback sobre vídeos processados
 */
export const comments = sqliteTable("comments", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  taskId: integer("taskId").notNull(), // Relacionado à tarefa
  userId: integer("userId").notNull(), // Relacionado ao usuário que fez o comentário
  content: text("content").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().defaultNow(),
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