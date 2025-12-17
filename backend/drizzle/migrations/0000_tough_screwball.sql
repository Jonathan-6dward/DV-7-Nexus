CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dubbing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` int NOT NULL,
	`transcriptId` int NOT NULL,
	`targetLanguage` varchar(10) NOT NULL,
	`voiceProfile` varchar(100),
	`outputUrl` varchar(500),
	`outputFilePath` varchar(500),
	`status` enum('pending','processing','completed','error','cancelled') NOT NULL DEFAULT 'pending',
	`processingTime` int,
	`voiceParams` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dubbing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `renderedVideos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` int NOT NULL,
	`dubbingId` int,
	`targetLanguage` varchar(10),
	`outputUrl` varchar(500),
	`outputFilePath` varchar(500),
	`renderType` enum('dubbing','subtitles','both') NOT NULL,
	`status` enum('pending','processing','completed','error','cancelled') NOT NULL DEFAULT 'pending',
	`processingTime` int,
	`fileSize` int,
	`duration` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `renderedVideos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`videoId` int NOT NULL,
	`type` enum('capture','transcription','dubbing','rendering','export') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('pending','processing','completed','error','cancelled') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`progress` int NOT NULL DEFAULT 0,
	`progressMessage` varchar(500),
	`errorDetails` text,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transcripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` int NOT NULL,
	`language` varchar(10) NOT NULL,
	`content` text NOT NULL,
	`segments` json,
	`status` enum('pending','processing','completed','error') NOT NULL DEFAULT 'pending',
	`processingTime` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transcripts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`url` varchar(500) NOT NULL,
	`title` varchar(500),
	`duration` int,
	`filePath` varchar(500) NOT NULL,
	`status` enum('pending','processing','completed','error','cancelled') NOT NULL DEFAULT 'pending',
	`sourcePlatform` varchar(50),
	`language` varchar(10),
	`fileSize` int,
	`thumbnailUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
