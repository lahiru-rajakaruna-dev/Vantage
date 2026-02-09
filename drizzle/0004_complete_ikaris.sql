PRAGMA
foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_organizations`
(
    `organization_id`                    text PRIMARY KEY      NOT NULL,
    `organization_admin_id`              text                  NOT NULL,
    `organization_stripe_customer_id`    text                  NOT NULL,
    `organization_name`                  text                  NOT NULL,
    `organization_admin_email`           text                  NOT NULL,
    `organization_admin_phone`           text                  NOT NULL,
    `organization_logo_url`              text                  NOT NULL,
    `organization_registration_date`     integer               NOT NULL,
    `organization_subscription_end_date` integer               NOT NULL,
    `organization_status`                text DEFAULT 'ACTIVE' NOT NULL,
    `organization_subscription_status`   text DEFAULT 'VALID'  NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_organizations`("organization_id", "organization_admin_id", "organization_stripe_customer_id",
                                  "organization_name", "organization_admin_email", "organization_admin_phone",
                                  "organization_logo_url", "organization_registration_date",
                                  "organization_subscription_end_date", "organization_status",
                                  "organization_subscription_status")
SELECT "organization_id",
       "organization_admin_id",
       "organization_stripe_customer_id",
       "organization_name",
       "organization_admin_email",
       "organization_admin_phone",
       "organization_logo_url",
       "organization_registration_date",
       "organization_subscription_end_date",
       "organization_status",
       "organization_subscription_status"
FROM `organizations`;--> statement-breakpoint
DROP TABLE `organizations`;--> statement-breakpoint
ALTER TABLE `__new_organizations` RENAME TO `organizations`;--> statement-breakpoint
PRAGMA
foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_admin_id_unique` ON `organizations` (`organization_admin_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_stripe_customer_id_unique` ON `organizations` (`organization_stripe_customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_name_unique` ON `organizations` (`organization_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_admin_email_unique` ON `organizations` (`organization_admin_email`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_admin_phone_unique` ON `organizations` (`organization_admin_phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_logo_url_unique` ON `organizations` (`organization_logo_url`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `organizations` (`organization_id`);