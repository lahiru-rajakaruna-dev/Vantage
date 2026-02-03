import { relations } from 'drizzle-orm';
import {
    index,
    integer,
    primaryKey,
    real,
    sqliteTable,
    text,
}                    from 'drizzle-orm/sqlite-core';

// --- ENUMS (Arrays for SQLite) ---
export const PaymentStatus      = [
    'PENDING',
    'PAID',
    'VERIFIED',
    'REFUNDED'
] as const;
export const SubscriptionStatus = [
    'VALID',
    'EXPIRED'
] as const;
export const OrganizationStatus = [
    'ACTIVE',
    'DEACTIVATED',
    'SUSPENDED',
    'TRIAL'
] as const;
export const AccountStatus      = [
    'ACTIVE',
    'DEACTIVATED',
    'UNVERIFIED'
] as const;
export const EmployeeStatus     = [
    'ON_FIELD',
    'ON_LEAVE',
    'SUSPENDED',
    'FIRED',
    'NOT_REPORTED'
] as const;

// --- TABLES ---

export const organizations = sqliteTable(
    'organizations',
    {
        organization_id                   : text()
            .notNull(),
        organization_admin_id             : text()
            .unique()
            .notNull(),
        organization_stripe_customer_id   : text()
            .unique()
            .notNull(),
        organization_name                 : text()
            .unique()
            .notNull(),
        organization_admin_email          : text()
            .unique()
            .notNull(),
        organization_admin_phone          : text()
            .unique()
            .notNull(),
        organization_logo_url             : text()
            .unique()
            .notNull(),
        organization_registration_date    : integer()
            .notNull(),
        organization_subscription_end_date: integer()
            .notNull(),
        organization_status               : text({ enum: OrganizationStatus })
            .default('ACTIVE')
            .notNull(),
        organization_subscription_status  : text({ enum: SubscriptionStatus })
            .default('VALID')
            .notNull(),
    },
    (table) => ({
        pk                 : primaryKey({
                                            name   : 'organization_primary_key',
                                            columns: [
                                                table.organization_id,
                                                table.organization_stripe_customer_id
                                            ],
                                        }),
        organizationIdIndex: index('organization_id_idx')
            .on(table.organization_id),
    }),
);

export const employees = sqliteTable(
    'employees',
    {
        employee_id               : text()
            .notNull(),
        employee_organization_id  : text()
            .notNull()
            .references(() => organizations.organization_id),
        employee_sales_group_id   : text()
            .references(() => salesGroups.sales_group_id),
        employee_first_name       : text(),
        employee_last_name        : text(),
        employee_phone            : text(),
        employee_nic_number       : text()
            .notNull()
            .unique(),
        employee_active_territory : text(),
        employee_registration_date: integer()
            .notNull(),
        employee_status           : text({ enum: EmployeeStatus })
            .default('NOT_REPORTED')
            .notNull(),
    },
    (table) => ({
        pk             : primaryKey({
                                        name   : 'employee_primary_key',
                                        columns: [
                                            table.employee_id,
                                            table.employee_organization_id
                                        ],
                                    }),
        employeeIdIndex: index('employee_id_idx')
            .on(table.employee_id),
        nicIndex       : index('employee_nic_idx')
            .on(table.employee_nic_number),
    }),
);

export const employeesLeaves = sqliteTable(
    'employees_leaves',
    {
        employee_leave_id             : text()
            .notNull(),
        employee_leave_employee_id    : text()
            .notNull()
            .references(() => employees.employee_id),
        employee_leave_organization_id: text()
            .notNull()
            .references(() => organizations.organization_id),
        employee_leave_taken          : integer()
            .notNull()
            .default(0),
        employee_leave_total          : integer()
            .notNull()
            .default(3),
    },
    (table) => ({
        pk: primaryKey({
                           name   : 'employees_leaves_pk',
                           columns: [
                               table.employee_leave_id,
                               table.employee_leave_employee_id
                           ],
                       }),
    }),
);

export const employeesCredentials = sqliteTable(
    'employees_credentials',
    {
        employee_credential_id             : text()
            .notNull(),
        employee_credential_employee_id    : text()
            .notNull()
            .references(() => employees.employee_id),
        employee_credential_organization_id: text()
            .notNull()
            .references(() => organizations.organization_id),
        employee_credential_username       : text()
            .unique()
            .notNull(),
        employee_credential_password       : text()
            .notNull(),
    },
    (table) => ({
        pk: primaryKey({
                           name   : 'employees_credentials_pk',
                           columns: [
                               table.employee_credential_id,
                               table.employee_credential_employee_id
                           ],
                       }),
    }),
);

export const employeesSalaries = sqliteTable(
    'employees_salaries',
    {
        employee_salary_id                   : text()
            .notNull(),
        employee_salary_organization_id      : text()
            .notNull()
            .references(() => organizations.organization_id),
        employee_salary_employee_id          : text()
            .notNull()
            .references(() => employees.employee_id),
        employee_salary_base                 : real()
            .notNull(),
        employee_salary_commission_percentage: integer()
            .notNull()
            .default(0),
    },
    (table) => ({
        pk: primaryKey({
                           name   : 'employees_salaries_pk',
                           columns: [
                               table.employee_salary_id,
                               table.employee_salary_employee_id
                           ],
                       }),
    }),
);

export const salesGroups = sqliteTable(
    'sales_groups',
    {
        sales_group_id             : text()
            .notNull(),
        sales_group_organization_id: text()
            .notNull()
            .references(() => organizations.organization_id),
        sales_group_name           : text()
            .unique()
            .notNull(),
        sales_group_territory      : text()
            .notNull(),
    },
    (table) => ({
        pk: primaryKey({
                           name   : 'sales_groups_pk',
                           columns: [
                               table.sales_group_id,
                               table.sales_group_organization_id
                           ],
                       }),
    }),
);

export const items = sqliteTable(
    'items',
    {
        item_id              : text()
            .notNull(),
        item_organization_id : text()
            .notNull()
            .references(() => organizations.organization_id),
        item_name            : text()
            .notNull(),
        item_stock_unit_count: integer()
            .default(0),
    },
    (table) => ({
        pk: primaryKey({
                           name   : 'items_pk',
                           columns: [
                               table.item_id,
                               table.item_organization_id
                           ],
                       }),
    }),
);

export const sales = sqliteTable(
    'sales',
    {
        sale_id               : text()
            .notNull(),
        sale_organization_id  : text()
            .notNull()
            .references(() => organizations.organization_id),
        sale_employee_id      : text()
            .notNull()
            .references(() => employees.employee_id),
        sale_client_id        : text()
            .notNull()
            .references(() => clients.client_id),
        sale_client_payment_id: text()
            .notNull()
            .references(() => clientsPayments.client_payment_id),
        sale_item_id          : text()
            .notNull()
            .references(() => items.item_id),
        sale_item_unit_count  : integer()
            .notNull()
            .default(1),
        sale_value            : real()
            .notNull(),
        sale_date             : integer()
            .notNull(),
    },
    (table) => ({
        pk: primaryKey({
                           name   : 'sales_pk',
                           columns: [
                               table.sale_id,
                               table.sale_organization_id
                           ],
                       }),
    }),
);

export const organizationsPayments = sqliteTable(
    'organizations_payments',
    {
        organization_payment_id             : text()
            .notNull(),
        organization_payment_organization_id: text()
            .notNull()
            .references(() => organizations.organization_id),
        organization_payment_amount         : real()
            .notNull(),
        organization_payment_status         : text({ enum: PaymentStatus })
            .default('VERIFIED')
            .notNull(),
        organization_payment_timestamp      : integer()
            .notNull(),
    },
    (table) => ({
        pk: primaryKey({
                           name   : 'organizations_payments_pk',
                           columns: [
                               table.organization_payment_id,
                               table.organization_payment_organization_id
                           ],
                       }),
    }),
);

export const clients = sqliteTable(
    'clients',
    {
        client_id                : text()
            .notNull(),
        client_organization_id   : text()
            .notNull()
            .references(() => organizations.organization_id),
        client_stripe_customer_id: text()
            .notNull(),
        client_name              : text()
            .notNull(),
        client_nic_number        : text()
            .notNull(),
        client_email             : text()
            .notNull(),
        client_phone             : text()
            .notNull(),
        client_account_status    : text({ enum: AccountStatus })
            .notNull()
            .default('UNVERIFIED'),
        client_registration_date : integer()
            .notNull(),
    },
    (table) => ({
        pk: primaryKey({
                           name   : 'clients_pk',
                           columns: [
                               table.client_id,
                               table.client_organization_id
                           ],
                       }),
    }),
);

export const clientsPayments = sqliteTable(
    'clients_payments',
    {
        client_payment_id             : text()
            .notNull(),
        client_payment_client_id      : text()
            .notNull()
            .references(() => clients.client_id),
        client_payment_organization_id: text()
            .notNull()
            .references(() => organizations.organization_id),
        client_payment_amount         : real()
            .notNull(),
        client_payment_date           : integer()
            .notNull(),
        client_payment_status         : text({ enum: PaymentStatus })
            .notNull()
            .default('PENDING'),
    },
    (table) => ({
        pk: primaryKey({
                           name   : 'clients_payments_pk',
                           columns: [
                               table.client_payment_id,
                               table.client_payment_client_id
                           ],
                       }),
    }),
);

// --- RELATIONS (Fully Mapping the Postgres Logic) ---

export const organizationsRelations = relations(
    organizations,
    ({ many }) => ({
        employees           : many(employees),
        employeesCredentials: many(employeesCredentials),
        employeesLeaves     : many(employeesLeaves),
        employeesSalaries   : many(employeesSalaries),
        items               : many(items),
        salesGroups         : many(salesGroups),
        payments            : many(organizationsPayments),
        sales               : many(sales),
        clients             : many(clients),
        clientsPayments     : many(clientsPayments),
    })
);

export const employeesRelations = relations(
    employees,
    ({
         one,
         many
     }) => ({
        organization: one(
            organizations,
            {
                fields    : [ employees.employee_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
        credentials : one(
            employeesCredentials,
            {
                fields    : [ employees.employee_id ],
                references: [ employeesCredentials.employee_credential_employee_id ],
            }
        ),
        leaves      : one(
            employeesLeaves,
            {
                fields    : [ employees.employee_id ],
                references: [ employeesLeaves.employee_leave_employee_id ],
            }
        ),
        salary      : one(
            employeesSalaries,
            {
                fields    : [ employees.employee_id ],
                references: [ employeesSalaries.employee_salary_employee_id ],
            }
        ),
        salesGroup  : one(
            salesGroups,
            {
                fields    : [ employees.employee_sales_group_id ],
                references: [ salesGroups.sales_group_id ],
            }
        ),
        sales       : many(sales),
    })
);

// ADDED: Missing relations definitions
export const employeesCredentialsRelations = relations(
    employeesCredentials,
    ({ one }) => ({
        employee    : one(
            employees,
            {
                fields    : [ employeesCredentials.employee_credential_employee_id ],
                references: [ employees.employee_id ],
            }
        ),
        organization: one(
            organizations,
            {
                fields    : [ employeesCredentials.employee_credential_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
    })
);

// ADDED: Missing relations definitions
export const employeesLeavesRelations = relations(
    employeesLeaves,
    ({ one }) => ({
        employee    : one(
            employees,
            {
                fields    : [ employeesLeaves.employee_leave_employee_id ],
                references: [ employees.employee_id ],
            }
        ),
        organization: one(
            organizations,
            {
                fields    : [ employeesLeaves.employee_leave_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
    })
);

// ADDED: Missing relations definitions
export const employeesSalariesRelations = relations(
    employeesSalaries,
    ({ one }) => ({
        employee    : one(
            employees,
            {
                fields    : [ employeesSalaries.employee_salary_employee_id ],
                references: [ employees.employee_id ],
            }
        ),
        organization: one(
            organizations,
            {
                fields    : [ employeesSalaries.employee_salary_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
    })
);

// ADDED: Missing relations definitions
export const itemsRelations = relations(
    items,
    ({
         one,
         many
     }) => ({
        organization: one(
            organizations,
            {
                fields    : [ items.item_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
        sales       : many(sales),
    })
);

// ADDED: Missing relations definitions
export const salesGroupsRelations = relations(
    salesGroups,
    ({
         one,
         many
     }) => ({
        organization: one(
            organizations,
            {
                fields    : [ salesGroups.sales_group_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
        employees   : many(employees),
    })
);

// ADDED: Missing relations definitions
export const salesRelations = relations(
    sales,
    ({ one }) => ({
        item        : one(
            items,
            {
                fields    : [ sales.sale_item_id ],
                references: [ items.item_id ]
            }
        ),
        employee    : one(
            employees,
            {
                fields    : [ sales.sale_employee_id ],
                references: [ employees.employee_id ]
            }
        ),
        organization: one(
            organizations,
            {
                fields    : [ sales.sale_organization_id ],
                references: [ organizations.organization_id ]
            }
        ),
        client      : one(
            clients,
            {
                fields    : [ sales.sale_client_id ],
                references: [ clients.client_id ]
            }
        ),
        payment     : one(
            clientsPayments,
            {
                fields    : [ sales.sale_client_payment_id ],
                references: [ clientsPayments.client_payment_id ]
            }
        ),
    })
);

// ADDED: Missing relations definitions
export const organizationsPaymentsRelations = relations(
    organizationsPayments,
    ({ one }) => ({
        organization: one(
            organizations,
            {
                fields    : [ organizationsPayments.organization_payment_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
    })
);

// ADDED: Missing relations definitions
export const clientsRelations = relations(
    clients,
    ({
         one,
         many
     }) => ({
        organization: one(
            organizations,
            {
                fields    : [ clients.client_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
        payments    : many(clientsPayments),
        sales       : many(sales),
    })
);

// ADDED: Missing relations definitions
export const clientsPaymentsRelations = relations(
    clientsPayments,
    ({ one }) => ({
        client      : one(
            clients,
            {
                fields    : [ clientsPayments.client_payment_client_id ],
                references: [ clients.client_id ],
            }
        ),
        organization: one(
            organizations,
            {
                fields    : [ clientsPayments.client_payment_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
    })
);

// --- TYPES ---

export type TSQLiteOrganization = typeof organizations.$inferSelect;
export type TSQLiteEmployee = typeof employees.$inferSelect;
export type TSQLiteItem = typeof items.$inferSelect;
export type TSQLiteSale = typeof sales.$inferSelect;
export type TSQLiteClient = typeof clients.$inferSelect;
export type TSQLiteClientPayment = typeof clientsPayments.$inferSelect;
export type TSQLiteOrganizationPayment = typeof organizationsPayments.$inferSelect;
export type TSQLiteEmployeeCredential = typeof employeesCredentials.$inferSelect;
export type TSQLiteEmployeeLeave = typeof employeesLeaves.$inferSelect;
export type TSQLiteEmployeeSalary = typeof employeesSalaries.$inferSelect;
export type TSQLiteSalesGroup = typeof salesGroups.$inferSelect;
