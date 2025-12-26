ALTER TABLE `organizations`
    ADD `organization_email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations`
    ADD `organization_phone` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_email_unique` ON `organizations` (`organization_email`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_phone_unique` ON `organizations` (`organization_phone`);