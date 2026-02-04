import { relations } from 'drizzle-orm';
import {
    decimal,
    index,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
}                    from 'drizzle-orm/pg-core';
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema
}                    from 'drizzle-zod';
import { z }         from 'zod';
import {
    EAccountStatus,
    EOrganizationStatus,
    EPaymentStatus,
    ESubscriptionStatus,
}                    from '../../../types';



export const EPGPaymentStatus = pgEnum(
    'EPaymentStatus',
    EPaymentStatus
);

export const EPGSubscriptionStatus = pgEnum(
    'ESubscriptionStatus',
    ESubscriptionStatus,
);
export const EPGOrganizationStatus = pgEnum(
    'EOrganizationStatus',
    EOrganizationStatus,
);
export const EPGAccountStatus      = pgEnum(
    'EAccountStatus',
    EAccountStatus
);

export const organizations = pgTable(
    'organizations',
    {
        organization_id                   : text()
            .unique()
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
        organization_status               : text(
            'organization_status',
            {
                enum: [
                    'ACTIVE',
                    'DEACTIVATED',
                    'SUSPENDED',
                    'TRIAL'
                ],
            }
        )
            .default(EOrganizationStatus.ACTIVE)
            .notNull(),
        organization_subscription_status  : text(
            'organization_subscription_status',
            {
                enum: [
                    'VALID',
                    'EXPIRED'
                ],
            }
        )
            .default(ESubscriptionStatus.VALID)
            .notNull(),
    },
    (table) => {
        return {
            pk                 : primaryKey({
                                                name   : 'organization_primary_key',
                                                columns: [
                                                    table.organization_id,
                                                    table.organization_stripe_customer_id
                                                ],
                                            }),
            organizationIdIndex: index('organization_id_idx')
                .on(
                    table.organization_id,
                ),
            stripeIdIndex      : index('organization_stripe_customer_id_idx')
                .on(
                    table.organization_stripe_customer_id,
                ),
        };
    },
);

export const SchemaInsertOrganization = createInsertSchema(organizations)
export type TOrganizationInsert = z.infer<typeof SchemaInsertOrganization>;
export const SchemaUpdateOrganization = createUpdateSchema(organizations);
export type TOrganizationUpdate = z.infer<typeof SchemaUpdateOrganization>
export const SchemaSelectOrganization = createSelectSchema(organizations)
export type TOrganizationSelect = z.infer<typeof SchemaSelectOrganization>

export const employees = pgTable(
    'employees',
    {
        employee_id                 : text()
            .unique()
            .notNull(),
        employee_organization_id    : text()
            .notNull()
            .references(() => organizations.organization_id),
        employee_sales_group_id     : text()
            .references(
                () => salesGroups.sales_group_id,
            ),
        employee_profile_picture_url: text()
            .notNull(),
        employee_first_name         : text(),
        employee_last_name          : text(),
        employee_phone              : text(),
        employee_nic_number         : text()
            .notNull()
            .unique(),
        employee_active_territory   : text(),
        employee_registration_date  : integer()
            .notNull(),
        employee_status             : text({
                                               enum: [
                                                   'ON_FIELD',
                                                   'ON_LEAVE',
                                                   'SUSPENDED',
                                                   'FIRED',
                                                   'NOT_REPORTED'
                                               ]
                                           })
            .default('NOT_REPORTED')
            .notNull()
    },
    (table) => {
        return {
            pk                 : primaryKey({
                                                name   : 'employee_primary_key',
                                                columns: [
                                                    table.employee_id,
                                                    table.employee_organization_id
                                                ],
                                            }),
            employeeIdIndex    : index('employee_id_idx')
                .on(table.employee_id),
            organizationIdIndex: index('employee_organization_id_fk_idx')
                .on(
                    table.employee_organization_id,
                ),
            salesGroupIdIndex  : index('employee_sales_group_id_fk_idx')
                .on(
                    table.employee_sales_group_id,
                ),
            nicIndex           : index('employee_nic_number_unique_idx')
                .on(
                    table.employee_nic_number,
                ),
        };
    },
);

export const SchemaInsertEmployee = createInsertSchema(employees)
export type TEmployeeInsert = z.infer<typeof SchemaInsertEmployee>
export const SchemaUpdateEmployee = createUpdateSchema(employees);
export type TEmployeeUpdateSchema = z.infer<typeof SchemaUpdateEmployee>
export const SchemaSelectEmployee = createSelectSchema(employees)
export type TEmployeeSelect = z.infer<typeof SchemaSelectEmployee>

export const employeesLeaves = pgTable(
    'employees_leaves',
    {
        employee_leave_id             : text()
            .unique()
            .notNull(),
        employee_leave_employee_id    : text()
            .unique()
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
            .default(3)
    },
    (table) => {
        return {
            pk                 : primaryKey({
                                                name   : 'employees_leaves_pk',
                                                columns: [
                                                    table.employee_leave_id,
                                                    table.employee_leave_organization_id,
                                                    table.employee_leave_employee_id
                                                ]
                                            }),
            employeeIdIndex    : index('employee_leave_employee_id_idx')
                .on(table.employee_leave_employee_id),
            organizationIdIndex: index('employee_leave_organization_id_idx')
                .on(table.employee_leave_organization_id),
        }
    }
)

export const SchemaInsertEmployeeLeaves = createInsertSchema(employeesLeaves)
export type TEmployeeLeavesInsert = z.infer<typeof SchemaInsertEmployeeLeaves>
export const SchemaUpdateEmployeeLeaves = createUpdateSchema(employeesLeaves);
export type TEmployeeLeavesUpdateSchema = z.infer<typeof SchemaUpdateEmployeeLeaves>
export const SchemaSelectEmployeeLeaves = createSelectSchema(employeesLeaves)
export type TEmployeeLeavesSelect = z.infer<typeof SchemaSelectEmployeeLeaves>

export const employeesCredentials = pgTable(
    'employees_credentials',
    {
        employee_credential_id             : text()
            .unique()
            .notNull(),
        employee_credential_employee_id    : text()
            .unique()
            .notNull()
            .references(() => employees.employee_id),
        employee_credential_organization_id: text()
            .notNull()
            .references(() => organizations.organization_id),
        employee_credential_username       : text()
            .unique()
            .notNull(),
        employee_credential_password       : text()
            .notNull()
    },
    (table) => {
        return {
            pk                   : primaryKey({
                                                  name   : 'employees_credentials_pk',
                                                  columns: [
                                                      table.employee_credential_id,
                                                      table.employee_credential_employee_id,
                                                      table.employee_credential_organization_id
                                                  ]
                                              }),
            organizationIdIndex  : index('employee_credential_organization_id_idx')
                .on(table.employee_credential_organization_id),
            employeeIdIndex      : index('employee_credential_employee_id_idx')
                .on(table.employee_credential_employee_id),
            employeeUsernameIndex: index('employee_credential_username_idx')
                .on(table.employee_credential_username)
        }
    }
)

export const SchemaInsertEmployeeCredentials = createInsertSchema(employeesCredentials)
export type TEmployeeCredentialsInsert = z.infer<typeof SchemaInsertEmployeeCredentials>
export const SchemaUpdateEmployeeCredentials = createUpdateSchema(employeesCredentials);
export type TEmployeeCredentialsUpdate = z.infer<typeof SchemaUpdateEmployeeCredentials>
export const SchemaSelectEmployeeCredentials = createSelectSchema(employeesCredentials)
export type TEmployeeCredentialsSelect = z.infer<typeof SchemaSelectEmployeeCredentials>

export const employeesSalaries = pgTable(
    'employees_salaries',
    {
        employee_salary_id                   : text()
            .unique()
            .notNull(),
        employee_salary_organization_id      : text()
            .notNull()
            .references(() => organizations.organization_id),
        employee_salary_employee_id          : text()
            .notNull()
            .references(() => employees.employee_id),
        employee_salary_base                 : decimal(
            'employee_salary_base',
            { mode: 'number' }
        )
            .notNull(),
        employee_salary_commission_percentage: integer()
            .notNull()
            .default(0)
    },
    // FIX: added entire constraints block — primaryKey and indexes were
    // missing entirely
    (table) => {
        return {
            pk                 : primaryKey({
                                                name   : 'employees_salaries_pk',
                                                columns: [
                                                    table.employee_salary_id,
                                                    table.employee_salary_organization_id,
                                                    table.employee_salary_employee_id
                                                ]
                                            }),
            salaryIdIndex      : index('employee_salary_id_idx')
                .on(table.employee_salary_id),
            organizationIdIndex: index('employee_salary_organization_id_fk_idx')
                .on(table.employee_salary_organization_id),
            employeeIdIndex    : index('employee_salary_employee_id_fk_idx')
                .on(table.employee_salary_employee_id),
        }
    }
)

export const SchemaInsertEmployeeSalary = createInsertSchema(employeesSalaries)
export type TEmployeeSalaryInsert = z.infer<typeof SchemaInsertEmployeeSalary>
export const SchemaUpdateEmployeeSalary = createUpdateSchema(employeesSalaries);
export type TEmployeeSalaryUpdate = z.infer<typeof SchemaUpdateEmployeeSalary>
export const SchemaSelectEmployeeSalary = createSelectSchema(employeesSalaries)
export type TEmployeeSalarySelect = z.infer<typeof SchemaSelectEmployeeSalary>

export const salesGroups = pgTable(
    'sales_groups',
    {
        sales_group_id             : text()
            .unique()
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
    (table) => {
        return {
            pk                 : primaryKey({
                                                name   : 'sales_group_primary_key',
                                                columns: [
                                                    table.sales_group_id,
                                                    table.sales_group_organization_id
                                                ],
                                            }),
            organizationIdIndex: index('sales_group_organization_id_fk_idx')
                .on(
                    table.sales_group_organization_id,
                ),
            nameIndex          : index('sales_group_name_unique_idx')
                .on(
                    table.sales_group_name,
                ),
        };
    },
);

export const SchemaInsertSalesGroup = createInsertSchema(salesGroups);
export type TSalesGroupInsert = z.infer<typeof SchemaInsertSalesGroup>
export const SchemaUpdateSalesGroup = createUpdateSchema(salesGroups);
export type TSalesGroupUpdate = z.infer<typeof SchemaUpdateSalesGroup>
export const SchemaSelectSalesGroup = createSelectSchema(salesGroups)
export type TSalesGroupSelect = z.infer<typeof SchemaSelectSalesGroup>

export const items = pgTable(
    'items',
    {
        item_id              : text()
            .unique()
            .notNull(),
        item_organization_id : text()
            .notNull()
            .references(() => organizations.organization_id),
        item_name            : text()
            .notNull(),
        item_stock_unit_count: integer()
            .default(0),
    },
    (table) => {
        return {
            pk                 : primaryKey({
                                                name   : 'items_primary_key',
                                                columns: [
                                                    table.item_id,
                                                    table.item_organization_id
                                                ],
                                            }),
            itemIdIndex        : index('item_id_idx')
                .on(table.item_id),
            organizationIdIndex: index('item_organization_id_fk_idx')
                .on(
                    table.item_organization_id,
                ),
        };
    },
);

export const SchemaInsertItem = createInsertSchema(items);
export type TItemInsert = z.infer<typeof SchemaInsertItem>
export const SchemaUpdateItem = createUpdateSchema(items)
export type TItemUpdate = z.infer<typeof SchemaUpdateItem>
export const SchemaSelectItem = createSelectSchema(items)
export type TItemSelect = z.infer<typeof SchemaSelectItem>

export const clients = pgTable(
    'clients',
    {
        client_id                : text()
            .unique()
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
        client_account_status    : text(
            'client_account_status',
            {
                enum: [
                    'ACTIVE',
                    'DEACTIVATED',
                    'UNVERIFIED'
                ],
            }
        )
            .notNull()
            .default(EAccountStatus.UNVERIFIED),
        client_registration_date : integer()
            .notNull(),
    },
    (table) => {
        return {
            pk                 : primaryKey({
                                                name   : 'clients_primary_key',
                                                columns: [
                                                    table.client_id,
                                                    table.client_organization_id,
                                                    table.client_stripe_customer_id,
                                                ],
                                            }),
            organizationIdIndex: index('client_organization_id_fk_idx')
                .on(
                    table.client_organization_id,
                ),
            stripeIdIndex      : index('client_stripe_customer_id_idx')
                .on(
                    table.client_stripe_customer_id,
                ),
        };
    },
);

export const SchemaInsertClient = createInsertSchema(clients);
export type TClientInsert = z.infer<typeof SchemaInsertClient>
export const SchemaUpdateClient = createUpdateSchema(clients);
export type TClientUpdate = z.infer<typeof SchemaUpdateClient>
export const SchemaSelectClient = createSelectSchema(clients)
export type TClientSelect = z.infer<typeof SchemaSelectClient>

export const clientsPayments = pgTable(
    'clients_payments',
    {
        client_payment_id             : text()
            .unique()
            .notNull(),
        client_payment_client_id      : text()
            .notNull()
            .references(() => clients.client_id),
        client_payment_organization_id: text()
            .notNull()
            .references(() => organizations.organization_id),
        client_payment_amount         : decimal(
            'client_payment_amount',
            {
                mode: 'number',
            }
        )
            .notNull(),
        client_payment_date           : integer()
            .notNull(),
        client_payment_status         : text(
            'client_payment_status',
            {
                enum: [
                    'PENDING',
                    'PAID',
                    'VERIFIED',
                    'REFUNDED'
                ],
            }
        )
            .notNull()
            .default(EPaymentStatus.PENDING),
    },
    (table) => {
        return {
            pk                  : primaryKey({
                                                 name   : 'clients_payments_primary_key',
                                                 columns: [
                                                     table.client_payment_id,
                                                     table.client_payment_client_id,
                                                     table.client_payment_organization_id,
                                                 ],
                                             }),
            clientPaymentIdIndex: index('client_payment_id_idx')
                .on(
                    table.client_payment_id,
                ),
            clientIdIndex       : index('client_payment_client_id_fk_idx')
                .on(
                    table.client_payment_client_id,
                ),
            organizationIdIndex : index('client_payment_organization_id_fk_idx')
                .on(
                    table.client_payment_organization_id,
                ),
        };
    },
);

export const SchemaInsertClientPayment = createInsertSchema(clientsPayments)
export type TClientPaymentInsert = z.infer<typeof SchemaInsertClientPayment>
export const SchemaUpdateClientPayment = createUpdateSchema(clientsPayments)
export type TClientPaymentUpdate = z.infer<typeof SchemaUpdateClientPayment>
export const SchemaSelectClientPayment = createSelectSchema(clientsPayments)
export type TClientPaymentSelect = z.infer<typeof SchemaSelectClientPayment>

export const sales = pgTable(
    'sales',
    {
        sale_id               : text()
            .unique()
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
        sale_value            : decimal({ mode: 'number' })
            .notNull(),
        sale_date             : integer()
            .notNull(),
    },
    (table) => {
        return {
            pk                  : primaryKey({
                                                 name   : 'sales_primary_key',
                                                 columns: [
                                                     table.sale_id,
                                                     table.sale_organization_id,
                                                     table.sale_employee_id,
                                                     table.sale_client_id,
                                                     table.sale_client_payment_id,
                                                     table.sale_item_id,
                                                 ],
                                             }),
            saleIdIndex         : index('sale_id_idx')
                .on(table.sale_id),
            organizationIdIndex : index('sale_organization_id_fk_idx')
                .on(
                    table.sale_organization_id,
                ),
            employeeIdIndex     : index('sale_employee_id_fk_idx')
                .on(
                    table.sale_employee_id,
                ),
            clientIdIndex       : index('sale_client_id_fk_idx')
                .on(table.sale_client_id),
            clientPaymentIdIndex: index('sale_client_payment_id_fk_idx')
                .on(
                    table.sale_client_payment_id,
                ),
            itemIdIndex         : index('sale_item_id_fk_idx')
                .on(table.sale_item_id),
        };
    },
);

export const SchemaInsertSale = createInsertSchema(sales);
export type TSaleInsert = z.infer<typeof SchemaInsertSale>;
export const SchemaUpdateSale = createUpdateSchema(sales);
export type TSaleUpdate = z.infer<typeof SchemaUpdateSale>
export const SchemaSelectSale = createSelectSchema(sales);
export type TSaleSelect = z.infer<typeof SchemaSelectSale>;

export const organizationsPayments = pgTable(
    'organizations_payments',
    {
        payment_id             : text()
            .unique()
            .notNull(),
        payment_organization_id: text()
            .notNull()
            .references(() => organizations.organization_id),
        payment_amount         : decimal(
            'payment_amount',
            { mode: 'number' }
        )
            .notNull(),
        payment_status         : text(
            'payment_status',
            {
                enum: [
                    'PENDING',
                    'PAID',
                    'VERIFIED',
                    'REFUNDED'
                ],
            }
        )
            .default(EPaymentStatus.VERIFIED),
        payment_timestamp      : integer()
            .notNull(),
    },
    (table) => {
        return {
            pk                 : primaryKey({
                                                name   : 'organization_payments_primary_key',
                                                columns: [
                                                    table.payment_id,
                                                    table.payment_organization_id
                                                ],
                                            }),
            paymentIdIndex     : index('organization_payment_id_idx')
                .on(table.payment_id),
            organizationIdIndex: index(
                'organization_payment_organization_id_fk_idx',
            )
                .on(table.payment_organization_id),
        };
    },
);

export const SchemaInsertOrganizationPayment = createInsertSchema(organizationsPayments)
export type TOrganizationPaymentInsert = z.infer<typeof SchemaInsertOrganizationPayment>
export const SchemaUpdateOrganizationPayment = createUpdateSchema(organizationsPayments)
export type TOrganizationPaymentUpdate = z.infer<typeof SchemaUpdateOrganizationPayment>
export const SchemaSelectOrganizationPayment = createSelectSchema(organizationsPayments)
export type TOrganizationPaymentSelect = z.infer<typeof SchemaSelectOrganizationPayment>

// --- RELATIONS ---
export const organizationsRelations = relations(
    organizations,
    ({ many }) => {
        return {
            employees            : many(employees),
            employeesCredentials : many(employeesCredentials),
            employeesLeaves      : many(employeesLeaves),
            employeesSalaries    : many(employeesSalaries),
            items                : many(items),
            salesGroups          : many(salesGroups),
            organizationsPayments: many(organizationsPayments),
            sales                : many(sales),
            clients              : many(clients),
            clientsPayments      : many(clientsPayments),
        };
    }
);

export const employeesRelations = relations(
    employees,
    ({
         one,
         many
     }) => {
        return {
            organization      : one(
                organizations,
                {
                    fields    : [ employees.employee_organization_id ],
                    references: [ organizations.organization_id ],
                }
            ),
            employeeCredential: one(
                employeesCredentials,
                {
                    fields    : [ employees.employee_id ],
                    references: [ employeesCredentials.employee_credential_employee_id ]
                }
            ),
            employeeLeave     : one(
                employeesLeaves,
                {
                    fields    : [ employees.employee_id ],
                    references: [ employeesLeaves.employee_leave_employee_id ]
                }
            ),
            employeeSalary    : one(
                employeesSalaries,
                {
                    fields    : [ employees.employee_id ],
                    references: [ employeesSalaries.employee_salary_employee_id ]
                }
            ),
            salesGroup        : one(
                salesGroups,
                {
                    fields    : [ employees.employee_sales_group_id ],
                    references: [ salesGroups.sales_group_id ],
                }
            ),
            sales             : many(sales),
        };
    }
);

export const employeesCredentialsRelations = relations(
    employeesCredentials,
    ({ one }) => {
        return {
            employee    : one(
                employees,
                {
                    fields    : [ employeesCredentials.employee_credential_employee_id ],
                    references: [ employees.employee_id ]
                }
            ),
            organization: one(
                organizations,
                {
                    fields    : [ employeesCredentials.employee_credential_organization_id ],
                    references: [ organizations.organization_id ]
                }
            )
        }
    }
)

export const employeesLeavesRelations = relations(
    employeesLeaves,
    ({ one }) => {
        return {
            employee    : one(
                employees,
                {
                    fields    : [ employeesLeaves.employee_leave_employee_id ],
                    references: [ employees.employee_id ]
                }
            ),
            organization: one(
                organizations,
                {
                    fields    : [ employeesLeaves.employee_leave_organization_id ],
                    references: [ organizations.organization_id ]
                }
            )
        }
    }
)

export const employeesSalariesRelations = relations(
    employeesSalaries,
    ({ one }) => {
        return {
            organization: one(
                organizations,
                {
                    fields    : [ employeesSalaries.employee_salary_organization_id ],
                    references: [ organizations.organization_id ]
                }
            ),
            employee    : one(
                employees,
                {
                    fields    : [ employeesSalaries.employee_salary_employee_id ],
                    references: [ employees.employee_id ]
                }
            )
        }
    }
)

export const itemsRelations = relations(
    items,
    ({
         one,
         many
     }) => {
        return {
            organization: one(
                organizations,
                {
                    fields    : [ items.item_organization_id ],
                    references: [ organizations.organization_id ],
                }
            ),
            sales       : many(sales),
        };
    }
);

export const salesGroupsRelations = relations(
    salesGroups,
    ({
         one,
         many
     }) => {
        return {
            organization: one(
                organizations,
                {
                    fields    : [ salesGroups.sales_group_organization_id ],
                    references: [ organizations.organization_id ],
                }
            ),
            employees   : many(employees),
        };
    }
);

export const salesRelations = relations(
    sales,
    ({ one }) => {
        return {
            item         : one(
                items,
                {
                    fields    : [ sales.sale_item_id ],
                    references: [ items.item_id ],
                }
            ),
            employee     : one(
                employees,
                {
                    fields    : [ sales.sale_employee_id ],
                    references: [ employees.employee_id ],
                }
            ),
            organization : one(
                organizations,
                {
                    fields    : [ sales.sale_organization_id ],
                    references: [ organizations.organization_id ],
                }
            ),
            client       : one(
                clients,
                {
                    fields    : [ sales.sale_client_id ],
                    references: [ clients.client_id ],
                }
            ),
            clientPayment: one(
                clientsPayments,
                {
                    fields    : [ sales.sale_client_payment_id ],
                    references: [ clientsPayments.client_payment_id ],
                }
            ),
        };
    }
);

export const clientsRelations = relations(
    clients,
    ({
         one,
         many
     }) => {
        return {
            organization: one(
                organizations,
                {
                    fields    : [ clients.client_organization_id ],
                    references: [ organizations.organization_id ],
                }
            ),
            payments    : many(clientsPayments),
            sales       : many(sales),
        };
    }
);

export const clientsPaymentsRelations = relations(
    clientsPayments,
    ({ one }) => {
        return {
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
        };
    },
);

// --- TYPE EXPORTS ---
export type TPGOrganization = typeof organizations.$inferInsert;
export type TPGEmployee = typeof employees.$inferInsert;
export type TPGItem = typeof items.$inferInsert;
export type TPGSalesGroup = typeof salesGroups.$inferInsert;
export type TPGSale = typeof sales.$inferInsert;
export type TPGClient = typeof clients.$inferInsert;
export type TPGClientPayment = typeof clientsPayments.$inferInsert;
export type TPGOrganizationPayment = typeof organizationsPayments.$inferInsert;
export type TPGEmployeeCredentials = typeof employeesCredentials.$inferInsert;
export type TPGEmployeeLeaves = typeof employeesLeaves.$inferInsert;
export type TPGEmployeeSalary = typeof employeesSalaries.$inferInsert;
