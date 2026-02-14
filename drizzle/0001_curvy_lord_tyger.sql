PRAGMA
foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_employees_salary_records`
(
    `employee_salary_record_id`              text PRIMARY KEY NOT NULL,
    `employee_salary_record_organization_id` text             NOT NULL,
    `employee_salary_record_employee_id`     text             NOT NULL,
    `employee_salary_record_amount`          real             NOT NULL,
    `employee_salary_record_timestamp`       integer          NOT NULL,
    FOREIGN KEY (`employee_salary_record_organization_id`) REFERENCES `organizations` (`organization_id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`employee_salary_record_employee_id`,
                 `employee_salary_record_organization_id`) REFERENCES `employees` (`employee_id`, `employee_organization_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_employees_salary_records`("employee_salary_record_id", "employee_salary_record_organization_id",
                                             "employee_salary_record_employee_id", "employee_salary_record_amount",
                                             "employee_salary_record_timestamp")
SELECT "employee_salary_record_id",
       "employee_salary_record_organization_id",
       "employee_salary_record_employee_id",
       "employee_salary_record_amount",
       "employee_salary_record_timestamp"
FROM `employees_salary_records`;--> statement-breakpoint
DROP TABLE `employees_salary_records`;--> statement-breakpoint
ALTER TABLE `__new_employees_salary_records` RENAME TO `employees_salary_records`;--> statement-breakpoint
PRAGMA
foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `employees_salary_records_employee_salary_record_id_unique` ON `employees_salary_records` (`employee_salary_record_id`);--> statement-breakpoint
CREATE INDEX `employee_salary_record_organization_id_IDX` ON `employees_salary_records` (`employee_salary_record_organization_id`);--> statement-breakpoint
CREATE INDEX `employee_salary_record_employee_id_IDX` ON `employees_salary_records` (`employee_salary_record_employee_id`);