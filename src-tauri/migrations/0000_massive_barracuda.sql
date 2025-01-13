CREATE TABLE `files` (
	`id` integer PRIMARY KEY NOT NULL,
	`file_path` text,
	`file_hash` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files_id_unique` ON `files` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `files_file_hash_unique` ON `files` (`file_hash`);