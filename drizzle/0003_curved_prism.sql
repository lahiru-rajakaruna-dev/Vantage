PRAGMA
foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_employees`
(
    `employee_id`                  text                        NOT NULL,
    `employee_organization_id`     text                        NOT NULL,
    `employee_sales_group_id`      text,
    `employee_profile_picture_url` text,
    `employee_first_name`          text,
    `employee_last_name`           text,
    `employee_phone`               text,
    `employee_nic_number`          text                        NOT NULL,
    `employee_active_territory`    text,
    `employee_registration_date`   integer                     NOT NULL,
    `employee_status`              text DEFAULT 'NOT_REPORTED' NOT NULL,
    PRIMARY KEY (`employee_id`, `employee_organization_id`),
    FOREIGN KEY (`employee_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_sales_group_id`, `employee_organization_id`) REFERENCES `sales_groups` (`sales_group_id`, `sales_group_organization_id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_employees`("employee_id", "employee_organization_id", "employee_sales_group_id",
                              "employee_profile_picture_url", "employee_first_name", "employee_last_name",
                              "employee_phone", "employee_nic_number", "employee_active_territory",
                              "employee_registration_date", "employee_status")
SELECT "employee_id",
       "employee_organization_id",
       "employee_sales_group_id",
       "employee_profile_picture_url",
       "employee_first_name",
       "employee_last_name",
       "employee_phone",
       "employee_nic_number",
       "employee_active_territory",
       "employee_registration_date",
       "employee_status"
FROM `employees`;--> statement-breakpoint
DROP TABLE `employees`;--> statement-breakpoint
ALTER TABLE `__new_employees` RENAME TO `employees`;--> statement-breakpoint
PRAGMA
foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `employees_employee_nic_number_unique` ON `employees` (`employee_nic_number`);--> statement-breakpoint
CREATE INDEX `employee_id_idx` ON `employees` (`employee_id`);--> statement-breakpoint
CREATE INDEX `employee_organization_id_fk_idx` ON `employees` (`employee_organization_id`);--> statement-breakpoint
CREATE INDEX `employee_sales_group_id_fk_idx` ON `employees` (`employee_sales_group_id`);--> statement-breakpoint
CREATE INDEX `employee_nic_idx` ON `employees` (`employee_nic_number`);