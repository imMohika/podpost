ALTER TABLE `files` ADD `task_identifier` text NOT NULL;--> statement-breakpoint
ALTER TABLE `files` ADD `title` text;--> statement-breakpoint
ALTER TABLE `files` ADD `comment` text;--> statement-breakpoint
ALTER TABLE `files` ADD `album` text;--> statement-breakpoint
ALTER TABLE `files` ADD `genre` text;--> statement-breakpoint
ALTER TABLE `files` ADD `year` text;--> statement-breakpoint
CREATE UNIQUE INDEX `files_task_identifier_unique` ON `files` (`task_identifier`);