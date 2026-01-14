import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const organizations = sqliteTable(
  'organizations',
  {
    organization_id: text().unique().notNull(),
    organization_admin_id: text().unique().notNull(),
    organization_stripe_customer_id: text().unique().notNull(),
    organization_name: text().unique().notNull(),
    organization_admin_email: text().unique().notNull(),
    organization_admin_phone: text().unique().notNull(),
    organization_logo_url: text().unique().notNull(),
    organization_registration_date: integer().notNull(),
    organization_subscription_end_date: integer().notNull(),
    organization_status: text({
      enum: ['ACTIVE', 'DEACTIVATED', 'TRIAL', 'SUSPENDED'],
    })
      .default('ACTIVE')
      .notNull(),
    organization_subscription_status: text({ enum: ['VALID', 'EXPIRED'] })
      .default('VALID')
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'organization_primary_key',
        columns: [table.organization_id, table.organization_stripe_customer_id],
      }),
      organizationIdIndex: index('organization_id_idx').on(
        table.organization_id,
      ),
      stripeIdIndex: index('organization_stripe_customer_id_idx').on(
        table.organization_stripe_customer_id,
      ),
    };
  },
);

export const employees = sqliteTable(
  'employees',
  {
    // FIX: Added .unique()
    employee_id: text().unique().notNull(),
    employee_organization_id: text()
      .notNull()
      .references(() => organizations.organization_id),
    employee_sales_group_id: text().references(
      () => salesGroups.sales_group_id,
    ),
    employee_username: text().notNull(),
    employee_phone: text().notNull(),
    employee_nic_number: text().notNull().unique(),
    employee_registration_date: integer().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'employee_primary_key',
        columns: [table.employee_id, table.employee_organization_id],
      }),
      employeeIdIndex: index('employee_id_idx').on(table.employee_id),
      organizationIdIndex: index('employee_organization_id_fk_idx').on(
        table.employee_organization_id,
      ),
      salesGroupIdIndex: index('employee_sales_group_id_fk_idx').on(
        table.employee_sales_group_id,
      ),
      nicIndex: index('employee_nic_number_unique_idx').on(
        table.employee_nic_number,
      ),
    };
  },
);

export const salesGroups = sqliteTable(
  'sales_groups',
  {
    // FIX: Added .unique()
    sales_group_id: text().unique().notNull(),
    sales_group_organization_id: text()
      .notNull()
      .references(() => organizations.organization_id),
    sales_group_name: text().unique().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'sales_group_primary_key',
        columns: [table.sales_group_id, table.sales_group_organization_id],
      }),
      organizationIdIndex: index('sales_group_organization_id_fk_idx').on(
        table.sales_group_organization_id,
      ),
      nameIndex: index('sales_group_name_unique_idx').on(
        table.sales_group_name,
      ),
    };
  },
);

export const items = sqliteTable(
  'items',
  {
    // FIX: Added .unique()
    item_id: text().unique().notNull(),
    item_organization_id: text()
      .notNull()
      .references(() => organizations.organization_id),
    item_name: text().notNull(),
    item_stock_unit_count: integer().default(0),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'items_primary_key',
        columns: [table.item_id, table.item_organization_id],
      }),
      itemIdIndex: index('item_id_idx').on(table.item_id),
      organizationIdIndex: index('item_organization_id_fk_idx').on(
        table.item_organization_id,
      ),
    };
  },
);

export const sales = sqliteTable(
  'sales',
  {
    // FIX: Added .unique()
    sale_id: text().unique().notNull(),
    sale_organization_id: text()
      .notNull()
      .references(() => organizations.organization_id),
    sale_employee_id: text()
      .notNull()
      .references(() => employees.employee_id),
    sale_client_id: text()
      .notNull()
      .references(() => clients.client_id),
    sale_client_payment_id: text()
      .notNull()
      .references(() => clientsPayments.client_payment_id),
    sale_item_id: text()
      .notNull()
      .references(() => items.item_id),
    sale_item_unit_count: integer().notNull().default(1),
    sale_date: integer().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'sales_primary_key',
        columns: [
          table.sale_id,
          table.sale_organization_id,
          table.sale_employee_id,
          table.sale_client_id,
          table.sale_client_payment_id,
          table.sale_item_id,
        ],
      }),
      saleIdIndex: index('sale_id_idx').on(table.sale_id),
      organizationIdIndex: index('sale_organization_id_fk_idx').on(
        table.sale_organization_id,
      ),
      employeeIdIndex: index('sale_employee_id_fk_idx').on(
        table.sale_employee_id,
      ),
      clientIdIndex: index('sale_client_id_fk_idx').on(table.sale_client_id),
      clientPaymentIdIndex: index('sale_client_payment_id_fk_idx').on(
        table.sale_client_payment_id,
      ),
      itemIdIndex: index('sale_item_id_fk_idx').on(table.sale_item_id),
    };
  },
);

export const organizationsPayments = sqliteTable(
  'organizations_payments',
  {
    // FIX: Added .unique()
    payment_id: text().unique().notNull(),
    payment_organization_id: text()
      .notNull()
      .references(() => organizations.organization_id),
    payment_amount: real().notNull(),
    payment_status: text({ enum: ['PENDING', 'PAID', 'VERIFIED'] }).default(
      'VERIFIED',
    ),
    payment_date: integer().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'organization_payments_primary_key',
        columns: [table.payment_id, table.payment_organization_id],
      }),
      paymentIdIndex: index('organization_payment_id_idx').on(table.payment_id),
      organizationIdIndex: index(
        'organization_payment_organization_id_fk_idx',
      ).on(table.payment_organization_id),
    };
  },
);

export const clients = sqliteTable(
  'clients',
  {
    // FIX: Added .unique()
    client_id: text().unique().notNull(),
    client_organization_id: text()
      .notNull()
      .references(() => organizations.organization_id),
    client_stripe_customer_id: text().notNull(),
    client_name: text().notNull(),
    client_nic_number: text().notNull(),
    client_email: text().notNull(),
    client_phone: text().notNull(),
    client_account_status: text({
      enum: ['ACTIVE', 'DEACTIVATED', 'UNVERIFIED'],
    })
      .notNull()
      .default('UNVERIFIED'),
    client_registration_date: integer().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'clients_primary_key',
        columns: [
          table.client_id,
          table.client_organization_id,
          table.client_stripe_customer_id,
        ],
      }),
      organizationIdIndex: index('client_organization_id_fk_idx').on(
        table.client_organization_id,
      ),
      stripeIdIndex: index('client_stripe_customer_id_idx').on(
        table.client_stripe_customer_id,
      ),
    };
  },
);

export const clientsPayments = sqliteTable(
  'client_payments',
  {
    // FIX: Added .unique()
    client_payment_id: text().unique().notNull(),
    client_payment_client_id: text()
      .notNull()
      .references(() => clients.client_id),
    client_payment_organization_id: text()
      .notNull()
      .references(() => organizations.organization_id),
    client_payment_amount: real().notNull(),
    client_payment_date: integer().notNull(),
    client_payment_status: text({ enum: ['PENDING', 'PAID', 'VERIFIED'] })
      .notNull()
      .default('VERIFIED'),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'clients_payments_primary_key',
        columns: [
          table.client_payment_id,
          table.client_payment_client_id,
          table.client_payment_organization_id,
        ],
      }),
      clientPaymentIdIndex: index('client_payment_id_idx').on(
        table.client_payment_id,
      ),
      clientIdIndex: index('client_payment_client_id_fk_idx').on(
        table.client_payment_client_id,
      ),
      organizationIdIndex: index('client_payment_organization_id_fk_idx').on(
        table.client_payment_organization_id,
      ),
    };
  },
);

// --- RELATIONS ---

export const organizationsRelations = relations(organizations, ({ many }) => {
  return {
    employees: many(employees),
    items: many(items),
    salesGroups: many(salesGroups),
    payments: many(organizationsPayments),
    sales: many(sales),
    clients: many(clients),
    clientsPayments: many(clientsPayments),
  };
});

export const employeesRelations = relations(employees, ({ one, many }) => {
  return {
    organization: one(organizations, {
      fields: [employees.employee_organization_id],
      references: [organizations.organization_id],
    }),
    salesGroup: one(salesGroups, {
      fields: [employees.employee_sales_group_id],
      references: [salesGroups.sales_group_id],
    }),
    sales: many(sales),
  };
});

export const itemsRelations = relations(items, ({ one, many }) => {
  return {
    organization: one(organizations, {
      fields: [items.item_organization_id],
      references: [organizations.organization_id],
    }),
    sales: many(sales),
  };
});

export const salesGroupsRelations = relations(salesGroups, ({ one, many }) => {
  return {
    organization: one(organizations, {
      fields: [salesGroups.sales_group_organization_id],
      references: [organizations.organization_id],
    }),
    employees: many(employees),
  };
});

export const salesRelations = relations(sales, ({ one, many }) => {
  return {
    item: one(items, {
      fields: [sales.sale_item_id],
      references: [items.item_id],
    }),
    employee: one(employees, {
      fields: [sales.sale_employee_id],
      references: [employees.employee_id],
    }),
    organization: one(organizations, {
      fields: [sales.sale_organization_id],
      references: [organizations.organization_id],
    }),
    client: one(clients, {
      fields: [sales.sale_client_id],
      references: [clients.client_id],
    }),
    clientPayment: one(clientsPayments, {
      fields: [sales.sale_client_payment_id],
      references: [clientsPayments.client_payment_id],
    }),
  };
});

export const clientsRelations = relations(clients, ({ one, many }) => {
  return {
    organization: one(organizations, {
      fields: [clients.client_organization_id],
      references: [organizations.organization_id],
    }),
    payments: many(clientsPayments),
    sales: many(sales),
  };
});

export const clientsPaymentsRelations = relations(
  clientsPayments,
  ({ one, many }) => {
    return {
      client: one(clients, {
        fields: [clientsPayments.client_payment_client_id],
        references: [clients.client_id],
      }),
      organization: one(organizations, {
        fields: [clientsPayments.client_payment_organization_id],
        references: [organizations.organization_id],
      }),
    };
  },
);

export type TSQLiteOrganization = typeof organizations.$inferInsert;
export type TSQLiteEmployee = typeof employees.$inferInsert;
export type TSQLiteItem = typeof items.$inferInsert;
export type TSQLiteSalesGroup = typeof salesGroups.$inferInsert;
export type TSQLiteSale = typeof sales.$inferInsert;
export type TSQLiteClient = typeof clients.$inferInsert;
export type TSQLiteClientPayment = typeof clientsPayments.$inferInsert;
export type TSQLiteOrganizationPayment =
  typeof organizationsPayments.$inferInsert;
