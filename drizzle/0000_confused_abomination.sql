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
    PRIMARY KEY (`client_id`, `client_organization_id`, `client_stripe_customer_id`),
    FOREIGN KEY (`client_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_client_id_unique` ON `clients` (`client_id`);--> statement-breakpoint
CREATE INDEX `client_organization_id_fk_idx` ON `clients` (`client_organization_id`);--> statement-breakpoint
CREATE INDEX `client_stripe_customer_id_idx` ON `clients` (`client_stripe_customer_id`);--> statement-breakpoint
CREATE TABLE `client_payments`
(
    `client_payment_id`              text                    NOT NULL,
    `client_payment_client_id`       text                    NOT NULL,
    `client_payment_organization_id` text                    NOT NULL,
    `client_payment_amount`          real                    NOT NULL,
    `client_payment_date`            integer                 NOT NULL,
    `client_payment_status`          text DEFAULT 'VERIFIED' NOT NULL,
    PRIMARY KEY (`client_payment_id`, `client_payment_client_id`, `client_payment_organization_id`),
    FOREIGN KEY (`client_payment_client_id`) REFERENCES `clients` (`client_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`client_payment_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `client_payments_client_payment_id_unique` ON `client_payments` (`client_payment_id`);--> statement-breakpoint
CREATE INDEX `client_payment_id_idx` ON `client_payments` (`client_payment_id`);--> statement-breakpoint
CREATE INDEX `client_payment_client_id_fk_idx` ON `client_payments` (`client_payment_client_id`);--> statement-breakpoint
CREATE INDEX `client_payment_organization_id_fk_idx` ON `client_payments` (`client_payment_organization_id`);--> statement-breakpoint
CREATE TABLE `employees`
(
    `employee_id`                text    NOT NULL,
    `employee_organization_id`   text    NOT NULL,
    `employee_sales_group_id`    text,
    `employee_username`          text    NOT NULL,
    `employee_phone`             text    NOT NULL,
    `employee_nic_number`        text    NOT NULL,
    `employee_registration_date` integer NOT NULL,
    PRIMARY KEY (`employee_id`, `employee_organization_id`),
    FOREIGN KEY (`employee_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_sales_group_id`) REFERENCES `sales_groups` (`sales_group_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_employee_id_unique` ON `employees` (`employee_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `employees_employee_nic_number_unique` ON `employees` (`employee_nic_number`);--> statement-breakpoint
CREATE INDEX `employee_id_idx` ON `employees` (`employee_id`);--> statement-breakpoint
CREATE INDEX `employee_organization_id_fk_idx` ON `employees` (`employee_organization_id`);--> statement-breakpoint
CREATE INDEX `employee_sales_group_id_fk_idx` ON `employees` (`employee_sales_group_id`);--> statement-breakpoint
CREATE INDEX `employee_nic_number_unique_idx` ON `employees` (`employee_nic_number`);--> statement-breakpoint
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
CREATE UNIQUE INDEX `items_item_id_unique` ON `items` (`item_id`);--> statement-breakpoint
CREATE INDEX `item_id_idx` ON `items` (`item_id`);--> statement-breakpoint
CREATE INDEX `item_organization_id_fk_idx` ON `items` (`item_organization_id`);--> statement-breakpoint
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
CREATE UNIQUE INDEX `organizations_organization_id_unique` ON `organizations` (`organization_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_admin_id_unique` ON `organizations` (`organization_admin_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_stripe_customer_id_unique` ON `organizations` (`organization_stripe_customer_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_name_unique` ON `organizations` (`organization_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_admin_email_unique` ON `organizations` (`organization_admin_email`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_admin_phone_unique` ON `organizations` (`organization_admin_phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_organization_logo_url_unique` ON `organizations` (`organization_logo_url`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `organizations` (`organization_id`);--> statement-breakpoint
CREATE INDEX `organization_stripe_customer_id_idx` ON `organizations` (`organization_stripe_customer_id`);--> statement-breakpoint
CREATE TABLE `organizations_payments`
(
    `payment_id`              text    NOT NULL,
    `payment_organization_id` text    NOT NULL,
    `payment_amount`          real    NOT NULL,
    `payment_status`          text DEFAULT 'VERIFIED',
    `payment_date`            integer NOT NULL,
    PRIMARY KEY (`payment_id`, `payment_organization_id`),
    FOREIGN KEY (`payment_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_payments_payment_id_unique` ON `organizations_payments` (`payment_id`);--> statement-breakpoint
CREATE INDEX `organization_payment_id_idx` ON `organizations_payments` (`payment_id`);--> statement-breakpoint
CREATE INDEX `organization_payment_organization_id_fk_idx` ON `organizations_payments` (`payment_organization_id`);--> statement-breakpoint
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
    PRIMARY KEY (`sale_id`, `sale_organization_id`, `sale_employee_id`, `sale_client_id`, `sale_client_payment_id`,
                 `sale_item_id`),
    FOREIGN KEY (`sale_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_employee_id`) REFERENCES `employees` (`employee_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_client_id`) REFERENCES `clients` (`client_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_client_payment_id`) REFERENCES `client_payments` (`client_payment_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`sale_item_id`) REFERENCES `items` (`item_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sales_sale_id_unique` ON `sales` (`sale_id`);--> statement-breakpoint
CREATE INDEX `sale_id_idx` ON `sales` (`sale_id`);--> statement-breakpoint
CREATE INDEX `sale_organization_id_fk_idx` ON `sales` (`sale_organization_id`);--> statement-breakpoint
CREATE INDEX `sale_employee_id_fk_idx` ON `sales` (`sale_employee_id`);--> statement-breakpoint
CREATE INDEX `sale_client_id_fk_idx` ON `sales` (`sale_client_id`);--> statement-breakpoint
CREATE INDEX `sale_client_payment_id_fk_idx` ON `sales` (`sale_client_payment_id`);--> statement-breakpoint
CREATE INDEX `sale_item_id_fk_idx` ON `sales` (`sale_item_id`);--> statement-breakpoint
CREATE TABLE `sales_groups`
(
    `sales_group_id`              text NOT NULL,
    `sales_group_organization_id` text NOT NULL,
    `sales_group_name`            text NOT NULL,
    PRIMARY KEY (`sales_group_id`, `sales_group_organization_id`),
    FOREIGN KEY (`sales_group_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sales_groups_sales_group_id_unique` ON `sales_groups` (`sales_group_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sales_groups_sales_group_name_unique` ON `sales_groups` (`sales_group_name`);--> statement-breakpoint
CREATE INDEX `sales_group_organization_id_fk_idx` ON `sales_groups` (`sales_group_organization_id`);--> statement-breakpoint
CREATE INDEX `sales_group_name_unique_idx` ON `sales_groups` (`sales_group_name`);