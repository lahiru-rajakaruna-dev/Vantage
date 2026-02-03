CREATE TABLE `clients`
(
    `client_id`                 text                      NOT NULL,
    `client_organization_id`    text                      NOT NULL,
    `client_stripe_customer_id` text                      NOT NULL,
    `client_name`               text                      NOT NULL,
    `client_nic_number`         text                      NOT NULL,
    `client_email`              text                      NOT NULL,
    `client_phone`              text                      NOT NULL,
    `client_account_status`     text DEFAULT 'UNVERIFIED' NOT NULL,
    `client_registration_date`  integer                   NOT NULL,
    PRIMARY KEY (`client_id`, `client_organization_id`),
    FOREIGN KEY (`client_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `clients_payments`
(
    `client_payment_id`              text                   NOT NULL,
    `client_payment_client_id`       text                   NOT NULL,
    `client_payment_organization_id` text                   NOT NULL,
    `client_payment_amount`          real                   NOT NULL,
    `client_payment_date`            integer                NOT NULL,
    `client_payment_status`          text DEFAULT 'PENDING' NOT NULL,
    PRIMARY KEY (`client_payment_id`, `client_payment_client_id`),
    FOREIGN KEY (`client_payment_client_id`) REFERENCES `clients` (`client_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`client_payment_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `employees`
(
    `employee_id`                text                        NOT NULL,
    `employee_organization_id`   text                        NOT NULL,
    `employee_sales_group_id`    text,
    `employee_first_name`        text,
    `employee_last_name`         text,
    `employee_phone`             text,
    `employee_nic_number`        text                        NOT NULL,
    `employee_active_territory`  text,
    `employee_registration_date` integer                     NOT NULL,
    `employee_status`            text DEFAULT 'NOT_REPORTED' NOT NULL,
    PRIMARY KEY (`employee_id`, `employee_organization_id`),
    FOREIGN KEY (`employee_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_sales_group_id`) REFERENCES `sales_groups` (`sales_group_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_employee_nic_number_unique` ON `employees` (`employee_nic_number`);--> statement-breakpoint
CREATE INDEX `employee_id_idx` ON `employees` (`employee_id`);--> statement-breakpoint
CREATE INDEX `employee_nic_idx` ON `employees` (`employee_nic_number`);--> statement-breakpoint
CREATE TABLE `employees_credentials`
(
    `employee_credential_id`              text NOT NULL,
    `employee_credential_employee_id`     text NOT NULL,
    `employee_credential_organization_id` text NOT NULL,
    `employee_credential_username`        text NOT NULL,
    `employee_credential_password`        text NOT NULL,
    PRIMARY KEY (`employee_credential_id`, `employee_credential_employee_id`),
    FOREIGN KEY (`employee_credential_employee_id`) REFERENCES `employees` (`employee_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_credential_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_credentials_employee_credential_username_unique` ON `employees_credentials` (`employee_credential_username`);--> statement-breakpoint
CREATE TABLE `employees_leaves`
(
    `employee_leave_id`              text              NOT NULL,
    `employee_leave_employee_id`     text              NOT NULL,
    `employee_leave_organization_id` text              NOT NULL,
    `employee_leave_taken`           integer DEFAULT 0 NOT NULL,
    `employee_leave_total`           integer DEFAULT 3 NOT NULL,
    PRIMARY KEY (`employee_leave_id`, `employee_leave_employee_id`),
    FOREIGN KEY (`employee_leave_employee_id`) REFERENCES `employees` (`employee_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_leave_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `employees_salaries`
(
    `employee_salary_id`                    text              NOT NULL,
    `employee_salary_organization_id`       text              NOT NULL,
    `employee_salary_employee_id`           text              NOT NULL,
    `employee_salary_base`                  real              NOT NULL,
    `employee_salary_commission_percentage` integer DEFAULT 0 NOT NULL,
    PRIMARY KEY (`employee_salary_id`, `employee_salary_employee_id`),
    FOREIGN KEY (`employee_salary_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_salary_employee_id`) REFERENCES `employees` (`employee_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `items`
(
    `item_id`               text NOT NULL,
    `item_organization_id`  text NOT NULL,
    `item_name`             text NOT NULL,
    `item_stock_unit_count` integer DEFAULT 0,
    PRIMARY KEY (`item_id`, `item_organization_id`),
    FOREIGN KEY (`item_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organizations`
(
    `organization_id`                    text                  NOT NULL,
    `organization_admin_id`              text                  NOT NULL,
    `organization_stripe_customer_id`    text                  NOT NULL,
    `organization_name`                  text                  NOT NULL,
    `organization_admin_email`           text                  NOT NULL,
    `organization_admin_phone`           text                  NOT NULL,
    `organization_logo_url`              text                  NOT NULL,
    `organization_registration_date`     integer               NOT NULL,
    `organization_subscription_end_date` integer               NOT NULL,
    `organization_status`                text DEFAULT 'ACTIVE' NOT NULL,
    `organization_subscription_status`   text DEFAULT 'VALID'  NOT NULL,
    PRIMARY KEY (`organization_id`, `organization_stripe_customer_id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_admin_id_unique` ON `organizations` (`organization_admin_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_stripe_customer_id_unique` ON `organizations` (`organization_stripe_customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_name_unique` ON `organizations` (`organization_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_admin_email_unique` ON `organizations` (`organization_admin_email`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_admin_phone_unique` ON `organizations` (`organization_admin_phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_logo_url_unique` ON `organizations` (`organization_logo_url`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `organizations` (`organization_id`);--> statement-breakpoint
CREATE TABLE `organizations_payments`
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
CREATE TABLE `sales`
(
    `sale_id`                text              NOT NULL,
    `sale_organization_id`   text              NOT NULL,
    `sale_employee_id`       text              NOT NULL,
    `sale_client_id`         text              NOT NULL,
    `sale_client_payment_id` text              NOT NULL,
    `sale_item_id`           text              NOT NULL,
    `sale_item_unit_count`   integer DEFAULT 1 NOT NULL,
    `sale_date`              integer           NOT NULL,
    PRIMARY KEY (`sale_id`, `sale_organization_id`),
    FOREIGN KEY (`sale_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_employee_id`) REFERENCES `employees` (`employee_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_client_id`) REFERENCES `clients` (`client_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_client_payment_id`) REFERENCES `clients_payments` (`client_payment_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_item_id`) REFERENCES `items` (`item_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sales_groups`
(
    `sales_group_id`              text NOT NULL,
    `sales_group_organization_id` text NOT NULL,
    `sales_group_name`            text NOT NULL,
    `sales_group_territory`       text NOT NULL,
    PRIMARY KEY (`sales_group_id`, `sales_group_organization_id`),
    FOREIGN KEY (`sales_group_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sales_groups_sales_group_name_unique` ON `sales_groups` (`sales_group_name`);