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
    EActivityType,
    EOrganizationStatus,
    EPaymentStatus,
    ESubscriptionStatus,
}                    from '../../../types';



export type Prettify<T> = {
                              [K in keyof T]: T[K]
                          } & {}

export const EPGPaymentStatus = pgEnum('EPaymentStatus', EPaymentStatus);

export const EPGSubscriptionStatus = pgEnum(
    'ESubscriptionStatus',
    ESubscriptionStatus,
);
export const EPGOrganizationStatus = pgEnum(
    'EOrganizationStatus',
    EOrganizationStatus,
);
export const EPGAccountStatus      = pgEnum('EAccountStatus', EAccountStatus);

export const EPGActivityType = pgEnum('EActivityType', [
    'SALE_INITIALIZED',
    'SALE_CLOSED',
    'SALE_PROSPECTED',
    'DAY_OFF_REQUESTED',
    'REPORTED',
    'DATA_SYNCED',
    'LOGGED_OFF',
    'LOGGED_IN',
    'PAYMENT_ADDED',
    'CLIENT_ADDED',
    'CLIENT_UPDATED',
    'ITEM_ADDED',
    'ITEM_UPDATED',
    'CHECK_IN',
    'CHECK_OUT',
    'BREAK_STARTED',
    'BREAK_ENDED',
    'TRAVEL_STARTED',
    'TRAVEL_ENDED',
    'MEETING_ATTENDED',
    'TASK_COMPLETED',
    'REPORT_SUBMITTED',
    'EXPENSE_SUBMITTED',
    'ERROR_OCCURRED',
    'LEAVE_APPROVED',
    'LEAVE_REJECTED',
    'EXPENSE_APPROVED',
    'EXPENSE_REJECTED',
    'SALARY_PAID',
    'PROFILE_UPDATED',
    'PASSWORD_CHANGED',
    'NOTIFICATION_SENT',
    'DOCUMENT_UPLOADED',
    'INVENTORY_CHECKED'
] as const);

// ==========================
// TABLE - ORGANIZATIONS
// ==========================

export const organizations = pgTable('organizations', {
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
    organization_status               : text('organization_status', {
        enum: [
            'ACTIVE',
            'DEACTIVATED',
            'SUSPENDED',
            'TRIAL'
        ],
    })
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
}, (table) => {
    return {
        pk                 : primaryKey({
                                            name   : 'organization_primary_key',
                                            columns: [
                                                table.organization_id,
                                                table.organization_stripe_customer_id
                                            ],
                                        }),
        organizationIdIndex: index('organization_id_idx')
            .on(table.organization_id),
        stripeIdIndex      : index('organization_stripe_customer_id_idx')
            .on(table.organization_stripe_customer_id),
    };
});

export const SchemaInsertOrganization = createInsertSchema(organizations)
export const SchemaOrganizationData   = SchemaInsertOrganization.omit({
                                                                          organization_id      : true,
                                                                          organization_admin_id: true
                                                                      })
export const SchemaUpdateOrganization = createUpdateSchema(organizations)
    .omit({
              organization_id                : true,
              organization_admin_id          : true,
              organization_stripe_customer_id: true
          });
export const SchemaSelectOrganization = createSelectSchema(organizations)

export type TOrganizationInsert = z.infer<typeof SchemaInsertOrganization>
export type TOrganizationData = z.infer<typeof SchemaOrganizationData>
export type TOrganizationUpdate = z.infer<typeof SchemaUpdateOrganization>
export type TOrganizationSelect = z.infer<typeof SchemaSelectOrganization>

// ==========================
// TABLE - EMPLOYEES
// ==========================

export const employees = pgTable('employees', {
    employee_id                 : text()
        .unique()
        .notNull(),
    employee_organization_id    : text()
        .notNull()
        .references(() => organizations.organization_id),
    employee_sales_group_id     : text()
        .references(() => salesGroups.sales_group_id),
    employee_profile_picture_url: text(),
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
}, (table) => {
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
            .on(table.employee_organization_id),
        salesGroupIdIndex  : index('employee_sales_group_id_fk_idx')
            .on(table.employee_sales_group_id),
        nicIndex           : index('employee_nic_number_unique_idx')
            .on(table.employee_nic_number),
    };
});

export const SchemaEmployeeInsert = createInsertSchema(employees)
export const SchemaEmployeeData   = SchemaEmployeeInsert.omit({
                                                                  employee_id             : true,
                                                                  employee_organization_id: true
                                                              })
export const SchemaEmployeeUpdate = createUpdateSchema(employees)
    .omit({
              employee_id             : true,
              employee_organization_id: true
          });
export const SchemaEmployeeSelect = createSelectSchema(employees)

export type TEmployeeInsert = z.infer<typeof SchemaEmployeeInsert>
export type TEmployeeData = z.infer<typeof SchemaEmployeeData>
export type TEmployeeUpdate = z.infer<typeof SchemaEmployeeUpdate>
export type TEmployeeSelect = z.infer<typeof SchemaEmployeeSelect>

// ==========================
// TABLE - EMPLOYEES_ATTENDANCES
// ==========================

export const employeesAttendances = pgTable('employees_attendances', {
    employee_attendance_id                : text()
        .unique()
        .notNull(),
    employee_attendance_employee_id       : text()
        .notNull()
        .references(() => employees.employee_id),
    employee_attendance_organization_id   : text()
        .notNull()
        .references(() => organizations.organization_id),
    employee_attendance_year              : integer()
        .notNull(),
    employee_attendance_month             : integer()
        .notNull(),
    employee_attendance_total_reported    : integer()
        .notNull()
        .default(0),
    employee_attendance_total_non_reported: integer()
        .notNull()
        .default(0),
    employee_attendance_total_half_days   : integer()
        .notNull()
        .default(0),
    employee_attendance_total_day_offs    : integer()
        .notNull()
        .default(0),
}, (table) => {
    return {
        pk                 : primaryKey({
                                            name   : 'employees_attendances_pk',
                                            columns: [
                                                table.employee_attendance_id,
                                                table.employee_attendance_organization_id,
                                                table.employee_attendance_employee_id,
                                            ]
                                        }),
        employeeIdIndex    : index('employee_attendance_employee_id_idx')
            .on(table.employee_attendance_employee_id),
        organizationIdIndex: index('employee_attendance_organization_id_idx')
            .on(table.employee_attendance_organization_id),
    }
})

export const SchemaEmployeeAttendanceInsert = createInsertSchema(
    employeesAttendances)
export const SchemaEmployeeAttendanceData   = SchemaEmployeeAttendanceInsert.omit(
    {
        employee_attendance_id             : true,
        employee_attendance_employee_id    : true,
        employee_attendance_organization_id: true
    })
export const SchemaEmployeeAttendanceUpdate = createUpdateSchema(
    employeesAttendances)
    .omit({
              employee_attendance_id             : true,
              employee_attendance_employee_id    : true,
              employee_attendance_organization_id: true
          });
export const SchemaEmployeeAttendanceSelect = createSelectSchema(
    employeesAttendances)

export type TEmployeeAttendanceInsert = z.infer<typeof SchemaEmployeeAttendanceInsert>
export type TEmployeeAttendanceData = z.infer<typeof SchemaEmployeeAttendanceData>
export type TEmployeeAttendanceUpdate = z.infer<typeof SchemaEmployeeAttendanceUpdate>
export type TEmployeeAttendanceSelect = z.infer<typeof SchemaEmployeeAttendanceSelect>

// ==========================
// TABLE - EMPLOYEES_ACTIVITIES
// ==========================

export const employeesActivities = pgTable('employees_activities', {
    employee_activity_id             : text()
        .unique()
        .notNull(),
    employee_activity_employee_id    : text()
        .notNull()
        .references(() => employees.employee_id),
    employee_activity_organization_id: text()
        .notNull()
        .references(() => organizations.organization_id),
    employee_activity_type           : EPGActivityType()
        .notNull(),
    employee_activity_timestamp      : integer()
        .notNull()
        .$defaultFn(() => Math.floor(Date.now() / 1000)),
    employee_activity_message        : text()
        .notNull(),
    employee_activity_latitude       : decimal({
                                                   mode     : 'number',
                                                   precision: 10,
                                                   scale    : 8
                                               }),
    employee_activity_longitude      : decimal({
                                                   mode     : 'number',
                                                   precision: 11,
                                                   scale    : 8
                                               }),
    employee_activity_ip_address     : text(),
    employee_activity_status         : text({
                                                enum: [
                                                    'ACTIVE',
                                                    'ARCHIVED',
                                                    'DELETED'
                                                ]
                                            })
        .default('ACTIVE')
        .notNull(),
    employee_activity_created_at     : integer()
        .notNull()
        .$defaultFn(() => Math.floor(Date.now() / 1000)),
    employee_activity_updated_at     : integer()
        .notNull()
        .$defaultFn(() => Math.floor(Date.now() / 1000))
}, (table) => {
    return {
        pk                 : primaryKey({
                                            name   : 'employees_activities_pk',
                                            columns: [ table.employee_activity_id ]
                                        }),
        employeeIdIndex    : index('employee_activity_employee_id_idx')
            .on(table.employee_activity_employee_id),
        organizationIdIndex: index('employee_activity_organization_id_idx')
            .on(table.employee_activity_organization_id),
        activityTypeIndex  : index('employee_activity_type_idx')
            .on(table.employee_activity_type),
        timestampIndex     : index('employee_activity_timestamp_idx')
            .on(table.employee_activity_timestamp),
        compositeIndex     : index('employee_activity_employee_timestamp_idx')
            .on(
                table.employee_activity_employee_id,
                table.employee_activity_timestamp
            ),
    }
})

export const SchemaEmployeeActivityInsert = createInsertSchema(
    employeesActivities)
    .extend({
                employee_activity_timestamp : z.number().int().positive(),
                employee_activity_message   : z.string().min(1).max(500),
                employee_activity_latitude  : z.number()
                                               .min(-90)
                                               .max(90)
                                               .optional(),
                employee_activity_longitude : z.number()
                                               .min(-180)
                                               .max(180)
                                               .optional(),
                employee_activity_ip_address: z.ipv4().optional()
            })

export const SchemaEmployeeActivityData = SchemaEmployeeActivityInsert
    .omit({
              employee_activity_id             : true,
              employee_activity_employee_id    : true,
              employee_activity_organization_id: true,
              employee_activity_created_at     : true,
              employee_activity_updated_at     : true,
              employee_activity_status         : true
          });

export const SchemaEmployeeActivityUpdate = createUpdateSchema(
    employeesActivities)
    .extend({
                employee_activity_timestamp : z.number()
                                               .int()
                                               .positive()
                                               .optional(),
                employee_activity_message   : z.string()
                                               .min(1)
                                               .max(500)
                                               .optional(),
                employee_activity_latitude  : z.number()
                                               .min(-90)
                                               .max(90)
                                               .optional(),
                employee_activity_longitude : z.number()
                                               .min(-180)
                                               .max(180)
                                               .optional(),
                employee_activity_ip_address: z.ipv4().optional()
            })
    .omit({
              employee_activity_id             : true,
              employee_activity_employee_id    : true,
              employee_activity_organization_id: true,
              employee_activity_created_at     : true
          });

export const SchemaEmployeeActivitySelect = createSelectSchema(
    employeesActivities)
    .extend({
                employee_activity_timestamp: z.number().int(),
                employee_activity_message  : z.string(),
                employee_activity_latitude : z.number().optional().nullable(),
                employee_activity_longitude: z.number().optional().nullable()
            });

export type TEmployeeActivityInsert = z.infer<typeof SchemaEmployeeActivityInsert>
export type TEmployeeActivityData = z.infer<typeof SchemaEmployeeActivityData>
export type TEmployeeActivityUpdate = z.infer<typeof SchemaEmployeeActivityUpdate>
export type TEmployeeActivitySelect = z.infer<typeof SchemaEmployeeActivitySelect>

// ==========================
// TABLE - EMPLOYEES_CREDENTIALS
// ==========================

export const employeesCredentials = pgTable('employees_credentials', {
    employee_credential_id             : text()
        .unique()
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
        .notNull()
}, (table) => {
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
})

export const SchemaEmployeeCredentialsInsert = createInsertSchema(
    employeesCredentials)
export const SchemaEmployeeCredentialsData   = SchemaEmployeeCredentialsInsert.omit(
    {
        employee_credential_id             : true,
        employee_credential_employee_id    : true,
        employee_credential_organization_id: true
    })
export const SchemaEmployeeCredentialsUpdate = createUpdateSchema(
    employeesCredentials)
    .omit({
              employee_credential_id             : true,
              employee_credential_employee_id    : true,
              employee_credential_organization_id: true
          });
export const SchemaEmployeeCredentialsSelect = createSelectSchema(
    employeesCredentials)

export type TEmployeeCredentialsInsert = z.infer<typeof SchemaEmployeeCredentialsInsert>
export type TEmployeeCredentialsData = z.infer<typeof SchemaEmployeeCredentialsData>
export type TEmployeeCredentialsUpdate = z.infer<typeof SchemaEmployeeCredentialsUpdate>
export type TEmployeeCredentialsSelect = z.infer<typeof SchemaEmployeeCredentialsSelect>

// ==========================
// TABLE - EMPLOYEES_SALARIES
// ==========================

export const employeesSalaries = pgTable('employees_salaries', {
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
}, (table) => {
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
})

export const SchemaEmployeeSalaryInsert = createInsertSchema(employeesSalaries)
export const SchemaEmployeeSalaryData   = SchemaEmployeeSalaryInsert.omit({
                                                                              employee_salary_id             : true,
                                                                              employee_salary_organization_id: true,
                                                                              employee_salary_employee_id    : true
                                                                          })
export const SchemaEmployeeSalaryUpdate = createUpdateSchema(employeesSalaries)
    .omit({
              employee_salary_id             : true,
              employee_salary_organization_id: true,
              employee_salary_employee_id    : true
          });
export const SchemaEmployeeSalarySelect = createSelectSchema(employeesSalaries)

export type TEmployeeSalaryInsert = z.infer<typeof SchemaEmployeeSalaryInsert>
export type TEmployeeSalaryData = z.infer<typeof SchemaEmployeeSalaryData>
export type TEmployeeSalaryUpdate = z.infer<typeof SchemaEmployeeSalaryUpdate>
export type TEmployeeSalarySelect = z.infer<typeof SchemaEmployeeSalarySelect>

// ==========================
// TABLE - SALES_GROUPS
// ==========================

export const salesGroups = pgTable('sales_groups', {
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
}, (table) => {
    return {
        pk                 : primaryKey({
                                            name   : 'sales_group_primary_key',
                                            columns: [
                                                table.sales_group_id,
                                                table.sales_group_organization_id
                                            ],
                                        }),
        organizationIdIndex: index('sales_group_organization_id_fk_idx')
            .on(table.sales_group_organization_id),
        nameIndex          : index('sales_group_name_unique_idx')
            .on(table.sales_group_name),
    };
});

export const SchemaSalesGroupInsert = createInsertSchema(salesGroups)
export const SchemaSalesGroupData   = SchemaSalesGroupInsert.omit({
                                                                      sales_group_id             : true,
                                                                      sales_group_organization_id: true
                                                                  })
export const SchemaSalesGroupUpdate = createUpdateSchema(salesGroups)
    .omit({
              sales_group_id             : true,
              sales_group_organization_id: true
          });
export const SchemaSalesGroupSelect = createSelectSchema(salesGroups)

export type TSalesGroupInsert = z.infer<typeof SchemaSalesGroupInsert>
export type TSalesGroupData = z.infer<typeof SchemaSalesGroupData>
export type TSalesGroupUpdate = z.infer<typeof SchemaSalesGroupUpdate>
export type TSalesGroupSelect = z.infer<typeof SchemaSalesGroupSelect>

// ==========================
// TABLE - ITEMS
// ==========================

export const items = pgTable('items', {
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
}, (table) => {
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
            .on(table.item_organization_id),
    };
});

export const SchemaItemInsert = createInsertSchema(items)
export const SchemaItemData   = SchemaItemInsert.omit({
                                                          item_id             : true,
                                                          item_organization_id: true
                                                      })
export const SchemaItemUpdate = createUpdateSchema(items)
    .omit({
              item_id             : true,
              item_organization_id: true
          });
export const SchemaItemSelect = createSelectSchema(items)

export type TItemInsert = z.infer<typeof SchemaItemInsert>
export type TItemData = z.infer<typeof SchemaItemData>
export type TItemUpdate = z.infer<typeof SchemaItemUpdate>
export type TItemSelect = z.infer<typeof SchemaItemSelect>

// ==========================
// TABLE - CLIENTS
// ==========================

export const clients = pgTable('clients', {
    client_id               : text()
        .unique()
        .notNull(),
    client_organization_id  : text()
        .notNull()
        .references(() => organizations.organization_id),
    client_name             : text()
        .notNull(),
    client_nic_number       : text()
        .notNull(),
    client_email            : text()
        .notNull(),
    client_phone            : text()
        .notNull(),
    client_account_status   : text('client_account_status', {
        enum: [
            'ACTIVE',
            'DEACTIVATED',
            'UNVERIFIED'
        ],
    })
        .notNull()
        .default(EAccountStatus.UNVERIFIED),
    client_registration_date: integer()
        .notNull(),
}, (table) => {
    return {
        pk                 : primaryKey({
                                            name   : 'clients_primary_key',
                                            columns: [
                                                table.client_id,
                                                table.client_organization_id,
                                            ],
                                        }),
        organizationIdIndex: index('client_organization_id_fk_idx')
            .on(table.client_organization_id),
    };
});

export const SchemaClientInsert = createInsertSchema(clients)
export const SchemaClientData   = SchemaClientInsert.omit({
                                                              client_id             : true,
                                                              client_organization_id: true
                                                          })
export const SchemaClientUpdate = createUpdateSchema(clients)
    .omit({
              client_id             : true,
              client_organization_id: true
          });
export const SchemaClientSelect = createSelectSchema(clients)

export type TClientInsert = z.infer<typeof SchemaClientInsert>
export type TClientData = z.infer<typeof SchemaClientData>
export type TClientUpdate = z.infer<typeof SchemaClientUpdate>
export type TClientSelect = z.infer<typeof SchemaClientSelect>

// ==========================
// TABLE - CLIENTS_PAYMENTS
// ==========================

export const clientsPayments = pgTable('clients_payments', {
    client_payment_id             : text()
        .unique()
        .notNull(),
    client_payment_client_id      : text()
        .notNull()
        .references(() => clients.client_id),
    client_payment_organization_id: text()
        .notNull()
        .references(() => organizations.organization_id),
    client_payment_amount         : decimal('client_payment_amount', {
        mode: 'number',
    })
        .notNull(),
    client_payment_date           : integer()
        .notNull(),
    client_payment_status         : text('client_payment_status', {
        enum: [
            'PENDING',
            'PAID',
            'VERIFIED',
            'REFUNDED'
        ],
    })
        .notNull()
        .default(EPaymentStatus.PENDING),
}, (table) => {
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
            .on(table.client_payment_id),
        clientIdIndex       : index('client_payment_client_id_fk_idx')
            .on(table.client_payment_client_id),
        organizationIdIndex : index('client_payment_organization_id_fk_idx')
            .on(table.client_payment_organization_id),
    };
});

export const SchemaClientPaymentInsert = createInsertSchema(clientsPayments)
export const SchemaClientPaymentData   = SchemaClientPaymentInsert.omit({
                                                                            client_payment_id             : true,
                                                                            client_payment_client_id      : true,
                                                                            client_payment_organization_id: true
                                                                        })
export const SchemaClientPaymentUpdate = createUpdateSchema(clientsPayments)
    .omit({
              client_payment_id             : true,
              client_payment_client_id      : true,
              client_payment_organization_id: true
          });
export const SchemaClientPaymentSelect = createSelectSchema(clientsPayments)

export type TClientPaymentInsert = z.infer<typeof SchemaClientPaymentInsert>
export type TClientPaymentData = z.infer<typeof SchemaClientPaymentData>
export type TClientPaymentUpdate = z.infer<typeof SchemaClientPaymentUpdate>
export type TClientPaymentSelect = z.infer<typeof SchemaClientPaymentSelect>

// ==========================
// TABLE - SALES
// ==========================

export const sales = pgTable('sales', {
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
}, (table) => {
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
            .on(table.sale_organization_id),
        employeeIdIndex     : index('sale_employee_id_fk_idx')
            .on(table.sale_employee_id),
        clientIdIndex       : index('sale_client_id_fk_idx')
            .on(table.sale_client_id),
        clientPaymentIdIndex: index('sale_client_payment_id_fk_idx')
            .on(table.sale_client_payment_id),
        itemIdIndex         : index('sale_item_id_fk_idx')
            .on(table.sale_item_id),
    };
});

export const SchemaSaleInsert = createInsertSchema(sales)
export const SchemaSaleData   = SchemaSaleInsert.omit({
                                                          sale_id             : true,
                                                          sale_organization_id: true,
                                                          sale_employee_id    : true,
                                                      })
export const SchemaSaleUpdate = createUpdateSchema(sales)
    .omit({
              sale_id               : true,
              sale_organization_id  : true,
              sale_employee_id      : true,
              sale_client_id        : true,
              sale_client_payment_id: true,
              sale_item_id          : true
          });
export const SchemaSaleSelect = createSelectSchema(sales)

export type TSaleInsert = z.infer<typeof SchemaSaleInsert>
export type TSaleData = z.infer<typeof SchemaSaleData>
export type TSaleUpdate = z.infer<typeof SchemaSaleUpdate>
export type TSaleSelect = z.infer<typeof SchemaSaleSelect>

// ==========================
// TABLE - ORGANIZATIONS_PAYMENTS
// ==========================

export const organizationsPayments = pgTable('organizations_payments', {
    organization_payment_id             : text()
        .unique()
        .notNull(),
    organization_payment_organization_id: text()
        .notNull()
        .references(() => organizations.organization_id),
    organization_payment_amount         : decimal(
        'payment_amount',
        { mode: 'number' }
    )
        .notNull(),
    organization_payment_status         : text('payment_status', {
        enum: [
            'PENDING',
            'PAID',
            'VERIFIED',
            'REFUNDED'
        ],
    })
        .default(EPaymentStatus.VERIFIED)
        .notNull(),
    organization_payment_timestamp      : integer()
        .notNull(),
}, (table) => {
    return {
        pk                 : primaryKey({
                                            name   : 'organization_payments_primary_key',
                                            columns: [
                                                table.organization_payment_id,
                                                table.organization_payment_organization_id
                                            ],
                                        }),
        paymentIdIndex     : index('organization_payment_id_idx')
            .on(table.organization_payment_id),
        organizationIdIndex: index('organization_payment_organization_id_fk_idx')
            .on(table.organization_payment_organization_id),
    };
});

export const SchemaOrganizationPaymentInsert = createInsertSchema(
    organizationsPayments)
export const SchemaOrganizationPaymentData   = SchemaOrganizationPaymentInsert.omit(
    {
        organization_payment_id             : true,
        organization_payment_organization_id: true
    })
export const SchemaOrganizationPaymentUpdate = createUpdateSchema(
    organizationsPayments)
    .omit({
              organization_payment_id             : true,
              organization_payment_organization_id: true
          });
export const SchemaOrganizationPaymentSelect = createSelectSchema(
    organizationsPayments)

export type TOrganizationPaymentInsert = z.infer<typeof SchemaOrganizationPaymentInsert>
export type TOrganizationPaymentData = z.infer<typeof SchemaOrganizationPaymentData>
export type TOrganizationPaymentUpdate = z.infer<typeof SchemaOrganizationPaymentUpdate>
export type TOrganizationPaymentSelect = z.infer<typeof SchemaOrganizationPaymentSelect>

// ==========================
// RELATIONS
// ==========================

export const organizationsRelations = relations(organizations, ({ many }) => {
    return {
        employees            : many(employees),
        employeesCredentials : many(employeesCredentials),
        employeesAttendances : many(employeesAttendances),
        employeesActivities  : many(employeesActivities),
        employeesSalaries    : many(employeesSalaries),
        items                : many(items),
        salesGroups          : many(salesGroups),
        organizationsPayments: many(organizationsPayments),
        sales                : many(sales),
        clients              : many(clients),
        clientsPayments      : many(clientsPayments),
    };
});

export const employeesRelations = relations(employees, ({
                                                            one,
                                                            many
                                                        }) => {
    return {
        organization      : one(organizations, {
            fields    : [ employees.employee_organization_id ],
            references: [ organizations.organization_id ],
        }),
        employeeCredential: one(employeesCredentials, {
            fields    : [ employees.employee_id ],
            references: [ employeesCredentials.employee_credential_employee_id ]
        }),
        employeeAttendance: one(employeesAttendances, {
            fields    : [ employees.employee_id ],
            references: [ employeesAttendances.employee_attendance_employee_id ]
        }),
        employeeSalary    : one(employeesSalaries, {
            fields    : [ employees.employee_id ],
            references: [ employeesSalaries.employee_salary_employee_id ]
        }),
        salesGroup        : one(salesGroups, {
            fields    : [ employees.employee_sales_group_id ],
            references: [ salesGroups.sales_group_id ],
        }),
        sales             : many(sales),
        activities        : many(employeesActivities),
    };
});

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

export const employeesAttendancesRelations = relations(
    employeesAttendances,
    ({ one }) => {
        return {
            employee    : one(
                employees,
                {
                    fields    : [ employeesAttendances.employee_attendance_employee_id ],
                    references: [ employees.employee_id ]
                }
            ),
            organization: one(
                organizations,
                {
                    fields    : [ employeesAttendances.employee_attendance_organization_id ],
                    references: [ organizations.organization_id ]
                }
            )
        }
    }
)

export const employeesActivitiesRelations = relations(
    employeesActivities,
    ({ one }) => {
        return {
            employee    : one(
                employees,
                {
                    fields    : [ employeesActivities.employee_activity_employee_id ],
                    references: [ employees.employee_id ]
                }
            ),
            organization: one(
                organizations,
                {
                    fields    : [ employeesActivities.employee_activity_organization_id ],
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
            organization: one(organizations,
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

export const itemsRelations = relations(items, ({
                                                    one,
                                                    many
                                                }) => {
    return {
        organization: one(organizations, {
            fields    : [ items.item_organization_id ],
            references: [ organizations.organization_id ],
        }),
        sales       : many(sales),
    };
});

export const salesGroupsRelations = relations(salesGroups, ({
                                                                one,
                                                                many
                                                            }) => {
    return {
        organization: one(organizations, {
            fields    : [ salesGroups.sales_group_organization_id ],
            references: [ organizations.organization_id ],
        }),
        employees   : many(employees),
    };
});

export const salesRelations = relations(sales, ({ one }) => {
    return {
        item         : one(items, {
            fields    : [ sales.sale_item_id ],
            references: [ items.item_id ],
        }),
        employee     : one(employees, {
            fields    : [ sales.sale_employee_id ],
            references: [ employees.employee_id ],
        }),
        organization : one(organizations, {
            fields    : [ sales.sale_organization_id ],
            references: [ organizations.organization_id ],
        }),
        client       : one(clients, {
            fields    : [ sales.sale_client_id ],
            references: [ clients.client_id ],
        }),
        clientPayment: one(clientsPayments, {
            fields    : [ sales.sale_client_payment_id ],
            references: [ clientsPayments.client_payment_id ],
        }),
    };
});

export const clientsRelations = relations(clients, ({
                                                        one,
                                                        many
                                                    }) => {
    return {
        organization: one(organizations, {
            fields    : [ clients.client_organization_id ],
            references: [ organizations.organization_id ],
        }),
        payments    : many(clientsPayments),
        sales       : many(sales),
    };
});

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
    }
);

/*
 // ==========================
 // TABLE - ORGANIZATION
 // ==========================
 
 export const organizations = pgTable('organizations', {
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
 organization_status               : text('organization_status', {
 enum: [
 'ACTIVE',
 'DEACTIVATED',
 'SUSPENDED',
 'TRIAL'
 ],
 })
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
 }, (table) => {
 return {
 pk                 : primaryKey({
 name   : 'organization_primary_key',
 columns: [
 table.organization_id,
 table.organization_stripe_customer_id
 ],
 }),
 organizationIdIndex: index('organization_id_idx')
 .on(table.organization_id,),
 stripeIdIndex      : index('organization_stripe_customer_id_idx')
 .on(table.organization_stripe_customer_id,),
 };
 },);
 
 export const SchemaInsertOrganization = createInsertSchema(organizations)
 export const SchemaOrganizationData   = SchemaInsertOrganization.omit({
 organization_id      : true,
 organization_admin_id: true
 })
 export const SchemaUpdateOrganization = createUpdateSchema(organizations)
 .omit({
 organization_id                : true,
 organization_admin_id          : true,
 organization_stripe_customer_id: true
 });
 export const SchemaSelectOrganization = createSelectSchema(organizations)
 
 export type TOrganizationInsert = z.infer<typeof SchemaInsertOrganization>
 export type TOrganizationData = z.infer<typeof SchemaOrganizationData>
 export type TOrganizationUpdate = z.infer<typeof SchemaUpdateOrganization>
 export type TOrganizationSelect = z.infer<typeof SchemaSelectOrganization>
 
 // ==========================
 // TABLE - EMPLOYEES
 // ==========================
 
 export const employees = pgTable('employees', {
 employee_id                 : text()
 .unique()
 .notNull(),
 employee_organization_id    : text()
 .notNull()
 .references(() => organizations.organization_id),
 employee_sales_group_id     : text()
 .references(() => salesGroups.sales_group_id,),
 employee_profile_picture_url: text(),
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
 }, (table) => {
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
 .on(table.employee_organization_id,),
 salesGroupIdIndex  : index('employee_sales_group_id_fk_idx')
 .on(table.employee_sales_group_id,),
 nicIndex           : index('employee_nic_number_unique_idx')
 .on(table.employee_nic_number,),
 };
 },);
 
 export const SchemaEmployeeInsert = createInsertSchema(employees)
 export const SchemaEmployeeData   = SchemaEmployeeInsert.omit({
 employee_id             : true,
 employee_organization_id: true
 })
 export const SchemaEmployeeUpdate = createUpdateSchema(employees)
 .omit({
 employee_id             : true,
 employee_organization_id: true
 });
 export const SchemaEmployeeSelect = createSelectSchema(employees)
 
 export type TEmployeeInsert = z.infer<typeof SchemaEmployeeInsert>
 export type TEmployeeData = z.infer<typeof SchemaEmployeeData>
 export type TEmployeeUpdate = z.infer<typeof SchemaEmployeeUpdate>
 export type TEmployeeSelect = z.infer<typeof SchemaEmployeeSelect>
 
 // EDIT =====================
 // ==========================
 // TABLE - EMPLOYEES_LEAVES
 // ==========================
 
 export const employeeAttendances = pgTable('employees_attendances', {
 employee_attendance_id                : text()
 .unique()
 .notNull(),
 employee_attendance_employee_id       : text()
 .notNull()
 .references(() => employees.employee_id),
 employee_attendance_organization_id   : text()
 .notNull()
 .references(() => organizations.organization_id),
 employee_attendance_year              : integer().notNull(),
 employee_attendance_month             : integer().notNull(),
 employee_attendance_total_reported    : integer()
 .notNull()
 .default(0),
 employee_attendance_total_non_reported: integer().notNull().default(0),
 employee_attendance_total_half_days   : integer().notNull().default(0),
 employee_attendance_total_day_offs    : integer().notNull().default(0),
 }, (table) => {
 return {
 pk                 : primaryKey({
 name   : 'employees_attendances_pk',
 columns: [
 table.employee_attendance_id,
 table.employee_attendance_organization_id,
 table.employee_attendance_employee_id,
 ]
 }),
 employeeIdIndex    : index('employee_attendance_employee_id_idx')
 .on(table.employee_attendance_employee_id),
 organizationIdIndex: index('employee_attendance_organization_id_idx')
 .on(table.employee_attendance_organization_id),
 }
 })
 
 export const SchemaEmployeeAttendanceInsert = createInsertSchema(
 employeeAttendances)
 export const SchemaEmployeeAttendanceData   = SchemaEmployeeAttendanceInsert.omit(
 {
 employee_attendance_id             : true,
 employee_attendance_employee_id    : true,
 employee_attendance_organization_id: true
 })
 export const SchemaEmployeeAttendanceUpdate = createUpdateSchema(
 employeeAttendances)
 .omit({
 employee_attendance_id             : true,
 employee_attendance_employee_id    : true,
 employee_attendance_organization_id: true
 });
 export const SchemaEmployeeAttendanceSelect = createSelectSchema(
 employeeAttendances)
 
 export type TEmployeeAttendanceInsert = z.infer<typeof SchemaEmployeeAttendanceInsert>
 export type TEmployeeAttendanceData = z.infer<typeof SchemaEmployeeAttendanceData>
 export type TEmployeeAttendanceUpdate = z.infer<typeof SchemaEmployeeAttendanceUpdate>
 export type TEmployeeAttendanceSelect = z.infer<typeof SchemaEmployeeAttendanceSelect>
 
 // ==========================
 // TABLE - EMPLOYEES_ACTIVITIES
 // ==========================
 
 export const employeesActivities = pgTable('employees_activities', {
 employee_activity_id             : text()
 .unique()
 .notNull(),
 employee_activity_employee_id    : text()
 .notNull()
 .references(() => employees.employee_id),
 employee_activity_organization_id: text()
 .notNull()
 .references(() => organizations.organization_id),
 employee_activity_type           : EPGActivityType()
 .notNull(),
 employee_activity_timestamp      : integer()
 .notNull()
 .$defaultFn(() => Math.floor(Date.now() / 1000)),
 employee_activity_message        : text()
 .notNull(),
 employee_activity_latitude       : decimal({
 mode     : 'number',
 precision: 10,
 scale    : 8
 }),
 employee_activity_longitude      : decimal({
 mode     : 'number',
 precision: 11,
 scale    : 8
 }),
 
 employee_activity_ip_address: text(),
 employee_activity_status    : text({
 enum: [
 'ACTIVE',
 'ARCHIVED',
 'DELETED'
 ]
 })
 .default('ACTIVE')
 .notNull(),
 }, (table) => {
 return {
 pk                 : primaryKey({
 name   : 'employees_activities_pk',
 columns: [ table.employee_activity_id ]
 }),
 employeeIdIndex    : index('employee_activity_employee_id_idx')
 .on(table.employee_activity_employee_id),
 organizationIdIndex: index('employee_activity_organization_id_idx')
 .on(table.employee_activity_organization_id),
 activityTypeIndex  : index('employee_activity_type_idx')
 .on(table.employee_activity_type),
 timestampIndex     : index('employee_activity_timestamp_idx')
 .on(table.employee_activity_timestamp),
 compositeIndex     : index('employee_activity_employee_timestamp_idx')
 .on(
 table.employee_activity_employee_id,
 table.employee_activity_timestamp
 ),
 }
 })
 
 export const SchemaInsertEmployeeActivity = createInsertSchema(
 employeesActivities)
 .extend({
 employee_activity_timestamp     : z.number().int().positive(),
 employee_activity_message       : z.string().min(1).max(500),
 employee_activity_latitude      : z.number()
 .min(-90)
 .max(90).optional(),
 employee_activity_longitude     : z.number()
 .min(-180)
 .max(180).optional(),
 employee_activity_address       : z.string()
 .max(200)
 .optional(),
 employee_activity_device        : z.string()
 .max(100)
 .optional(),
 employee_activity_ip_address    : z.ipv4().optional(),
 employee_activity_expense_amount: z.number()
 .positive()
 .optional()
 })
 
 export const SchemaEmployeeActivityData = SchemaInsertEmployeeActivity
 .omit({
 employee_activity_id             : true,
 employee_activity_employee_id    : true,
 employee_activity_organization_id: true,
 employee_activity_created_at     : true,
 employee_activity_updated_at     : true,
 employee_activity_status         : true
 });
 
 export const SchemaUpdateEmployeeActivity = createUpdateSchema(
 employeesActivities)
 .extend({
 employee_activity_timestamp     : z.number()
 .int()
 .positive()
 .optional(),
 employee_activity_message       : z.string()
 .min(1)
 .max(500)
 .optional(),
 employee_activity_latitude      : z.number()
 .min(-90)
 .max(90),
 employee_activity_longitude     : z.number()
 .min(-180)
 .max(180),
 employee_activity_address       : z.string()
 .max(200)
 .optional(),
 employee_activity_device        : z.string()
 .max(100)
 .optional(),
 employee_activity_ip_address    : z.ipv4().optional(),
 employee_activity_expense_amount: z.number()
 .positive()
 .optional()
 })
 .omit({
 employee_activity_id             : true,
 employee_activity_employee_id    : true,
 employee_activity_organization_id: true,
 employee_activity_created_at     : true
 });
 
 export const SchemaSelectEmployeeActivity = createSelectSchema(
 employeesActivities)
 .extend({
 employee_activity_timestamp     : z.number().int(),
 employee_activity_message       : z.string(),
 employee_activity_latitude      : z.number(),
 employee_activity_longitude     : z.number(),
 employee_activity_expense_amount: z.number().optional()
 });
 
 export type TEmployeeActivityInsert = z.infer<typeof SchemaInsertEmployeeActivity>
 export type TEmployeeActivityData = z.infer<typeof SchemaEmployeeActivityData>
 export type TEmployeeActivityUpdate = z.infer<typeof SchemaUpdateEmployeeActivity>
 export type TEmployeeActivitySelect = z.infer<typeof SchemaSelectEmployeeActivity>
 
 // ==========================
 // TABLE - EMPLOYEES_CREDENTIALS
 // ==========================
 
 export const employeesCredentials = pgTable('employees_credentials', {
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
 }, (table) => {
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
 })
 
 export const SchemaEmployeeCredentialsInsert = createInsertSchema(
 employeesCredentials)
 export const SchemaEmployeeCredentialsData   = SchemaEmployeeCredentialsInsert.omit(
 {
 employee_credential_id             : true,
 employee_credential_employee_id    : true,
 employee_credential_organization_id: true
 })
 export const SchemaEmployeeCredentialsUpdate = createUpdateSchema(
 employeesCredentials)
 .omit({
 employee_credential_id             : true,
 employee_credential_employee_id    : true,
 employee_credential_organization_id: true
 });
 export const SchemaEmployeeCredentialsSelect = createSelectSchema(
 employeesCredentials)
 
 export type TEmployeeCredentialsInsert = z.infer<typeof SchemaEmployeeCredentialsInsert>
 export type TEmployeeCredentialsData = z.infer<typeof SchemaEmployeeCredentialsData>
 export type TEmployeeCredentialsUpdate = z.infer<typeof SchemaEmployeeCredentialsUpdate>
 export type TEmployeeCredentialsSelect = z.infer<typeof SchemaEmployeeCredentialsSelect>
 
 // ==========================
 // TABLE - EMPLOYEES_SALARIES
 // ==========================
 
 export const employeesSalaries = pgTable(
 'employees_salaries', {
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
 }, // FIX: added entire constraints block — primaryKey and indexes were
 // missing entirely
 (table) => {
 return {
 pk                 : primaryKey(
 {
 name   : 'employees_salaries_pk',
 columns: [
 table.employee_salary_id,
 table.employee_salary_organization_id,
 table.employee_salary_employee_id
 ]
 }),
 salaryIdIndex      : index(
 'employee_salary_id_idx')
 .on(table.employee_salary_id),
 organizationIdIndex: index(
 'employee_salary_organization_id_fk_idx')
 .on(table.employee_salary_organization_id),
 employeeIdIndex    : index(
 'employee_salary_employee_id_fk_idx')
 .on(table.employee_salary_employee_id),
 }
 }
 )
 
 export const SchemaEmployeeSalaryInsert = createInsertSchema(employeesSalaries)
 export const SchemaEmployeeSalaryData   = SchemaEmployeeSalaryInsert.omit({
 employee_salary_id             : true,
 employee_salary_organization_id: true,
 employee_salary_employee_id    : true
 })
 export const SchemaEmployeeSalaryUpdate = createUpdateSchema(employeesSalaries)
 .omit({
 employee_salary_id             : true,
 employee_salary_organization_id: true,
 employee_salary_employee_id    : true
 });
 export const SchemaEmployeeSalarySelect = createSelectSchema(employeesSalaries)
 
 export type TEmployeeSalaryInsert = z.infer<typeof SchemaEmployeeSalaryInsert>
 export type TEmployeeSalaryData = z.infer<typeof SchemaEmployeeSalaryData>
 export type TEmployeeSalaryUpdate = z.infer<typeof SchemaEmployeeSalaryUpdate>
 export type TEmployeeSalarySelect = z.infer<typeof SchemaEmployeeSalarySelect>
 
 // ==========================
 // TABLE - SALES_GROUPS
 // ==========================
 
 export const salesGroups = pgTable('sales_groups', {
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
 }, (table) => {
 return {
 pk                 : primaryKey({
 name   : 'sales_group_primary_key',
 columns: [
 table.sales_group_id,
 table.sales_group_organization_id
 ],
 }),
 organizationIdIndex: index('sales_group_organization_id_fk_idx')
 .on(table.sales_group_organization_id,),
 nameIndex          : index('sales_group_name_unique_idx')
 .on(table.sales_group_name,),
 };
 },);
 
 export const SchemaSalesGroupInsert = createInsertSchema(salesGroups)
 export const SchemaSalesGroupData   = SchemaSalesGroupInsert.omit({
 sales_group_id             : true,
 sales_group_organization_id: true
 })
 export const SchemaSalesGroupUpdate = createUpdateSchema(salesGroups)
 .omit({
 sales_group_id             : true,
 sales_group_organization_id: true
 });
 export const SchemaSalesGroupSelect = createSelectSchema(salesGroups)
 
 export type TSalesGroupInsert = z.infer<typeof SchemaSalesGroupInsert>
 export type TSalesGroupData = z.infer<typeof SchemaSalesGroupData>
 export type TSalesGroupUpdate = z.infer<typeof SchemaSalesGroupUpdate>
 export type TSalesGroupSelect = z.infer<typeof SchemaSalesGroupSelect>
 
 // ==========================
 // TABLE - ITEMS
 // ==========================
 
 export const items = pgTable('items', {
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
 }, (table) => {
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
 .on(table.item_organization_id,),
 };
 },);
 
 export const SchemaItemInsert = createInsertSchema(items)
 export const SchemaItemData   = SchemaItemInsert.omit({
 item_id             : true,
 item_organization_id: true
 })
 export const SchemaItemUpdate = createUpdateSchema(items)
 .omit({
 item_id             : true,
 item_organization_id: true
 });
 export const SchemaItemSelect = createSelectSchema(items)
 
 export type TItemInsert = z.infer<typeof SchemaItemInsert>
 export type TItemData = z.infer<typeof SchemaItemData>
 export type TItemUpdate = z.infer<typeof SchemaItemUpdate>
 export type TItemSelect = z.infer<typeof SchemaItemSelect>
 
 // ==========================
 // TABLE - CLIENTS
 // ==========================
 
 export const clients = pgTable('clients', {
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
 client_account_status    : text('client_account_status', {
 enum: [
 'ACTIVE',
 'DEACTIVATED',
 'UNVERIFIED'
 ],
 })
 .notNull()
 .default(EAccountStatus.UNVERIFIED),
 client_registration_date : integer()
 .notNull(),
 }, (table) => {
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
 .on(table.client_organization_id,),
 stripeIdIndex      : index('client_stripe_customer_id_idx')
 .on(table.client_stripe_customer_id,),
 };
 },);
 
 export const SchemaClientInsert = createInsertSchema(clients)
 export const SchemaClientData   = SchemaClientInsert.omit({
 client_id             : true,
 client_organization_id: true
 })
 export const SchemaClientUpdate = createUpdateSchema(clients)
 .omit({
 client_id             : true,
 client_organization_id: true
 });
 export const SchemaClientSelect = createSelectSchema(clients)
 
 export type TClientInsert = z.infer<typeof SchemaClientInsert>
 export type TClientData = z.infer<typeof SchemaClientData>
 export type TClientUpdate = z.infer<typeof SchemaClientUpdate>
 export type TClientSelect = z.infer<typeof SchemaClientSelect>
 
 // ==========================
 // TABLE - CLIENTS_PAYMENTS
 // ==========================
 
 export const clientsPayments = pgTable('clients_payments', {
 client_payment_id             : text()
 .unique()
 .notNull(),
 client_payment_client_id      : text()
 .notNull()
 .references(() => clients.client_id),
 client_payment_organization_id: text()
 .notNull()
 .references(() => organizations.organization_id),
 client_payment_amount         : decimal('client_payment_amount', {
 mode: 'number',
 })
 .notNull(),
 client_payment_date           : integer()
 .notNull(),
 client_payment_status         : text('client_payment_status', {
 enum: [
 'PENDING',
 'PAID',
 'VERIFIED',
 'REFUNDED'
 ],
 })
 .notNull()
 .default(EPaymentStatus.PENDING),
 }, (table) => {
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
 .on(table.client_payment_id,),
 clientIdIndex       : index('client_payment_client_id_fk_idx')
 .on(table.client_payment_client_id,),
 organizationIdIndex : index('client_payment_organization_id_fk_idx')
 .on(table.client_payment_organization_id,),
 };
 },);
 
 export const SchemaClientPaymentInsert = createInsertSchema(clientsPayments)
 export const SchemaClientPaymentData   = SchemaClientPaymentInsert.omit({
 client_payment_id             : true,
 client_payment_client_id      : true,
 client_payment_organization_id: true
 })
 export const SchemaClientPaymentUpdate = createUpdateSchema(clientsPayments)
 .omit({
 client_payment_id             : true,
 client_payment_client_id      : true,
 client_payment_organization_id: true
 });
 export const SchemaClientPaymentSelect = createSelectSchema(clientsPayments)
 
 export type TClientPaymentInsert = z.infer<typeof SchemaClientPaymentInsert>
 export type TClientPaymentData = z.infer<typeof SchemaClientPaymentData>
 export type TClientPaymentUpdate = z.infer<typeof SchemaClientPaymentUpdate>
 export type TClientPaymentSelect = z.infer<typeof SchemaClientPaymentSelect>
 
 // ==========================
 // TABLE - SALES
 // ==========================
 
 export const sales = pgTable('sales', {
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
 }, (table) => {
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
 .on(table.sale_organization_id,),
 employeeIdIndex     : index('sale_employee_id_fk_idx')
 .on(table.sale_employee_id,),
 clientIdIndex       : index('sale_client_id_fk_idx')
 .on(table.sale_client_id),
 clientPaymentIdIndex: index('sale_client_payment_id_fk_idx')
 .on(table.sale_client_payment_id,),
 itemIdIndex         : index('sale_item_id_fk_idx')
 .on(table.sale_item_id),
 };
 },);
 
 export const SchemaSaleInsert = createInsertSchema(sales)
 export const SchemaSaleData   = SchemaSaleInsert.omit({
 sale_id             : true,
 sale_organization_id: true,
 sale_employee_id    : true,
 })
 export const SchemaSaleUpdate = createUpdateSchema(sales)
 .omit({
 sale_id               : true,
 sale_organization_id  : true,
 sale_employee_id      : true,
 sale_client_id        : true,
 sale_client_payment_id: true,
 sale_item_id          : true
 });
 export const SchemaSaleSelect = createSelectSchema(sales)
 
 export type TSaleInsert = z.infer<typeof SchemaSaleInsert>
 export type TSaleData = z.infer<typeof SchemaSaleData>
 export type TSaleUpdate = z.infer<typeof SchemaSaleUpdate>
 export type TSaleSelect = z.infer<typeof SchemaSaleSelect>
 
 // ==========================
 // TABLE - ORGANIZATIONS_PAYMENTS
 // ==========================
 
 export const organizationsPayments = pgTable('organizations_payments', {
 organization_payment_id             : text()
 .unique()
 .notNull(),
 organization_payment_organization_id: text()
 .notNull()
 .references(() => organizations.organization_id),
 organization_payment_amount         : decimal(
 'payment_amount',
 { mode: 'number' }
 )
 .notNull(),
 organization_payment_status         : text('payment_status', {
 enum: [
 'PENDING',
 'PAID',
 'VERIFIED',
 'REFUNDED'
 ],
 })
 .default(EPaymentStatus.VERIFIED)
 .notNull(),
 organization_payment_timestamp      : integer()
 .notNull(),
 }, (table) => {
 return {
 pk                 : primaryKey({
 name   : 'organization_payments_primary_key',
 columns: [
 table.organization_payment_id,
 table.organization_payment_organization_id
 ],
 }),
 paymentIdIndex     : index('organization_payment_id_idx')
 .on(table.organization_payment_id),
 organizationIdIndex: index('organization_payment_organization_id_fk_idx',)
 .on(table.organization_payment_organization_id),
 };
 },);
 
 export const SchemaOrganizationPaymentInsert = createInsertSchema(
 organizationsPayments)
 export const SchemaOrganizationPaymentData   = SchemaOrganizationPaymentInsert.omit(
 {
 organization_payment_id             : true,
 organization_payment_organization_id: true
 })
 export const SchemaOrganizationPaymentUpdate = createUpdateSchema(
 organizationsPayments)
 .omit({
 organization_payment_id             : true,
 organization_payment_organization_id: true
 });
 export const SchemaOrganizationPaymentSelect = createSelectSchema(
 organizationsPayments)
 
 export type TOrganizationPaymentInsert = z.infer<typeof SchemaOrganizationPaymentInsert>
 export type TOrganizationPaymentData = z.infer<typeof SchemaOrganizationPaymentData>
 export type TOrganizationPaymentUpdate = z.infer<typeof SchemaOrganizationPaymentUpdate>
 export type TOrganizationPaymentSelect = z.infer<typeof SchemaOrganizationPaymentSelect>
 
 // --- RELATIONS ---
 export const organizationsRelations = relations(organizations, ({ many }) => {
 return {
 employees            : many(employees),
 employeesCredentials : many(employeesCredentials),
 employeesLeaves      : many(employeeAttendances),
 employeesSalaries    : many(employeesSalaries),
 items                : many(items),
 salesGroups          : many(salesGroups),
 organizationsPayments: many(organizationsPayments),
 sales                : many(sales),
 clients              : many(clients),
 clientsPayments      : many(clientsPayments),
 };
 });
 
 export const employeesRelations = relations(employees, ({
 one,
 many
 }) => {
 return {
 organization      : one(organizations, {
 fields    : [ employees.employee_organization_id ],
 references: [ organizations.organization_id ],
 }),
 employeeCredential: one(employeesCredentials, {
 fields    : [ employees.employee_id ],
 references: [ employeesCredentials.employee_credential_employee_id ]
 }),
 employeeLeave     : one(employeeAttendances, {
 fields    : [ employees.employee_id ],
 references: [ employeeAttendances.employee_attendance_employee_id ]
 }),
 employeeSalary    : one(employeesSalaries, {
 fields    : [ employees.employee_id ],
 references: [ employeesSalaries.employee_salary_employee_id ]
 }),
 salesGroup        : one(salesGroups, {
 fields    : [ employees.employee_sales_group_id ],
 references: [ salesGroups.sales_group_id ],
 }),
 sales             : many(sales),
 };
 });
 
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
 employeeAttendances,
 ({ one }) => {
 return {
 employee    : one(
 employees,
 {
 fields    : [ employeeAttendances.employee_attendance_employee_id ],
 references: [ employees.employee_id ]
 }
 ),
 organization: one(
 organizations,
 {
 fields    : [ employeeAttendances.employee_attendance_organization_id ],
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
 organization: one(organizations,
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
 
 export const itemsRelations = relations(items, ({
 one,
 many
 }) => {
 return {
 organization: one(organizations, {
 fields    : [ items.item_organization_id ],
 references: [ organizations.organization_id ],
 }),
 sales       : many(sales),
 };
 });
 
 export const salesGroupsRelations = relations(salesGroups, ({
 one,
 many
 }) => {
 return {
 organization: one(organizations, {
 fields    : [ salesGroups.sales_group_organization_id ],
 references: [ organizations.organization_id ],
 }),
 employees   : many(employees),
 };
 });
 
 export const salesRelations = relations(sales, ({ one }) => {
 return {
 item         : one(items, {
 fields    : [ sales.sale_item_id ],
 references: [ items.item_id ],
 }),
 employee     : one(employees, {
 fields    : [ sales.sale_employee_id ],
 references: [ employees.employee_id ],
 }),
 organization : one(organizations, {
 fields    : [ sales.sale_organization_id ],
 references: [ organizations.organization_id ],
 }),
 client       : one(clients, {
 fields    : [ sales.sale_client_id ],
 references: [ clients.client_id ],
 }),
 clientPayment: one(clientsPayments, {
 fields    : [ sales.sale_client_payment_id ],
 references: [ clientsPayments.client_payment_id ],
 }),
 };
 });
 
 export const clientsRelations = relations(clients, ({
 one,
 many
 }) => {
 return {
 organization: one(organizations, {
 fields    : [ clients.client_organization_id ],
 references: [ organizations.organization_id ],
 }),
 payments    : many(clientsPayments),
 sales       : many(sales),
 };
 });
 
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
 
 */
