CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`taskId` integer NOT NULL,
	`userId` integer NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dubbing` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`videoId` integer NOT NULL,
	`transcriptId` integer NOT NULL,
	`targetLanguage` text NOT NULL,
	`voiceProfile` text,
	`outputUrl` text,
	`outputFilePath` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`processingTime` integer,
	`voiceParams` blob,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `renderedVideos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`videoId` integer NOT NULL,
	`dubbingId` integer,
	`targetLanguage` text,
	`outputUrl` text,
	`outputFilePath` text,
	`renderType` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`processingTime` integer,
	`fileSize` integer,
	`duration` integer,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`videoId` integer NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`progressMessage` text,
	`errorDetails` text,
	`startedAt` integer,
	`completedAt` integer,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transcripts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`videoId` integer NOT NULL,
	`language` text NOT NULL,
	`content` text NOT NULL,
	`segments` blob,
	`status` text DEFAULT 'pending' NOT NULL,
	`processingTime` integer,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`lastSignedIn` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);--> statement-breakpoint
CREATE TABLE `videos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`duration` integer,
	`filePath` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`sourcePlatform` text,
	`language` text,
	`fileSize` integer,
	`thumbnailUrl` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
