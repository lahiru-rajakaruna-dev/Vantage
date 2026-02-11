ALTER TABLE `organizations` RENAME COLUMN "organization_stripe_customer_id" TO "organization_paddle_customer_id";--> statement-breakpoint
DROP INDEX `organizations_organization_stripe_customer_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_paddle_customer_id_unique` ON `organizations` (`organization_paddle_customer_id`);