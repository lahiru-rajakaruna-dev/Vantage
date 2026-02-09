DROP TABLE `employees_leaves`;--> statement-breakpoint
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
CREATE INDEX `client_organization_id_fk_idx` ON `clients` (`client_organization_id`);--> statement-breakpoint
CREATE TABLE `__new_clients_payments`
(
    `client_payment_id`              text                   NOT NULL,
    `client_payment_client_id`       text                   NOT NULL,
    `client_payment_organization_id` text                   NOT NULL,
    `client_payment_amount`          real                   NOT NULL,
    `client_payment_date`            integer                NOT NULL,
    `client_payment_status`          text DEFAULT 'PENDING' NOT NULL,
    PRIMARY KEY (`client_payment_id`, `client_payment_client_id`, `client_payment_organization_id`),
    FOREIGN KEY (`client_payment_client_id`, `client_payment_organization_id`) REFERENCES `clients` (`client_id`, `client_organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`client_payment_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_clients_payments`("client_payment_id", "client_payment_client_id", "client_payment_organization_id",
                                     "client_payment_amount", "client_payment_date", "client_payment_status")
SELECT "client_payment_id",
       "client_payment_client_id",
       "client_payment_organization_id",
       "client_payment_amount",
       "client_payment_date",
       "client_payment_status"
FROM `clients_payments`;--> statement-breakpoint
DROP TABLE `clients_payments`;--> statement-breakpoint
ALTER TABLE `__new_clients_payments` RENAME TO `clients_payments`;--> statement-breakpoint
CREATE INDEX `client_payment_id_idx` ON `clients_payments` (`client_payment_id`);--> statement-breakpoint
CREATE INDEX `client_payment_client_id_fk_idx` ON `clients_payments` (`client_payment_client_id`);--> statement-breakpoint
CREATE INDEX `client_payment_organization_id_fk_idx` ON `clients_payments` (`client_payment_organization_id`);--> statement-breakpoint
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
    FOREIGN KEY (`employee_sales_group_id`) REFERENCES `sales_groups` (`sales_group_id`) ON UPDATE no action ON DELETE set null
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
CREATE UNIQUE INDEX `employees_employee_nic_number_unique` ON `employees` (`employee_nic_number`);--> statement-breakpoint
CREATE INDEX `employee_id_idx` ON `employees` (`employee_id`);--> statement-breakpoint
CREATE INDEX `employee_organization_id_fk_idx` ON `employees` (`employee_organization_id`);--> statement-breakpoint
CREATE INDEX `employee_sales_group_id_fk_idx` ON `employees` (`employee_sales_group_id`);--> statement-breakpoint
CREATE INDEX `employee_nic_idx` ON `employees` (`employee_nic_number`);--> statement-breakpoint
CREATE TABLE `__new_employees_activities`
(
    `employee_activity_id`              text PRIMARY KEY      NOT NULL,
    `employee_activity_employee_id`     text                  NOT NULL,
    `employee_activity_organization_id` text                  NOT NULL,
    `employee_activity_type`            text                  NOT NULL,
    `employee_activity_timestamp`       integer               NOT NULL,
    `employee_activity_message`         text                  NOT NULL,
    `employee_activity_latitude`        real,
    `employee_activity_longitude`       real,
    `employee_activity_ip_address`      text,
    `employee_activity_status`          text DEFAULT 'ACTIVE' NOT NULL,
    `employee_activity_created_at`      integer               NOT NULL,
    `employee_activity_updated_at`      integer               NOT NULL,
    FOREIGN KEY (`employee_activity_employee_id`, `employee_activity_organization_id`) REFERENCES `employees` (`employee_id`, `employee_organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_activity_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_employees_activities`("employee_activity_id", "employee_activity_employee_id",
                                         "employee_activity_organization_id", "employee_activity_type",
                                         "employee_activity_timestamp", "employee_activity_message",
                                         "employee_activity_latitude", "employee_activity_longitude",
                                         "employee_activity_ip_address", "employee_activity_status",
                                         "employee_activity_created_at", "employee_activity_updated_at")
SELECT "employee_activity_id",
       "employee_activity_employee_id",
       "employee_activity_organization_id",
       "employee_activity_type",
       "employee_activity_timestamp",
       "employee_activity_message",
       "employee_activity_latitude",
       "employee_activity_longitude",
       "employee_activity_ip_address",
       "employee_activity_status",
       "employee_activity_created_at",
       "employee_activity_updated_at"
FROM `employees_activities`;--> statement-breakpoint
DROP TABLE `employees_activities`;--> statement-breakpoint
ALTER TABLE `__new_employees_activities` RENAME TO `employees_activities`;--> statement-breakpoint
CREATE UNIQUE INDEX `employees_activities_employee_activity_id_unique` ON `employees_activities` (`employee_activity_id`);--> statement-breakpoint
CREATE INDEX `employee_activity_employee_id_idx` ON `employees_activities` (`employee_activity_employee_id`);--> statement-breakpoint
CREATE INDEX `employee_activity_organization_id_idx` ON `employees_activities` (`employee_activity_organization_id`);--> statement-breakpoint
CREATE INDEX `employee_activity_type_idx` ON `employees_activities` (`employee_activity_type`);--> statement-breakpoint
CREATE INDEX `employee_activity_timestamp_idx` ON `employees_activities` (`employee_activity_timestamp`);--> statement-breakpoint
CREATE INDEX `employee_activity_employee_timestamp_idx` ON `employees_activities` (`employee_activity_employee_id`, `employee_activity_timestamp`);--> statement-breakpoint
CREATE TABLE `__new_employees_attendances`
(
    `employee_attendance_id`                 text              NOT NULL,
    `employee_attendance_employee_id`        text              NOT NULL,
    `employee_attendance_organization_id`    text              NOT NULL,
    `employee_attendance_year`               integer           NOT NULL,
    `employee_attendance_month`              integer           NOT NULL,
    `employee_attendance_total_reported`     integer DEFAULT 0 NOT NULL,
    `employee_attendance_total_non_reported` integer DEFAULT 0 NOT NULL,
    `employee_attendance_total_half_days`    integer DEFAULT 0 NOT NULL,
    `employee_attendance_total_day_offs`     integer DEFAULT 0 NOT NULL,
    PRIMARY KEY (`employee_attendance_id`, `employee_attendance_organization_id`, `employee_attendance_employee_id`),
    FOREIGN KEY (`employee_attendance_employee_id`,
                 `employee_attendance_organization_id`) REFERENCES `employees` (`employee_id`, `employee_organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_attendance_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_employees_attendances`("employee_attendance_id", "employee_attendance_employee_id",
                                          "employee_attendance_organization_id", "employee_attendance_year",
                                          "employee_attendance_month", "employee_attendance_total_reported",
                                          "employee_attendance_total_non_reported",
                                          "employee_attendance_total_half_days", "employee_attendance_total_day_offs")
SELECT "employee_attendance_id",
       "employee_attendance_employee_id",
       "employee_attendance_organization_id",
       "employee_attendance_year",
       "employee_attendance_month",
       "employee_attendance_total_reported",
       "employee_attendance_total_non_reported",
       "employee_attendance_total_half_days",
       "employee_attendance_total_day_offs"
FROM `employees_attendances`;--> statement-breakpoint
DROP TABLE `employees_attendances`;--> statement-breakpoint
ALTER TABLE `__new_employees_attendances` RENAME TO `employees_attendances`;--> statement-breakpoint
CREATE UNIQUE INDEX `employees_attendances_employee_attendance_id_unique` ON `employees_attendances` (`employee_attendance_id`);--> statement-breakpoint
CREATE INDEX `employee_attendance_employee_id_idx` ON `employees_attendances` (`employee_attendance_employee_id`);--> statement-breakpoint
CREATE INDEX `employee_attendance_organization_id_idx` ON `employees_attendances` (`employee_attendance_organization_id`);--> statement-breakpoint
CREATE TABLE `__new_employees_credentials`
(
    `employee_credential_id`              text NOT NULL,
    `employee_credential_employee_id`     text NOT NULL,
    `employee_credential_organization_id` text NOT NULL,
    `employee_credential_username`        text NOT NULL,
    `employee_credential_password`        text NOT NULL,
    PRIMARY KEY (`employee_credential_id`, `employee_credential_employee_id`, `employee_credential_organization_id`),
    FOREIGN KEY (`employee_credential_employee_id`,
                 `employee_credential_organization_id`) REFERENCES `employees` (`employee_id`, `employee_organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_credential_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_employees_credentials`("employee_credential_id", "employee_credential_employee_id",
                                          "employee_credential_organization_id", "employee_credential_username",
                                          "employee_credential_password")
SELECT "employee_credential_id",
       "employee_credential_employee_id",
       "employee_credential_organization_id",
       "employee_credential_username",
       "employee_credential_password"
FROM `employees_credentials`;--> statement-breakpoint
DROP TABLE `employees_credentials`;--> statement-breakpoint
ALTER TABLE `__new_employees_credentials` RENAME TO `employees_credentials`;--> statement-breakpoint
CREATE UNIQUE INDEX `employees_credentials_employee_credential_username_unique` ON `employees_credentials` (`employee_credential_username`);--> statement-breakpoint
CREATE INDEX `employee_credential_username_idx` ON `employees_credentials` (`employee_credential_username`);--> statement-breakpoint
CREATE TABLE `__new_employees_salaries`
(
    `employee_salary_id`                    text              NOT NULL,
    `employee_salary_organization_id`       text              NOT NULL,
    `employee_salary_employee_id`           text              NOT NULL,
    `employee_salary_base`                  real              NOT NULL,
    `employee_salary_commission_percentage` integer DEFAULT 0 NOT NULL,
    PRIMARY KEY (`employee_salary_id`, `employee_salary_organization_id`, `employee_salary_employee_id`),
    FOREIGN KEY (`employee_salary_employee_id`, `employee_salary_organization_id`) REFERENCES `employees` (`employee_id`, `employee_organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_salary_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_employees_salaries`("employee_salary_id", "employee_salary_organization_id",
                                       "employee_salary_employee_id", "employee_salary_base",
                                       "employee_salary_commission_percentage")
SELECT "employee_salary_id",
       "employee_salary_organization_id",
       "employee_salary_employee_id",
       "employee_salary_base",
       "employee_salary_commission_percentage"
FROM `employees_salaries`;--> statement-breakpoint
DROP TABLE `employees_salaries`;--> statement-breakpoint
ALTER TABLE `__new_employees_salaries` RENAME TO `employees_salaries`;--> statement-breakpoint
CREATE INDEX `employee_salary_id_idx` ON `employees_salaries` (`employee_salary_id`);--> statement-breakpoint
CREATE INDEX `employee_salary_organization_id_fk_idx` ON `employees_salaries` (`employee_salary_organization_id`);--> statement-breakpoint
CREATE INDEX `employee_salary_employee_id_fk_idx` ON `employees_salaries` (`employee_salary_employee_id`);--> statement-breakpoint
CREATE TABLE `__new_items`
(
    `item_id`               text NOT NULL,
    `item_organization_id`  text NOT NULL,
    `item_name`             text NOT NULL,
    `item_stock_unit_count` integer DEFAULT 0,
    PRIMARY KEY (`item_id`, `item_organization_id`),
    FOREIGN KEY (`item_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_items`("item_id", "item_organization_id", "item_name", "item_stock_unit_count")
SELECT "item_id", "item_organization_id", "item_name", "item_stock_unit_count"
FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;--> statement-breakpoint
CREATE INDEX `item_id_idx` ON `items` (`item_id`);--> statement-breakpoint
CREATE INDEX `item_organization_id_fk_idx` ON `items` (`item_organization_id`);--> statement-breakpoint
CREATE TABLE `__new_organizations_payments`
(
    `organization_payment_id`              text                    NOT NULL,
    `organization_payment_organization_id` text                    NOT NULL,
    `organization_payment_amount`          real                    NOT NULL,
    `organization_payment_status`          text DEFAULT 'VERIFIED' NOT NULL,
    `organization_payment_timestamp`       integer                 NOT NULL,
    PRIMARY KEY (`organization_payment_id`, `organization_payment_organization_id`),
    FOREIGN KEY (`organization_payment_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_organizations_payments`("organization_payment_id", "organization_payment_organization_id",
                                           "organization_payment_amount", "organization_payment_status",
                                           "organization_payment_timestamp")
SELECT "organization_payment_id",
       "organization_payment_organization_id",
       "organization_payment_amount",
       "organization_payment_status",
       "organization_payment_timestamp"
FROM `organizations_payments`;--> statement-breakpoint
DROP TABLE `organizations_payments`;--> statement-breakpoint
ALTER TABLE `__new_organizations_payments` RENAME TO `organizations_payments`;--> statement-breakpoint
CREATE INDEX `organization_payment_id_idx` ON `organizations_payments` (`organization_payment_id`);--> statement-breakpoint
CREATE INDEX `organization_payment_organization_id_fk_idx` ON `organizations_payments` (`organization_payment_organization_id`);--> statement-breakpoint
CREATE TABLE `__new_sales`
(
    `sale_id`                text              NOT NULL,
    `sale_organization_id`   text              NOT NULL,
    `sale_employee_id`       text              NOT NULL,
    `sale_client_id`         text              NOT NULL,
    `sale_client_payment_id` text              NOT NULL,
    `sale_item_id`           text              NOT NULL,
    `sale_item_unit_count`   integer DEFAULT 1 NOT NULL,
    `sale_value`             real              NOT NULL,
    `sale_date`              integer           NOT NULL,
    PRIMARY KEY (`sale_id`, `sale_organization_id`, `sale_employee_id`, `sale_client_id`, `sale_client_payment_id`,
                 `sale_item_id`),
    FOREIGN KEY (`sale_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_employee_id`, `sale_organization_id`) REFERENCES `employees` (`employee_id`, `employee_organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_client_id`, `sale_organization_id`) REFERENCES `clients` (`client_id`, `client_organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_client_payment_id`, `sale_organization_id`) REFERENCES `clients_payments` (`client_payment_id`, `client_payment_organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_item_id`, `sale_organization_id`) REFERENCES `items` (`item_id`, `item_organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sales`("sale_id", "sale_organization_id", "sale_employee_id", "sale_client_id",
                          "sale_client_payment_id", "sale_item_id", "sale_item_unit_count", "sale_value", "sale_date")
SELECT "sale_id",
       "sale_organization_id",
       "sale_employee_id",
       "sale_client_id",
       "sale_client_payment_id",
       "sale_item_id",
       "sale_item_unit_count",
       "sale_value",
       "sale_date"
FROM `sales`;--> statement-breakpoint
DROP TABLE `sales`;--> statement-breakpoint
ALTER TABLE `__new_sales` RENAME TO `sales`;--> statement-breakpoint
CREATE INDEX `sale_id_idx` ON `sales` (`sale_id`);--> statement-breakpoint
CREATE INDEX `sale_organization_id_fk_idx` ON `sales` (`sale_organization_id`);--> statement-breakpoint
CREATE INDEX `sale_employee_id_fk_idx` ON `sales` (`sale_employee_id`);--> statement-breakpoint
CREATE INDEX `sale_client_id_fk_idx` ON `sales` (`sale_client_id`);--> statement-breakpoint
CREATE INDEX `sale_client_payment_id_fk_idx` ON `sales` (`sale_client_payment_id`);--> statement-breakpoint
CREATE INDEX `sale_item_id_fk_idx` ON `sales` (`sale_item_id`);--> statement-breakpoint
CREATE TABLE `__new_sales_groups`
(
    `sales_group_id`              text NOT NULL,
    `sales_group_organization_id` text NOT NULL,
    `sales_group_name`            text NOT NULL,
    `sales_group_territory`       text NOT NULL,
    PRIMARY KEY (`sales_group_id`, `sales_group_organization_id`),
    FOREIGN KEY (`sales_group_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sales_groups`("sales_group_id", "sales_group_organization_id", "sales_group_name",
                                 "sales_group_territory")
SELECT "sales_group_id", "sales_group_organization_id", "sales_group_name", "sales_group_territory"
FROM `sales_groups`;--> statement-breakpoint
DROP TABLE `sales_groups`;--> statement-breakpoint
ALTER TABLE `__new_sales_groups` RENAME TO `sales_groups`;--> statement-breakpoint
CREATE UNIQUE INDEX `sales_groups_sales_group_name_unique` ON `sales_groups` (`sales_group_name`);--> statement-breakpoint
CREATE INDEX `sales_group_organization_id_fk_idx` ON `sales_groups` (`sales_group_organization_id`);--> statement-breakpoint
CREATE INDEX `sales_group_name_unique_idx` ON `sales_groups` (`sales_group_name`);