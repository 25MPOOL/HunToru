CREATE TABLE `themes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`difficulty` text NOT NULL,
	`display_text` text NOT NULL,
	`ai_condition` text NOT NULL
);
