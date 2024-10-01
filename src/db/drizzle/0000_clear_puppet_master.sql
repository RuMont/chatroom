CREATE TABLE `client` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`joined_room_id` text,
	FOREIGN KEY (`joined_room_id`) REFERENCES `room`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`room_id` text NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `room` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `nameIdx` ON `room` (`name`);