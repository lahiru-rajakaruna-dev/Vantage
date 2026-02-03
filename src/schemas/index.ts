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

export const EmployeeStatus = z.enum([
                                         'ON_FIELD',
                                         'ON_LEAVE',
                                         'SUSPENDED',
                                         'FIRED',
                                         'NOT_REPORTED'
                                     ])

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
                                           employee_status           : EmployeeStatus.default(
                                               'NOT_REPORTED'),
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
                                         client_email             : z.string()
                                                                     .email(),
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

// --- REQUEST VALIDATION SCHEMAS ---

// Organization Requests
export const CreateOrganizationRequestSchema = OrganizationSchema.pick({
                                                                           organization_name       : true,
                                                                           organization_admin_email: true,
                                                                           organization_admin_phone: true,
                                                                           organization_logo_url   : true,
                                                                       })
                                                                 .extend({
                                                                             organization_logo_url          : z.url(),
                                                                             organization_stripe_customer_id: z.string()
                                                                                                               .min(
                                                                                                                   1)
                                                                                                               .optional(),
                                                                         });

export const UpdateOrganizationRequestSchema = OrganizationSchema.pick({
                                                                           organization_name                 : true,
                                                                           organization_admin_email          : true,
                                                                           organization_admin_phone          : true,
                                                                           organization_logo_url             : true,
                                                                           organization_status               : true,
                                                                           organization_subscription_status  : true,
                                                                           organization_subscription_end_date: true,
                                                                       })
                                                                 .partial();

export const GetOrganizationByIdRequestSchema = OrganizationSchema.pick({
                                                                            organization_id: true,
                                                                        });

// Employee Requests
export const CreateEmployeeRequestSchema = EmployeeSchema.pick({
                                                                   employee_first_name      : true,
                                                                   employee_last_name       : true,
                                                                   employee_phone           : true,
                                                                   employee_nic_number      : true,
                                                                   employee_sales_group_id  : true,
                                                                   employee_active_territory: true,
                                                               }).extend({
                                                                             employee_first_name      : EmployeeSchema.shape.employee_first_name.optional(),
                                                                             employee_last_name       : EmployeeSchema.shape.employee_last_name.optional(),
                                                                             employee_phone           : EmployeeSchema.shape.employee_phone.optional(),
                                                                             employee_sales_group_id  : EmployeeSchema.shape.employee_sales_group_id.optional(),
                                                                             employee_active_territory: EmployeeSchema.shape.employee_active_territory.optional(),
                                                                         });

export const UpdateEmployeeRequestSchema = EmployeeSchema.pick({
                                                                   employee_first_name      : true,
                                                                   employee_last_name       : true,
                                                                   employee_phone           : true,
                                                                   employee_sales_group_id  : true,
                                                                   employee_active_territory: true,
                                                                   employee_nic_number      : true
                                                               }).partial();

export const GetEmployeeByIdRequestSchema = EmployeeSchema.pick({
                                                                    employee_id: true,
                                                                });

export const DeleteEmployeeRequestSchema = z.object({
                                                        organization_id: z.string()
                                                                          .min(1),
                                                        employee_id    : z.string()
                                                                          .min(1),
                                                    });

// Employee Leaves Requests
export const CreateEmployeesLeavesRequestSchema = EmployeesLeavesSchema.pick({
                                                                                 employees_leaves_employee_id: true,
                                                                                 employees_leaves_taken      : true,
                                                                                 employees_leaves_total      : true,
                                                                             });

export const UpdateEmployeesLeavesRequestSchema = EmployeesLeavesSchema.pick({
                                                                                 employees_leaves_taken: true,
                                                                                 employees_leaves_total: true,
                                                                             })
                                                                       .partial();

// Employee Credentials Requests
export const CreateEmployeesCredentialsRequestSchema = EmployeesCredentialsSchema.pick(
    {
        employees_credentials_username: true,
        employees_credentials_password: true,
    });

export const UpdateEmployeesCredentialsRequestSchema = EmployeesCredentialsSchema.pick(
    {
        employees_credentials_username: true,
        employees_credentials_password: true,
    }).partial();

export const LoginRequestSchema = z.object({
                                               username: z.string().min(3),
                                               password: z.string().min(8),
                                           });

// Sales Group Requests
export const CreateSalesGroupRequestSchema = SalesGroupSchema.pick({
                                                                       sales_group_name     : true,
                                                                       sales_group_territory: true,
                                                                   });

export const UpdateSalesGroupRequestSchema = SalesGroupSchema.pick({
                                                                       sales_group_name     : true,
                                                                       sales_group_territory: true,
                                                                   }).partial();

export const GetSalesGroupByIdRequestSchema = z.object({
                                                           organization_id: z.string()
                                                                             .min(
                                                                                 1),
                                                           sales_group_id : z.string()
                                                                             .min(
                                                                                 1),
                                                       });

export const DeleteSalesGroupRequestSchema = z.object({
                                                          organization_id: z.string()
                                                                            .min(
                                                                                1),
                                                          sales_group_id : z.string()
                                                                            .min(
                                                                                1),
                                                      });

// Item Requests
export const CreateItemRequestSchema = ItemSchema.pick({
                                                           item_name            : true,
                                                           item_stock_unit_count: true,
                                                       });

export const UpdateItemRequestSchema = ItemSchema.pick({
                                                           item_name            : true,
                                                           item_stock_unit_count: true,
                                                       }).partial();

export const GetItemByIdRequestSchema = ItemSchema.pick({
                                                            item_id: true,
                                                        });

export const DeleteItemRequestSchema = z.object({
                                                    organization_id: z.string()
                                                                      .min(1),
                                                    item_id        : z.string()
                                                                      .min(1),
                                                });

// Sale Requests
export const CreateSaleRequestSchema = SaleSchema.pick({
                                                           sale_employee_id      : true,
                                                           sale_client_id        : true,
                                                           sale_client_payment_id: true,
                                                           sale_item_id          : true,
                                                           sale_item_unit_count  : true,
                                                       }).extend({
                                                                     sale_date: SaleSchema.shape.sale_date.optional(),
                                                                 });

export const UpdateSaleRequestSchema = SaleSchema.pick({
                                                           sale_employee_id      : true,
                                                           sale_client_id        : true,
                                                           sale_client_payment_id: true,
                                                           sale_item_id          : true,
                                                           sale_item_unit_count  : true,
                                                           sale_date             : true,
                                                       }).partial();

export const GetSaleByIdRequestSchema = SaleSchema.pick({
                                                            sale_id: true,
                                                        });

export const GetSalesByDateRequestSchema = z.object({
                                                        organization_id: z.string()
                                                                          .min(1),
                                                        date           : z.number()
                                                                          .int()
                                                                          .positive(),
                                                    });

export const GetSalesWithinDatesRequestSchema = z.object({
                                                             organization_id: z.string()
                                                                               .min(
                                                                                   1),
                                                             date_start     : z.number()
                                                                               .int()
                                                                               .positive(),
                                                             date_end       : z.number()
                                                                               .int()
                                                                               .positive(),
                                                         })
                                                 .refine(
                                                     (data) => data.date_start <=
                                                               data.date_end,
                                                     {
                                                         message: 'date_start must be less than or equal to date_end',
                                                         path   : [ 'date_start' ],
                                                     }
                                                 );

// Organization Payment Requests
export const CreateOrganizationPaymentRequestSchema = OrganizationPaymentSchema.pick(
    {
        payment_amount: true,
        payment_status: true,
    }).extend({
                  payment_status   : OrganizationPaymentSchema.shape.payment_status.optional(),
                  payment_timestamp: OrganizationPaymentSchema.shape.payment_timestamp.optional(),
              });

export const UpdateOrganizationPaymentRequestSchema = OrganizationPaymentSchema.pick(
    {
        payment_amount: true,
        payment_status: true,
    }).partial();

export const GetOrganizationPaymentByIdRequestSchema = OrganizationPaymentSchema.pick(
    {
        payment_id: true,
    });

// Client Requests
export const CreateClientRequestSchema = ClientSchema.pick({
                                                               client_stripe_customer_id: true,
                                                               client_name              : true,
                                                               client_nic_number        : true,
                                                               client_email             : true,
                                                               client_phone             : true,
                                                           }).extend({
                                                                         client_account_status: ClientSchema.shape.client_account_status.optional(),
                                                                     });

export const UpdateClientRequestSchema = ClientSchema.pick({
                                                               client_stripe_customer_id: true,
                                                               client_name              : true,
                                                               client_nic_number        : true,
                                                               client_email             : true,
                                                               client_phone             : true,
                                                               client_account_status    : true,
                                                           }).partial();

export const GetClientByIdRequestSchema = ClientSchema.pick({
                                                                client_id: true,
                                                            });

export const DeleteClientRequestSchema = z.object({
                                                      organization_id: z.string()
                                                                        .min(1),
                                                      client_id      : z.string()
                                                                        .min(1),
                                                  });

// Client Payment Requests
export const CreateClientPaymentRequestSchema = ClientPaymentSchema.pick({
                                                                             client_payment_client_id: true,
                                                                             client_payment_amount   : true,
                                                                         })
                                                                   .extend({
                                                                               client_payment_date  : ClientPaymentSchema.shape.client_payment_date.optional(),
                                                                               client_payment_status: ClientPaymentSchema.shape.client_payment_status.optional(),
                                                                           });

export const UpdateClientPaymentRequestSchema = ClientPaymentSchema.pick({
                                                                             client_payment_amount: true,
                                                                             client_payment_date  : true,
                                                                             client_payment_status: true,
                                                                         })
                                                                   .partial();

export const GetClientPaymentByIdRequestSchema = ClientPaymentSchema.pick({
                                                                              client_payment_id: true,
                                                                          });

export const GetClientPaymentsByClientIdRequestSchema = z.object({
                                                                     client_id: z.string()
                                                                                 .min(
                                                                                     1),
                                                                 });

// Composite Types

export const EmployeeProfileSchema = EmployeeSchema.extend(z.object({
                                                                        employee_sales     : z.array(
                                                                            SaleSchema),
                                                                        employee_attendance: z.array(
                                                                            EmployeesLeavesSchema)
                                                                    }))

export const SalesGroupProfileSchema = SalesGroupSchema.extend(z.object({
                                                                            sales_group_employees: z.array(
                                                                                EmployeeSchema),
                                                                            sales_group_sales    : z.array(
                                                                                SaleSchema)
                                                                        }))

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

export type TEmployeeProfile = z.infer<typeof EmployeeProfileSchema>
export type TSalesGroupProfile = z.infer<typeof SalesGroupProfileSchema>