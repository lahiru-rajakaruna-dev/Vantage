PRAGMA
foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_clients`
(
    `client_id`                text                      NOT NULL,
    `client_organization_id`   text                      NOT NULL,
    `client_name`              text                      NOT NULL,
    `client_nic_number`        text                      NOT NULL,
    `client_email`             text                      NOT NULL,
    `client_phone`             text                      NOT NULL,
    `client_account_status`    text DEFAULT 'UNVERIFIED' NOT NULL,
    `client_registration_date` integer                   NOT NULL,
    PRIMARY KEY (`client_id`, `client_organization_id`),
    FOREIGN KEY (`client_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_clients`("client_id", "client_organization_id", "client_name", "client_nic_number", "client_email",
                            "client_phone", "client_account_status", "client_registration_date")
SELECT "client_id",
       "client_organization_id",
       "client_name",
       "client_nic_number",
       "client_email",
       "client_phone",
       "client_account_status",
       "client_registration_date"
FROM `clients`;--> statement-breakpoint
DROP TABLE `clients`;--> statement-breakpoint
ALTER TABLE `__new_clients` RENAME TO `clients`;--> statement-breakpoint
PRAGMA
foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `client_organization_id_fk_idx` ON `clients` (`client_organization_id`);