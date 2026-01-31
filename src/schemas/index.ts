import { z } from 'zod';

// --- ENUMS ---
export const OrganizationStatusEnum = z.enum([
                                                 'ACTIVE',
                                                 'DEACTIVATED',
                                                 'TRIAL',
                                                 'SUSPENDED',
                                             ]);

export const OrganizationSubscriptionStatusEnum = z.enum([
                                                             'VALID',
                                                             'EXPIRED',
                                                         ]);

export const PaymentStatusEnum = z.enum([
                                            'PENDING',
                                            'PAID',
                                            'VERIFIED',
                                            'REFUNDED',
                                        ]);

export const ClientAccountStatusEnum = z.enum([
                                                  'ACTIVE',
                                                  'DEACTIVATED',
                                                  'UNVERIFIED',
                                              ]);

// --- ORGANIZATIONS ---
export const OrganizationSchema = z.object({
                                               organization_id                   : z.string()
                                                                                    .min(
                                                                                        1),
                                               organization_admin_id             : z.string()
                                                                                    .min(
                                                                                        1),
                                               organization_stripe_customer_id   : z.string()
                                                                                    .min(
                                                                                        1),
                                               organization_name                 : z.string()
                                                                                    .min(
                                                                                        1),
                                               organization_admin_email          : z.string()
                                                                                    .email(),
                                               organization_admin_phone          : z.string()
                                                                                    .min(
                                                                                        1),
                                               organization_logo_url             : z.string()
                                                                                    .url(),
                                               organization_registration_date    : z.number()
                                                                                    .int()
                                                                                    .positive(),
                                               organization_subscription_end_date: z.number()
                                                                                    .int()
                                                                                    .positive(),
                                               organization_status               : OrganizationStatusEnum.default(
                                                   'ACTIVE'),
                                               organization_subscription_status  : OrganizationSubscriptionStatusEnum.default(
                                                   'VALID'),
                                           });

export const OrganizationInsertSchema = OrganizationSchema;

export const OrganizationUpdateSchema = OrganizationSchema.partial();

// --- EMPLOYEES ---
export const EmployeeSchema = z.object({
                                           employee_id               : z.string()
                                                                        .min(1),
                                           employee_organization_id  : z.string()
                                                                        .min(1),
                                           employee_sales_group_id   : z.string()
                                                                        .min(1)
                                                                        .nullable()
                                                                        .optional(),
                                           employee_first_name       : z.string()
                                                                        .nullable()
                                                                        .optional(),
                                           employee_last_name        : z.string()
                                                                        .nullable()
                                                                        .optional(),
                                           employee_phone            : z.string()
                                                                        .nullable()
                                                                        .optional(),
                                           employee_nic_number       : z.string()
                                                                        .min(1),
                                           employee_active_territory : z.string()
                                                                        .nullable()
                                                                        .optional(),
                                           employee_registration_date: z.number()
                                                                        .int()
                                                                        .positive(),
                                       });

export const EmployeeInsertSchema = EmployeeSchema;

export const EmployeeUpdateSchema = EmployeeSchema.partial().omit({
                                                                      employee_id             : true,
                                                                      employee_organization_id: true,
                                                                  });

// --- EMPLOYEES LEAVES ---
export const EmployeesLeavesSchema = z.object({
                                                  employees_leaves_id             : z.string()
                                                                                     .min(
                                                                                         1),
                                                  employees_leaves_employee_id    : z.string()
                                                                                     .min(
                                                                                         1),
                                                  employees_leaves_organization_id: z.string()
                                                                                     .min(
                                                                                         1),
                                                  employees_leaves_taken          : z.number()
                                                                                     .int()
                                                                                     .nonnegative()
                                                                                     .default(
                                                                                         0),
                                                  employees_leaves_total          : z.number()
                                                                                     .int()
                                                                                     .positive()
                                                                                     .default(
                                                                                         3),
                                              });

export const EmployeesLeavesInsertSchema = EmployeesLeavesSchema;

export const EmployeesLeavesUpdateSchema = EmployeesLeavesSchema.partial().omit(
    {
        employees_leaves_id             : true,
        employees_leaves_employee_id    : true,
        employees_leaves_organization_id: true,
    });

// --- EMPLOYEES CREDENTIALS ---
export const EmployeesCredentialsSchema = z.object({
                                                       employees_credentials_id             : z.string()
                                                                                               .min(
                                                                                                   1),
                                                       employees_credentials_employee_id    : z.string()
                                                                                               .min(
                                                                                                   1),
                                                       employees_credentials_organization_id: z.string()
                                                                                               .min(
                                                                                                   1),
                                                       employees_credentials_username       : z.string()
                                                                                               .min(
                                                                                                   3),
                                                       employees_credentials_password       : z.string()
                                                                                               .min(
                                                                                                   8),
                                                   });

export const EmployeesCredentialsInsertSchema = EmployeesCredentialsSchema;

export const EmployeesCredentialsUpdateSchema = EmployeesCredentialsSchema.partial()
                                                                          .omit(
                                                                              {
                                                                                  employees_credentials_id             : true,
                                                                                  employees_credentials_employee_id    : true,
                                                                                  employees_credentials_organization_id: true,
                                                                              });

// --- SALES GROUPS ---
export const SalesGroupSchema = z.object({
                                             sales_group_id             : z.string()
                                                                           .min(
                                                                               1),
                                             sales_group_organization_id: z.string()
                                                                           .min(
                                                                               1),
                                             sales_group_name           : z.string()
                                                                           .min(
                                                                               1),
                                             sales_group_territory      : z.string()
                                                                           .min(
                                                                               1),
                                         });

export const SalesGroupInsertSchema = SalesGroupSchema;

export const SalesGroupUpdateSchema = SalesGroupSchema.partial().omit({
                                                                          sales_group_id             : true,
                                                                          sales_group_organization_id: true,
                                                                      });

// --- ITEMS ---
export const ItemSchema = z.object({
                                       item_id              : z.string().min(1),
                                       item_organization_id : z.string().min(1),
                                       item_name            : z.string().min(1),
                                       item_stock_unit_count: z.number()
                                                               .int()
                                                               .nonnegative()
                                                               .default(0),
                                   });

export const ItemInsertSchema = ItemSchema;

export const ItemUpdateSchema = ItemSchema.partial().omit({
                                                              item_id             : true,
                                                              item_organization_id: true,
                                                          });

// --- SALES ---
export const SaleSchema = z.object({
                                       sale_id               : z.string()
                                                                .min(1),
                                       sale_organization_id  : z.string()
                                                                .min(1),
                                       sale_employee_id      : z.string()
                                                                .min(1),
                                       sale_client_id        : z.string()
                                                                .min(1),
                                       sale_client_payment_id: z.string()
                                                                .min(1),
                                       sale_item_id          : z.string()
                                                                .min(1),
                                       sale_item_unit_count  : z.number()
                                                                .int()
                                                                .positive()
                                                                .default(1),
                                       sale_date             : z.number()
                                                                .int()
                                                                .positive(),
                                   });

export const SaleInsertSchema = SaleSchema;

export const SaleUpdateSchema = SaleSchema.partial().omit({
                                                              sale_id             : true,
                                                              sale_organization_id: true,
                                                          });

// --- ORGANIZATION PAYMENTS ---
export const OrganizationPaymentSchema = z.object({
                                                      payment_id             : z.string()
                                                                                .min(
                                                                                    1),
                                                      payment_organization_id: z.string()
                                                                                .min(
                                                                                    1),
                                                      payment_amount         : z.number()
                                                                                .positive(),
                                                      payment_status         : PaymentStatusEnum.default(
                                                          'VERIFIED'),
                                                      payment_timestamp      : z.number()
                                                                                .int()
                                                                                .positive(),
                                                  });

export const OrganizationPaymentInsertSchema = OrganizationPaymentSchema;

export const OrganizationPaymentUpdateSchema = OrganizationPaymentSchema.partial()
                                                                        .omit({
                                                                                  payment_id             : true,
                                                                                  payment_organization_id: true,
                                                                              });

// --- CLIENTS ---
export const ClientSchema = z.object({
                                         client_id                : z.string()
                                                                     .min(1),
                                         client_organization_id   : z.string()
                                                                     .min(1),
                                         client_stripe_customer_id: z.string()
                                                                     .min(1),
                                         client_name              : z.string()
                                                                     .min(1),
                                         client_nic_number        : z.string()
                                                                     .min(1),
                                         client_email             : z.email(),
                                         client_phone             : z.string()
                                                                     .min(1),
                                         client_account_status    : ClientAccountStatusEnum.default(
                                             'UNVERIFIED'),
                                         client_registration_date : z.number()
                                                                     .int()
                                                                     .positive(),
                                     });

export const ClientInsertSchema = ClientSchema;

export const ClientUpdateSchema = ClientSchema.partial().omit({
                                                                  client_id             : true,
                                                                  client_organization_id: true,
                                                              });

// --- CLIENT PAYMENTS ---
export const ClientPaymentSchema = z.object({
                                                client_payment_id             : z.string()
                                                                                 .min(
                                                                                     1),
                                                client_payment_client_id      : z.string()
                                                                                 .min(
                                                                                     1),
                                                client_payment_organization_id: z.string()
                                                                                 .min(
                                                                                     1),
                                                client_payment_amount         : z.number()
                                                                                 .positive(),
                                                client_payment_date           : z.number()
                                                                                 .int()
                                                                                 .positive(),
                                                client_payment_status         : PaymentStatusEnum.default(
                                                    'VERIFIED'),
                                            });

export const ClientPaymentInsertSchema = ClientPaymentSchema;

export const ClientPaymentUpdateSchema = ClientPaymentSchema.partial().omit({
                                                                                client_payment_id             : true,
                                                                                client_payment_client_id      : true,
                                                                                client_payment_organization_id: true,
                                                                            });

// --- TYPE EXPORTS ---
export type TOrganization = z.infer<typeof OrganizationSchema>;
export type TOrganizationInsert = z.infer<typeof OrganizationInsertSchema>;
export type TOrganizationUpdate = z.infer<typeof OrganizationUpdateSchema>;

export type TEmployee = z.infer<typeof EmployeeSchema>;
export type TEmployeeInsert = z.infer<typeof EmployeeInsertSchema>;
export type TEmployeeUpdate = z.infer<typeof EmployeeUpdateSchema>;

export type TEmployeesLeaves = z.infer<typeof EmployeesLeavesSchema>;
export type TEmployeesLeavesInsert = z.infer<typeof EmployeesLeavesInsertSchema>;
export type TEmployeesLeavesUpdate = z.infer<typeof EmployeesLeavesUpdateSchema>;

export type TEmployeesCredentials = z.infer<typeof EmployeesCredentialsSchema>;
export type TEmployeesCredentialsInsert = z.infer<typeof EmployeesCredentialsInsertSchema>;
export type TEmployeesCredentialsUpdate = z.infer<typeof EmployeesCredentialsUpdateSchema>;

export type TSalesGroup = z.infer<typeof SalesGroupSchema>;
export type TSalesGroupInsert = z.infer<typeof SalesGroupInsertSchema>;
export type TSalesGroupUpdate = z.infer<typeof SalesGroupUpdateSchema>;

export type TItem = z.infer<typeof ItemSchema>;
export type TItemInsert = z.infer<typeof ItemInsertSchema>;
export type TItemUpdate = z.infer<typeof ItemUpdateSchema>;

export type TSale = z.infer<typeof SaleSchema>;
export type TSaleInsert = z.infer<typeof SaleInsertSchema>;
export type TSaleUpdate = z.infer<typeof SaleUpdateSchema>;

export type TOrganizationPayment = z.infer<typeof OrganizationPaymentSchema>;
export type TOrganizationPaymentInsert = z.infer<typeof OrganizationPaymentInsertSchema>;
export type TOrganizationPaymentUpdate = z.infer<typeof OrganizationPaymentUpdateSchema>;

export type TClient = z.infer<typeof ClientSchema>;
export type TClientInsert = z.infer<typeof ClientInsertSchema>;
export type TClientUpdate = z.infer<typeof ClientUpdateSchema>;

export type TClientPayment = z.infer<typeof ClientPaymentSchema>;
export type TClientPaymentInsert = z.infer<typeof ClientPaymentInsertSchema>;
export type TClientPaymentUpdate = z.infer<typeof ClientPaymentUpdateSchema>;