import { createClient }          from '@libsql/client';
import {
    Inject,
    Injectable
}                                from '@nestjs/common';
import { ConfigService }         from '@nestjs/config';
import {
    and,
    between,
    eq,
    inArray
}                                from 'drizzle-orm';
import { drizzle }               from 'drizzle-orm/libsql/node';
import { v4 as uuid }            from 'uuid'
import type ILoggerService       from '../../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../../logger/logger_factory/logger_factory.service';
import { EEnvVars }              from '../../../types';
import AbstractDrizzlerService   from '../abstract_drizzle.service';
import {
    TClientInsert,
    TClientPaymentInsert,
    TClientPaymentSelect,
    TClientPaymentUpdate,
    TClientSelect,
    TClientUpdate,
    TEmployeeCredentialsInsert,
    TEmployeeCredentialsSelect,
    TEmployeeCredentialsUpdate,
    TEmployeeLeavesSelect,
    TEmployeeLeavesUpdate,
    TEmployeeSalarySelect,
    TEmployeeSalaryUpdate,
    TEmployeeSelect,
    TEmployeeUpdate,
    TItemInsert,
    TItemSelect,
    TItemUpdate,
    TOrganizationInsert,
    TOrganizationPaymentInsert,
    TOrganizationPaymentSelect,
    TOrganizationPaymentUpdate,
    TOrganizationSelect,
    TOrganizationUpdate,
    TSaleInsert,
    TSaleSelect,
    TSalesGroupInsert,
    TSalesGroupSelect,
    TSalesGroupUpdate,
    TSaleUpdate
}                                from '../drizzle-postgres/drizzle-postgres.schema';
import * as schema               from './drizzle-sqlite.schema';
import {
    clients,
    clientsPayments,
    employees,
    employeesCredentials,
    employeesLeaves,
    employeesSalaries,
    items,
    organizations,
    organizationsPayments,
    sales,
    salesGroups
}                                from './drizzle-sqlite.schema';



@Injectable()
export class DrizzleSqliteService extends AbstractDrizzlerService {
    protected readonly driver: ReturnType<typeof drizzle<typeof schema>>;
    
    
    constructor(
        configService: ConfigService,
        @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
    ) {
        super(
            configService,
            logger,
        );
        
        const sqliteClient = createClient({
                                              url: this.configService.get(
                                                  EEnvVars.SQLITE_URL) as string,
                                          });
        
        sqliteClient.execute('PRAGMA journal_mode = WAL;');
        
        this.driver = drizzle(
            sqliteClient,
            {
                schema: schema,
            }
        );
        
    }
    
    
    async addOrganization(organizationDetails: TOrganizationInsert,): Promise<TOrganizationSelect> {
        const result = await this.driver.transaction(async (tx) => {
            return tx.insert(organizations)
                     .values(organizationDetails)
                     .returning();
        });
        return this.logger.logAndReturn(
            result[0],
            'operation: add_organization'
        );
    }
    
    
    async updateOrganizationById(
        organization_id: string,
        organizationUpdates: TOrganizationUpdate,
    ): Promise<TOrganizationSelect> {
        const result = await this.driver.transaction(async (tx) => {
            return tx
                .update(organizations)
                .set(organizationUpdates)
                .where(eq(
                    organizations.organization_id,
                    organization_id
                ))
                .returning();
        });
        return this.logger.logAndReturn(
            result[0],
            'operation: update_organization_by_id',
        );
    }
    
    
    async getOrganizationDetailsById(organization_id: string,): Promise<TOrganizationSelect> {
        const result = await this.driver
                                 .select()
                                 .from(organizations)
                                 .where(eq(
                                     organizations.organization_id,
                                     organization_id
                                 ));
        return this.logger.logAndReturn(
            result[0],
            'operation: get_organization_details_by_id',
        );
    }
    
    
    async getOrganizationDetailsByAdminId(admin_id: string,): Promise<TOrganizationSelect> {
        const result = await this.driver
                                 .select()
                                 .from(organizations)
                                 .where(eq(
                                     organizations.organization_admin_id,
                                     admin_id
                                 ));
        return this.logger.logAndReturn(
            result[0],
            'operation: get_organization_details_by_admin_id',
        );
    }
    
    
    async addEmployee(
        organization_id: string,
        employeeCredentials: Pick<TEmployeeCredentialsInsert, 'employee_credential_username' | 'employee_credential_password'>
    ): Promise<TEmployeeSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            
            const employeeRecord = (await tx.insert(employees)
                                            .values({
                                                        employee_id                 : uuid()
                                                            .toString(),
                                                        employee_organization_id    : organization_id,
                                                        employee_sales_group_id     : null,
                                                        employee_first_name         : null,
                                                        employee_last_name          : null,
                                                        employee_registration_date  : Date.now(),
                                                        employee_active_territory   : null,
                                                        employee_phone              : null,
                                                        employee_nic_number         : employeeCredentials.employee_credential_username,
                                                        employee_profile_picture_url: null
                                                    })
                                            .returning())[0]
            
            await tx.insert(employeesCredentials)
                    .values({
                                employee_credential_id             : uuid()
                                    .toString(),
                                employee_credential_employee_id    : employeeRecord.employee_id,
                                employee_credential_organization_id: organization_id,
                                employee_credential_username       : employeeCredentials.employee_credential_username,
                                employee_credential_password       : employeeCredentials.employee_credential_password,
                            })
            
            await tx.insert(employeesLeaves)
                    .values({
                                employee_leave_id             : uuid()
                                    .toString(),
                                employee_leave_organization_id: organization_id,
                                employee_leave_employee_id    : employeeRecord.employee_id,
                                employee_leave_total          : 3,
                                employee_leave_taken          : 0,
                            })
            
            await tx.insert(employeesSalaries)
                    .values({
                                employee_salary_id                   : uuid()
                                    .toString(),
                                employee_salary_organization_id      : organization_id,
                                employee_salary_employee_id          : employeeRecord.employee_id,
                                employee_salary_base                 : 30_000,
                                employee_salary_commission_percentage: 0,
                            })
            
            return tx
                .select()
                .from(employees)
                .where(eq(
                    employees.employee_organization_id,
                    organization_id,
                ));
        });
        
        return this.logger.logAndReturn(
            result,
            'operation: add_employee'
        );
    }
    
    
    async getEmployeeProfileById(
        organization_id: string,
        employee_id: string
    ): Promise<TEmployeeSelect & {
        employee_sales: TSaleSelect[];
        employee_leaves: TEmployeeLeavesSelect;
        employee_salary: TEmployeeSalarySelect
    }> {
        const result = await this.driver.transaction(
            async (tx) => {
                const employee = (await tx
                    .select()
                    .from(employees)
                    .where(and(
                        eq(
                            employees.employee_organization_id,
                            organization_id
                        ),
                        eq(
                            employees.employee_id,
                            employee_id
                        )
                    )))[0];
                
                if (!employee) {
                    throw new Error(`No such employee: ${ employee_id }`)
                }
                
                const employee_sales = await tx.select()
                                               .from(sales)
                                               .where(
                                                   and(
                                                       eq(
                                                           sales.sale_organization_id,
                                                           organization_id
                                                       ),
                                                       eq(
                                                           sales.sale_employee_id,
                                                           employee.employee_id
                                                       )
                                                   )
                                               )
                                               .orderBy(sales.sale_date)
                
                const employee_leaves = await tx.select()
                                                .from(
                                                    employeesLeaves)
                                                .where(
                                                    and(
                                                        eq(
                                                            employeesLeaves.employee_leave_organization_id,
                                                            organization_id
                                                        ),
                                                        eq(
                                                            employeesLeaves.employee_leave_employee_id,
                                                            employee.employee_id
                                                        )
                                                    )
                                                )
                
                const employee_salary = await tx.select()
                                                .from(employeesSalaries)
                                                .where(
                                                    and(
                                                        eq(
                                                            employeesSalaries.employee_salary_organization_id,
                                                            organization_id
                                                        ),
                                                        eq(
                                                            employeesSalaries.employee_salary_employee_id,
                                                            employee.employee_id
                                                        )
                                                    )
                                                )
                
                employee['employee_sales']  = employee_sales;
                employee['employee_leaves'] = employee_leaves[0];
                employee['employee_salary'] = employee_salary[0];
                
                return employee as TEmployeeSelect & {
                    employee_sales: TSaleSelect[]
                    employee_leaves: TEmployeeLeavesSelect
                    employee_salary: TEmployeeSalarySelect
                }
            }
        )
        
        return this.logger.logAndReturn(
            result,
            'operation: view_employee_by_id',
        );
    }
    
    
    async getEmployeesByOrganizationId(organization_id: string,): Promise<TEmployeeSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(employees)
                      .where(eq(
                          employees.employee_organization_id,
                          organization_id
                      )),
            'operation: get_employees_by_organization_id',
        );
    }
    
    
    async getEmployeesBySalesGroupId(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TEmployeeSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(employees)
                      .where(and(
                          eq(
                              employees.employee_organization_id,
                              organization_id
                          ),
                          eq(
                              employees.employee_sales_group_id,
                              sales_group_id
                          )
                      )),
            'operation: get_employees_by_sales_group_id',
        );
    }
    
    
    async updateEmployeeById(
        organization_id: string,
        employee_id: string,
        employeeUpdates: Omit<TEmployeeUpdate, 'employee_id' | 'employee_organization_id'>,
    ): Promise<TEmployeeSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(employees)
                .set(employeeUpdates)
                .where(and(
                    eq(
                        employees.employee_organization_id,
                        organization_id
                    ),
                    eq(
                        employees.employee_id,
                        employee_id
                    ),
                ),);
            return tx
                .select()
                .from(employees)
                .where(eq(
                    employees.employee_organization_id,
                    organization_id
                ));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_employee_by_id'
        );
    }
    
    
    async updateEmployeesByIds(
        organization_id: string,
        employees_ids: string[],
        employeeUpdates: Omit<TEmployeeUpdate, 'employee_id' | 'employee_organization_id'>,
    ): Promise<TEmployeeSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(employees)
                .set(employeeUpdates)
                .where(and(
                    eq(
                        employees.employee_organization_id,
                        organization_id
                    ),
                    inArray(
                        employees.employee_id,
                        employees_ids
                    ),
                ),);
            return tx
                .select()
                .from(employees)
                .where(eq(
                    employees.employee_organization_id,
                    organization_id
                ));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_employee_by_id'
        );
    }
    
    
    async updateEmployeeCredentials(
        organization_id: string, employee_id: string,
        credentialUpdates: Omit<TEmployeeCredentialsUpdate, 'employee_credential_id' | 'employee_credential_organization_id' | 'employee_credential_employee_id'>
    ): Promise<TEmployeeCredentialsSelect> {
        const result = await this.driver.update(employeesCredentials)
                                 .set(credentialUpdates)
                                 .where(
                                     and(
                                         eq(
                                             employeesCredentials.employee_credential_organization_id,
                                             organization_id
                                         ),
                                         eq(
                                             employeesCredentials.employee_credential_employee_id,
                                             employee_id
                                         )
                                     )
                                 )
                                 .returning()
        
        return this.logger.logAndReturn(
            result[0],
            'operation: update_employee_credentials'
        )
    }
    
    
    async updateEmployeeLeave(
        organization_id: string, employee_id: string,
        employeeLeavesUpdates: Omit<TEmployeeLeavesUpdate, 'employee_leave_id' | 'employee_leave_organization_id' | 'employee_leave_employee_id'>
    ): Promise<TEmployeeLeavesSelect> {
        const result = await this.driver.update(employeesLeaves)
                                 .set(employeeLeavesUpdates)
                                 .where(
                                     and(
                                         eq(
                                             employeesLeaves.employee_leave_organization_id,
                                             organization_id
                                         ),
                                         eq(
                                             employeesLeaves.employee_leave_employee_id,
                                             employee_id
                                         )
                                     )
                                 )
                                 .returning()
        
        return this.logger.logAndReturn(
            result[0],
            'operation: update_employee_leave'
        )
    }
    
    
    async updateEmployeeSalary(
        organization_id: string, employee_id: string,
        employeeSalaryUpdates: Omit<TEmployeeSalaryUpdate, 'employee_salary_id' | 'employee_salary_organization_id' | 'employee_salary_employee_id'>
    ): Promise<TEmployeeSalarySelect> {
        const result = await this.driver.update(employeesSalaries)
                                 .set(employeeSalaryUpdates)
                                 .where(
                                     and(
                                         eq(
                                             employeesSalaries.employee_salary_organization_id,
                                             organization_id
                                         ),
                                         eq(
                                             employeesSalaries.employee_salary_employee_id,
                                             employee_id
                                         )
                                     )
                                 )
                                 .returning()
        
        return this.logger.logAndReturn(
            result[0],
            'operation: update_employee_salary'
        )
    }
    
    
    async getItemById(
        organization_id: string,
        item_id: string
    ): Promise<TItemSelect> {
        const result = await this.driver
                                 .select()
                                 .from(items)
                                 .where(and(
                                     eq(
                                         items.item_organization_id,
                                         organization_id
                                     ),
                                     eq(
                                         items.item_id,
                                         item_id
                                     )
                                 ));
        
        return this.logger.logAndReturn(
            result[0],
            'operation: view_item_by_id'
        );
    }
    
    
    async addItem(
        organization_id: string,
        itemDetails: Omit<TItemInsert, 'item_organization_id'>
    ): Promise<TItemSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(items)
                    .values({
                                ...itemDetails,
                                item_organization_id: organization_id
                            });
            return tx
                .select()
                .from(items)
                .where(eq(
                    items.item_organization_id,
                    organization_id
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: add_item'
        );
    }
    
    
    async getItemsByOrganizationId(organization_id: string,): Promise<TItemSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(items)
                      .where(eq(
                          items.item_organization_id,
                          organization_id
                      )),
            'operation: get_items_by_organization_id',
        );
    }
    
    
    async updateItemById(
        organization_id: string,
        item_id: string,
        itemUpdates: Omit<TItemUpdate, 'item_organization_id' | 'item_id'>,
    ): Promise<TItemSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(items)
                .set(itemUpdates)
                .where(and(
                    eq(
                        items.item_organization_id,
                        organization_id
                    ),
                    eq(
                        items.item_id,
                        item_id
                    ),
                ),);
            return tx
                .select()
                .from(items)
                .where(eq(
                    items.item_organization_id,
                    organization_id
                ));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_item_by_id'
        );
    }
    
    
    async updateItemsByIds(
        organization_id: string,
        items_ids: string[],
        itemUpdates: Omit<TItemUpdate, 'item_organization_id' | 'item_id'>,
    ): Promise<TItemSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(items)
                .set(itemUpdates)
                .where(and(
                    eq(
                        items.item_organization_id,
                        organization_id
                    ),
                    inArray(
                        items.item_id,
                        items_ids
                    ),
                ),);
            return tx
                .select()
                .from(items)
                .where(eq(
                    items.item_organization_id,
                    organization_id
                ));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_item_by_id'
        );
    }
    
    
    async addSalesGroup(
        organization_id: string,
        salesGroupDetails: Omit<TSalesGroupInsert, 'sales_group_organization_id'>
    ): Promise<TSalesGroupSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(salesGroups)
                    .values({
                                ...salesGroupDetails,
                                sales_group_organization_id: organization_id
                            });
            return tx
                .select()
                .from(salesGroups)
                .where(eq(
                    salesGroups.sales_group_organization_id,
                    organization_id
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: add_sales_group'
        );
    }
    
    
    async getSalesGroupsByOrganizationId(organization_id: string,): Promise<TSalesGroupSelect[]> {
        const result = await this.driver
                                 .select()
                                 .from(salesGroups)
                                 .where(eq(
                                     salesGroups.sales_group_organization_id,
                                     organization_id
                                 ));
        return this.logger.logAndReturn(
            result,
            'operation: get_sales_groups_by_organization_id',
        );
    }
    
    
    async getSalesGroupDetailsById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroupSelect & {
        sales_group_employees: (TEmployeeSelect & {
            employee_sales: TSaleSelect[];
            employee_leaves: TEmployeeLeavesSelect
        })[]
    }> {
        
        const result = await this.driver.transaction(async (tx) => {
            const sales_group = await tx.select()
                                        .from(salesGroups)
                                        .where(and(
                                            eq(
                                                salesGroups.sales_group_organization_id,
                                                organization_id
                                            ),
                                            eq(
                                                salesGroups.sales_group_id,
                                                sales_group_id
                                            )
                                        ))
                                        .limit(1);
            
            const sales_group_employees = await tx.select()
                                                  .from(employees)
                                                  .where(and(
                                                      eq(
                                                          employees.employee_organization_id,
                                                          organization_id
                                                      ),
                                                      eq(
                                                          employees.employee_sales_group_id,
                                                          sales_group_id
                                                      ),
                                                  ))
            
            const employees_ids = sales_group_employees.map((employee) => employee.employee_id)
            
            const employee_sales = await tx.select()
                                           .from(sales)
                                           .where(and(
                                               eq(
                                                   sales.sale_organization_id,
                                                   organization_id
                                               ),
                                               inArray(
                                                   sales.sale_employee_id,
                                                   employees_ids
                                               )
                                           ))
            
            const employee_leaves = await tx.select()
                                            .from(employeesLeaves)
                                            .where(and(
                                                eq(
                                                    employeesLeaves.employee_leave_organization_id,
                                                    organization_id
                                                ),
                                                inArray(
                                                    employeesLeaves.employee_leave_employee_id,
                                                    employees_ids
                                                )
                                            ))
            
            return {
                ...sales_group[0],
                sales_group_employees: sales_group_employees.map((employee) => {
                    return {
                        ...employee,
                        employee_sales : employee_sales.filter((sale) => (
                            sale.sale_employee_id === employee.employee_id
                        )),
                        employee_leaves: employee_leaves.find((leave) => (
                            leave.employee_leave_employee_id === employee.employee_id
                        ))!
                    }
                    
                }) as (TEmployeeSelect & {
                    employee_sales: TSaleSelect[];
                    employee_leaves: TEmployeeLeavesSelect
                })[]
            }
            
        })
        
        return this.logger.logAndReturn(
            result,
            'operation: get_sales_group_details_by_id',
        );
    }
    
    
    async updateSalesGroupById(
        organization_id: string,
        sales_group_id: string,
        salesGroupUpdates: Omit<TSalesGroupUpdate, 'sales_group_organization_id' | 'sales_group_id'>,
    ): Promise<TSalesGroupSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(salesGroups)
                .set(salesGroupUpdates)
                .where(and(
                    eq(
                        salesGroups.sales_group_organization_id,
                        organization_id
                    ),
                    eq(
                        salesGroups.sales_group_id,
                        sales_group_id
                    ),
                ),);
            return tx
                .select()
                .from(salesGroups)
                .where(eq(
                    salesGroups.sales_group_organization_id,
                    organization_id
                ));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_sales_group_by_id',
        );
    }
    
    
    async deleteSalesGroupById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroupSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .delete(salesGroups)
                .where(and(
                    eq(
                        salesGroups.sales_group_organization_id,
                        organization_id
                    ),
                    eq(
                        salesGroups.sales_group_id,
                        sales_group_id
                    ),
                ),);
            return tx
                .select()
                .from(salesGroups)
                .where(eq(
                    salesGroups.sales_group_organization_id,
                    organization_id
                ));
        });
        return this.logger.logAndReturn(
            result,
            'operation: delete_sales_group_by_id',
        );
    }
    
    
    async addClient(
        organization_id: string,
        clientDetails: Omit<TClientInsert, 'client_organization_id'>
    ): Promise<TClientSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(clients)
                    .values({
                                ...clientDetails,
                                client_organization_id: organization_id // Added
                                                                        // missing
                                                                        // organization_id
                            });
            return tx
                .select()
                .from(clients)
                .where(eq(
                    clients.client_organization_id,
                    organization_id
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: add_client'
        );
    }
    
    
    async getClientProfileById(
        organization_id: string,
        client_id: string
    ): Promise<TClientSelect> {
        const result = await this.driver
                                 .select()
                                 .from(clients)
                                 .where(and(
                                     eq(
                                         clients.client_organization_id,
                                         organization_id
                                     ),
                                     eq(
                                         clients.client_id,
                                         client_id
                                     )
                                 ))
                                 .limit(1);
        return this.logger.logAndReturn(
            result[0],
            'operation: get_client_profile_by_id',
        );
    }
    
    
    async getClientsByOrganizationId(organization_id: string,): Promise<TClientSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(clients)
                      .where(eq(
                          clients.client_organization_id,
                          organization_id
                      )),
            'operation: get_clients_by_organization_id',
        );
    }
    
    
    async updateClientById(
        organization_id: string,
        client_id: string,
        clientUpdates: Omit<TClientUpdate, 'client_id' | 'client_organization_id'>,
    ): Promise<TClientSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(clients)
                .set(clientUpdates)
                .where(and(
                    eq(
                        clients.client_organization_id,
                        organization_id
                    ),
                    eq(
                        clients.client_id,
                        client_id
                    ),
                ),);
            return tx
                .select()
                .from(clients)
                .where(eq(
                    clients.client_organization_id,
                    organization_id
                ));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_client_by_id'
        );
    }
    
    
    async updateClientsByIds(
        organization_id: string,
        clients_ids: string[],
        clientUpdates: Omit<TClientUpdate, 'client_organization_id' | 'client_id'>,
    ): Promise<TClientSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(clients)
                .set(clientUpdates)
                .where(and(
                    eq(
                        clients.client_organization_id,
                        organization_id
                    ),
                    inArray(
                        clients.client_id,
                        clients_ids
                    ),
                ),);
            return tx
                .select()
                .from(clients)
                .where(eq(
                    clients.client_organization_id,
                    organization_id
                ));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_client_by_id'
        );
    }
    
    
    async addOrganizationPayment(
        organization_id: string,
        paymentDetails: Omit<TOrganizationPaymentInsert, 'organization_payment_organization_id'>,
    ): Promise<TOrganizationPaymentSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(organizationsPayments)
                    .values({
                                ...paymentDetails,
                                organization_payment_organization_id: organization_id // Added missing organization_id
                            });
            return tx
                .select()
                .from(organizationsPayments)
                .where(eq(
                    organizationsPayments.organization_payment_organization_id,
                    organization_id
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: add_organization_payment',
        );
    }
    
    
    async getOrganizationPaymentById(
        organization_id: string,
        payment_id: string
    ): Promise<TOrganizationPaymentSelect> {
        
        return this.logger.logAndReturn(
            (await this.driver
                       .select()
                       .from(organizationsPayments)
                       .where(and(
                           eq(
                               organizationsPayments.organization_payment_organization_id,
                               organization_id
                           ),
                           eq(
                               organizationsPayments.organization_payment_id,
                               payment_id
                           )
                       )))[0],
            'operation: get_organization_payment_by_id', // Fixed log message
        );
    }
    
    
    async getOrganizationPaymentsByOrganizationId(organization_id: string,): Promise<TOrganizationPaymentSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(organizationsPayments)
                      .where(eq(
                          organizationsPayments.organization_payment_organization_id,
                          organization_id
                      ),),
            'operation: get_organization_payments_by_organization_id',
        );
    }
    
    
    async updateOrganizationPaymentById(
        organization_id: string,
        payment_id: string,
        paymentUpdates: Omit<TOrganizationPaymentUpdate, 'organization_payment_id' | 'organization_payment_organization_id'>,
    ): Promise<TOrganizationPaymentSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(organizationsPayments)
                .set(paymentUpdates)
                .where(and(
                    eq(
                        organizationsPayments.organization_payment_organization_id,
                        organization_id
                    ),
                    eq(
                        organizationsPayments.organization_payment_id,
                        payment_id
                    ),
                ),);
            return tx
                .select()
                .from(organizationsPayments)
                .where(eq(
                    organizationsPayments.organization_payment_organization_id,
                    organization_id
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_organization_payment_by_id',
        );
    }
    
    
    async addClientPayment(
        organization_id: string,
        client_id: string,
        paymentDetails: Omit<TClientPaymentInsert, 'client_payment_organization_id' | 'client_payment_client_id'>,
    ): Promise<TClientPaymentSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(clientsPayments)
                    .values({
                                ...paymentDetails,
                                client_payment_organization_id: organization_id,
                                client_payment_client_id      : client_id
                            });
            return tx
                .select()
                .from(clientsPayments)
                .where(
                    and(
                        eq(
                            clientsPayments.client_payment_organization_id,
                            organization_id
                        ),
                        eq(
                            clientsPayments.client_payment_client_id,
                            client_id
                        )
                    ));
        });
        return this.logger.logAndReturn(
            result,
            'operation: add_client_payment'
        );
    }
    
    
    async getClientPaymentById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPaymentSelect> {
        const result = await this.driver
                                 .select()
                                 .from(clientsPayments)
                                 .where(and(
                                     eq(
                                         clientsPayments.client_payment_organization_id,
                                         organization_id
                                     ),
                                     eq(
                                         clientsPayments.client_payment_id,
                                         payment_id
                                     )
                                 ))
                                 .limit(1);
        return this.logger.logAndReturn(
            result[0],
            'operation: get_client_payment_by_id',
        );
    }
    
    
    async getClientPaymentsByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TClientPaymentSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(clientsPayments)
                      .where(and(
                          eq(
                              clientsPayments.client_payment_organization_id,
                              organization_id
                          ),
                          eq(
                              clientsPayments.client_payment_client_id,
                              client_id
                          )
                      )),
            'operation: get_client_payments_by_client_id',
        );
    }
    
    
    async updateClientPaymentById(
        organization_id: string,
        payment_id: string,
        clientPaymentUpdates: Omit<TClientPaymentUpdate, 'client_payment_id' | 'client_payment_organization_id' | 'client_payment_client_id'>,
    ): Promise<TClientPaymentSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(clientsPayments)
                .set(clientPaymentUpdates)
                .where(and(
                    eq(
                        clientsPayments.client_payment_organization_id,
                        organization_id
                    ),
                    eq(
                        clientsPayments.client_payment_id,
                        payment_id
                    ),
                ),);
            return tx
                .select()
                .from(clientsPayments)
                .where(eq(
                    clientsPayments.client_payment_organization_id,
                    organization_id
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_client_payment_by_id',
        );
    }
    
    
    async addSale(
        organization_id: string,
        employee_id: string,
        saleDetails: Omit<TSaleInsert, 'sale_organization_id' | 'sale_employee_id'>
    ): Promise<TSaleSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(sales)
                    .values({
                                ...saleDetails,
                                sale_organization_id: organization_id,
                                sale_employee_id    : employee_id,
                            });
            return tx
                .select()
                .from(sales)
                .where(eq(
                    sales.sale_organization_id,
                    organization_id
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: add_sale_item'
        );
    }
    
    
    async getSaleById(
        organization_id: string,
        sale_id: string
    ): Promise<TSaleSelect> {
        const result = await this.driver
                                 .select()
                                 .from(sales)
                                 .where(and(
                                     eq(
                                         sales.sale_organization_id,
                                         organization_id
                                     ),
                                     eq(
                                         sales.sale_id,
                                         sale_id
                                     )
                                 ));
        return this.logger.logAndReturn(
            result[0],
            'operation: view_sale_by_id'
        );
    }
    
    
    async getSalesByEmployeeId(
        organization_id: string,
        employee_id: string,
    ): Promise<TSaleSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(sales)
                      .where(and(
                          eq(
                              sales.sale_organization_id,
                              organization_id
                          ),
                          eq(
                              sales.sale_employee_id,
                              employee_id
                          )
                      )),
            'operation: get_sales_by_employee_id',
        );
    }
    
    
    async getSalesByItemId(
        organization_id: string,
        item_id: string
    ): Promise<TSaleSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(sales)
                      .where(and(
                          eq(
                              sales.sale_organization_id,
                              organization_id
                          ),
                          eq(
                              sales.sale_item_id,
                              item_id
                          )
                      )),
            'operation: get_sales_by_item_id',
        );
    }
    
    
    async getSalesByOrganizationId(organization_id: string,): Promise<TSaleSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(sales)
                      .where(eq(
                          sales.sale_organization_id,
                          organization_id
                      )),
            'operation: get_sales_by_organization_id',
        );
    }
    
    
    async getSalesByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TSaleSelect[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(sales)
                      .where(and(
                          eq(
                              sales.sale_organization_id,
                              organization_id
                          ),
                          eq(
                              sales.sale_client_id,
                              client_id
                          )
                      )),
            'operation: get_sales_by_client_id',
        );
    }
    
    
    async getSalesByDate(
        organization_id: string,
        date: number,
    ): Promise<TSaleSelect[]> {
        const result = await this.driver
                                 .select()
                                 .from(sales)
                                 .where(and(
                                     eq(
                                         sales.sale_organization_id,
                                         organization_id
                                     ),
                                     eq(
                                         sales.sale_date,
                                         date
                                     ),
                                 ),);
        return this.logger.logAndReturn(
            result,
            'operation: get_sales_by_date'
        );
    }
    
    
    async getSalesWithinDates(
        organization_id: string,
        date_start: number,
        date_end: number,
    ): Promise<TSaleSelect[]> {
        const result = await this.driver
                                 .select()
                                 .from(sales)
                                 .where(and(
                                     eq(
                                         sales.sale_organization_id,
                                         organization_id
                                     ),
                                     between(
                                         sales.sale_date,
                                         date_start,
                                         date_end
                                     ),
                                 ),);
        return this.logger.logAndReturn(
            result,
            'operation: get_sales_within_dates',
        );
    }
    
    
    async updateSaleById(
        organization_id: string,
        sale_id: string,
        saleUpdates: Omit<TSaleUpdate, 'sale_id' | 'sale_organization_id' | 'sale_employee_id'>,
    ): Promise<TSaleSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.update(sales)
                    .set(saleUpdates)
                    .where(
                        and(
                            eq(
                                sales.sale_organization_id,
                                organization_id
                            ),
                            eq(
                                sales.sale_id,
                                sale_id
                            )
                        )
                    );
            
            return await tx.select()
                           .from(sales)
                           .where(
                               eq(
                                   sales.sale_organization_id,
                                   organization_id
                               ),
                           );
        });
        
        return this.logger.logAndReturn(
            result,
            'operation: update_sale_by_id'
        );
    }
}


/*
 @Injectable()
 export class DrizzleSqliteService extends AbstractDrizzlerService {
 protected readonly driver: ReturnType<typeof drizzle<typeof schema>>;
 
 
 constructor(
 configService: ConfigService,
 @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
 ) {
 super(
 configService,
 logger,
 );
 
 const sqliteClient = createClient({
 url: this.configService.get(
 EEnvVars.SQLITE_URL) as string,
 });
 
 sqliteClient.execute('PRAGMA journal_mode = WAL;');
 
 this.driver = drizzle(
 sqliteClient,
 {
 schema: schema,
 }
 );
 
 }
 
 
 async addOrganization(organizationDetails: TOrganizationInsert,): Promise<TOrganizationSelect> {
 const result = await this.driver.transaction(async (tx) => {
 return tx.insert(organizations)
 .values(organizationDetails)
 .returning();
 });
 return this.logger.logAndReturn(
 result[0],
 'operation: add_organization'
 );
 }
 
 
 async updateOrganizationById(
 organization_id: string,
 organizationUpdates: TOrganizationUpdate,
 ): Promise<TOrganizationSelect> {
 const result = await this.driver.transaction(async (tx) => {
 return tx
 .update(organizations)
 .set(organizationUpdates)
 .where(eq(
 organizations.organization_id,
 organization_id
 ))
 .returning();
 });
 return this.logger.logAndReturn(
 result[0],
 'operation: update_organization_by_id',
 );
 }
 
 
 async getOrganizationDetailsById(organization_id: string,): Promise<TOrganizationSelect> {
 const result = await this.driver
 .select()
 .from(organizations)
 .where(eq(
 organizations.organization_id,
 organization_id
 ));
 return this.logger.logAndReturn(
 result[0],
 'operation: get_organization_details_by_id',
 );
 }
 
 
 async getOrganizationDetailsByAdminId(admin_id: string,): Promise<TOrganizationSelect> {
 const result = await this.driver
 .select()
 .from(organizations)
 .where(eq(
 organizations.organization_admin_id,
 admin_id
 ));
 return this.logger.logAndReturn(
 result[0],
 'operation: get_organization_details_by_admin_id',
 );
 }
 
 
 async addEmployee(
 organization_id: string,
 employeeCredentials: Pick<TEmployeeCredentialsInsert, 'employee_credential_username' | 'employee_credential_password'>
 ): Promise<TEmployeeSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 
 const employeeRecord = (await tx.insert(employees)
 .values({
 employee_id                 : uuid()
 .toString(),
 employee_organization_id    : organization_id,
 employee_sales_group_id     : null,
 employee_first_name         : null,
 employee_last_name          : null,
 employee_registration_date  : Date.now(),
 employee_active_territory   : null,
 employee_phone              : null,
 employee_nic_number         : employeeCredentials.employee_credential_username,
 employee_profile_picture_url: employeeCredentials.employee_profile_picture_url
 })
 .returning())[0]
 
 await tx.insert(employeesCredentials)
 .values({
 employee_credential_id             : uuid()
 .toString(),
 employee_credential_employee_id    : employeeRecord.employee_id,
 employee_credential_organization_id: organization_id,
 employee_credential_username       : employeeCredentials.employee_credential_username,
 employee_credential_password       : employeeCredentials.employee_credential_password,
 })
 
 await tx.insert(employeesLeaves)
 .values({
 employee_leave_id             : uuid()
 .toString(),
 employee_leave_organization_id: organization_id,
 employee_leave_employee_id    : employeeRecord.employee_id,
 employee_leave_total          : 3,
 employee_leave_taken          : 0,
 })
 
 await tx.insert(employeesSalaries)
 .values({
 employee_salary_id                   : uuid()
 .toString(),
 employee_salary_organization_id      : organization_id,
 employee_salary_employee_id          : employeeRecord.employee_id,
 employee_salary_base                 : 30_000,
 employee_salary_commission_percentage: 0,
 })
 
 return tx
 .select()
 .from(employees)
 .where(eq(
 employees.employee_organization_id,
 organization_id,
 ));
 });
 
 return this.logger.logAndReturn(
 result,
 'operation: add_employee'
 );
 }
 
 
 async getEmployeeProfileById(
 organization_id: string,
 employee_id: string
 ): Promise<TEmployeeSelect & {
 employee_sales: TSaleSelect[];
 employee_leaves: TEmployeeLeavesSelect;
 employee_salary: TEmployeeSalarySelect
 }> {
 const result = await this.driver.transaction(
 async (tx) => {
 const employee = (await tx
 .select()
 .from(employees)
 .where(and(
 eq(
 employees.employee_organization_id,
 organization_id
 ),
 eq(
 employees.employee_id,
 employee_id
 )
 )))[0];
 
 if (!employee) {
 throw new Error(`No such employee: ${ employee_id }`)
 }
 
 const employee_sales = await tx.select()
 .from(sales)
 .where(
 and(
 eq(
 sales.sale_organization_id,
 organization_id
 ),
 eq(
 sales.sale_employee_id,
 employee.employee_id
 )
 )
 )
 .orderBy(sales.sale_date)
 
 const employee_leaves = await tx.select()
 .from(
 employeesLeaves)
 .where(
 and(
 eq(
 employeesLeaves.employee_leave_organization_id,
 organization_id
 ),
 eq(
 employeesLeaves.employee_leave_employee_id,
 employee.employee_id
 )
 )
 )
 
 employee['employee_sales']  = employee_sales;
 employee['employee_leaves'] = employee_leaves;
 
 return employee as TEmployeeSelect & {
 employee_sales: TSaleSelect[]
 employee_leaves: TEmployeeLeavesSelect
 }
 }
 )
 
 return this.logger.logAndReturn(
 result,
 'operation: view_employee_by_id',
 );
 }
 
 
 async getEmployeesByOrganizationId(organization_id: string,): Promise<TEmployeeSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(employees)
 .where(eq(
 employees.employee_organization_id,
 organization_id
 )),
 'operation: get_employees_by_organization_id',
 );
 }
 
 
 async getEmployeesBySalesGroupId(sales_group_id: string,): Promise<TEmployeeSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(employees)
 .where(eq(
 employees.employee_sales_group_id,
 sales_group_id
 )),
 'operation: get_employees_by_sales_group_id',
 );
 }
 
 
 async updateEmployeeById(
 organization_id: string,
 employee_id: string,
 employeeUpdates: Omit<TEmployeeUpdate, 'employee_id' | 'employee_organization_id'>,
 ): Promise<TEmployeeSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .update(employees)
 .set(employeeUpdates)
 .where(and(
 eq(
 employees.employee_organization_id,
 organization_id
 ),
 eq(
 employees.employee_id,
 employee_id
 ),
 ),);
 return tx
 .select()
 .from(employees)
 .where(eq(
 employees.employee_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: update_employee_by_id'
 );
 }
 
 
 async updateEmployeesByIds(
 organization_id: string,
 employees_ids: string[],
 employeeUpdates: Omit<TEmployeeUpdate, 'employee_id' | 'employee_organization_id'>,
 ): Promise<TEmployeeSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .update(employees)
 .set(employeeUpdates)
 .where(and(
 eq(
 employees.employee_organization_id,
 organization_id
 ),
 inArray(
 employees.employee_id,
 employees_ids
 ),
 ),);
 return tx
 .select()
 .from(employees)
 .where(eq(
 employees.employee_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: update_employee_by_id'
 );
 }
 
 
 async updateEmployeeCredentials(
 organization_id: string, employee_id: string,
 credentialUpdates: Omit<TEmployeeCredentialsUpdate, 'employee_credential_id' | 'employee_credential_organization_id' | 'employee_credential_employee_id'>
 ): Promise<TEmployeeCredentialsSelect> {
 const result = await this.driver.update(employeesCredentials)
 .set(credentialUpdates)
 .where(
 and(
 eq(
 employeesCredentials.employee_credential_organization_id,
 organization_id
 ),
 eq(
 employeesCredentials.employee_credential_employee_id,
 employee_id
 )
 )
 )
 .returning()
 
 return this.logger.logAndReturn(
 result[0],
 'operation: update_employee_credentials'
 )
 }
 
 
 async updateEmployeeLeave(
 organization_id: string, employee_id: string,
 employeeLeavesUpdates: Omit<TEmployeeLeavesUpdate, 'employee_leave_id' | 'employee_leave_organization_id' | 'employee_leave_employee_id'>
 ): Promise<TEmployeeLeavesSelect> {
 const result = await this.driver.update(employeesLeaves)
 .set(employeeLeavesUpdates)
 .where(
 and(
 eq(
 employeesLeaves.employee_leave_organization_id,
 organization_id
 ),
 eq(
 employeesLeaves.employee_leave_employee_id,
 employee_id
 )
 )
 )
 .returning()
 
 return this.logger.logAndReturn(
 result[0],
 'operation:' +
 ' update_employee_leave'
 )
 }
 
 
 async updateEmployeeSalary(
 organization_id: string, employee_id: string,
 employeeSalaryUpdates: Omit<TEmployeeSalaryUpdate, 'employee_salary_id' | 'employee_salary_organization_id' | 'employee_salary_employee_id'>
 ): Promise<TEmployeeSalarySelect> {
 const result = await this.driver.update(employeesSalaries)
 .set(employeeSalaryUpdates)
 .where(
 and(
 eq(
 employeesSalaries.employee_salary_organization_id,
 organization_id
 ),
 eq(
 employeesSalaries.employee_salary_employee_id,
 employee_id
 )
 )
 )
 .returning()
 
 return this.logger.logAndReturn(
 result[0],
 'operation:' +
 ' update_employee_salary'
 )
 }
 
 
 async addItem(
 organization_id: string,
 itemDetails: Omit<TItemInsert, 'item_organization_id'>
 ): Promise<TItemSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx.insert(items)
 .values({
 ...itemDetails,
 item_organization_id: organization_id
 });
 return tx
 .select()
 .from(items)
 .where(eq(
 items.item_organization_id,
 itemDetails.item_organization_id
 ),);
 });
 return this.logger.logAndReturn(
 result,
 'operation: add_item'
 );
 }
 
 
 async getItemById(item_id: string): Promise<TItemSelect> {
 const result = await this.driver
 .select()
 .from(items)
 .where(eq(
 items.item_id,
 item_id
 ));
 return this.logger.logAndReturn(
 result[0],
 'operation: view_item_by_id'
 );
 }
 
 
 async getItemsByOrganizationId(organization_id: string,): Promise<TItemSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(items)
 .where(eq(
 items.item_organization_id,
 organization_id
 )),
 'operation: get_items_by_organization_id',
 );
 }
 
 
 async updateItemById(
 organization_id: string,
 item_id: string,
 itemUpdates: Omit<TItemUpdate, 'item_organization_id' | 'item_id'>,
 ): Promise<TItemSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .update(items)
 .set(itemUpdates)
 .where(and(
 eq(
 items.item_organization_id,
 organization_id
 ),
 eq(
 items.item_id,
 item_id
 ),
 ),);
 return tx
 .select()
 .from(items)
 .where(eq(
 items.item_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: update_item_by_id'
 );
 }
 
 
 async updateItemsByIds(
 organization_id: string,
 items_ids: string[],
 itemUpdates: Omit<TItemUpdate, 'item_organization_id' | 'item_id'>,
 ): Promise<TItemSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .update(items)
 .set(itemUpdates)
 .where(and(
 eq(
 items.item_organization_id,
 organization_id
 ),
 inArray(
 items.item_id,
 items_ids
 ),
 ),);
 return tx
 .select()
 .from(items)
 .where(eq(
 items.item_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: update_item_by_id'
 );
 }
 
 
 async deleteItemById(
 organization_id: string,
 item_id: string,
 ): Promise<TItemSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .delete(items)
 .where(and(
 eq(
 items.item_organization_id,
 organization_id
 ),
 eq(
 items.item_id,
 item_id
 ),
 ),);
 return tx
 .select()
 .from(items)
 .where(eq(
 items.item_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: delete_item_by_id'
 );
 }
 
 
 async deleteItemsByIds(
 organization_id: string,
 items_ids: string[],
 ): Promise<TItemSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .delete(items)
 .where(and(
 eq(
 items.item_organization_id,
 organization_id
 ),
 inArray(
 items.item_id,
 items_ids
 ),
 ),);
 return tx
 .select()
 .from(items)
 .where(eq(
 items.item_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: delete_item_by_id'
 );
 }
 
 
 async addSalesGroup(
 organization_id: string,
 salesGroupDetails: Omit<TSalesGroupInsert, 'sales_group_organization_id'>
 ): Promise<TSalesGroupSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx.insert(salesGroups)
 .values({
 ...salesGroupDetails,
 sales_group_organization_id: organization_id
 });
 return tx
 .select()
 .from(salesGroups)
 .where(eq(
 salesGroups.sales_group_organization_id,
 salesGroupDetails.sales_group_organization_id,
 ),);
 });
 return this.logger.logAndReturn(
 result,
 'operation: add_sales_group'
 );
 }
 
 
 async getSalesGroupsByOrganizationId(organization_id: string,): Promise<TSalesGroupSelect[]> {
 const result = await this.driver
 .select()
 .from(salesGroups)
 .where(eq(
 salesGroups.sales_group_organization_id,
 organization_id
 ));
 return this.logger.logAndReturn(
 result,
 'operation: get_sales_groups_by_organization_id',
 );
 }
 
 
 async getSalesGroupDetailsById(
 organization_id: string,
 sales_group_id: string,
 ): Promise<TSalesGroupSelect & {
 sales_group_employees: (TEmployeeSelect & {
 employee_sales: TSaleSelect[];
 employee_leaves: TEmployeeLeavesSelect
 })[]
 }> {
 
 const result = await this.driver.transaction(async (tx) => {
 const sales_group = await tx.select()
 .from(salesGroups)
 .where(and(
 eq(
 salesGroups.sales_group_organization_id,
 organization_id
 ),
 eq(
 salesGroups.sales_group_id,
 sales_group_id
 )
 ))
 .limit(1);
 
 const sales_group_employees = await tx.select()
 .from(employees)
 .where(and(
 eq(
 employees.employee_organization_id,
 organization_id
 ),
 eq(
 employees.employee_sales_group_id,
 sales_group_id
 ),
 ))
 
 const employees_ids = sales_group_employees.map((employee) => employee.employee_id)
 
 const employee_sales = await tx.select()
 .from(sales)
 .where(and(
 eq(
 sales.sale_organization_id,
 organization_id
 ),
 inArray(
 sales.sale_employee_id,
 employees_ids
 )
 ))
 
 return {
 ...sales_group[0],
 sales_group_employees: sales_group_employees.map((employee) => {
 employee['employee_sales'] =
 employee_sales.filter((sale) => (
 sale.sale_employee_id === employee.employee_id
 ))
 
 return employee
 
 }) as (TEmployeeSelect & {
 employee_sales: TSaleSelect[]
 })[]
 }
 
 })
 
 return this.logger.logAndReturn(
 result,
 'operation: get_sales_group_details_by_id',
 );
 }
 
 
 async updateSalesGroupById(
 organization_id: string,
 sales_group_id: string,
 salesGroupUpdates: Omit<TSalesGroupUpdate, 'sales_group_organization_id' | 'sales_group_id'>,
 ): Promise<TSalesGroupSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .update(salesGroups)
 .set(salesGroupUpdates)
 .where(and(
 eq(
 salesGroups.sales_group_organization_id,
 organization_id
 ),
 eq(
 salesGroups.sales_group_id,
 sales_group_id
 ),
 ),);
 return tx
 .select()
 .from(salesGroups)
 .where(eq(
 salesGroups.sales_group_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: update_sales_group_by_id',
 );
 }
 
 
 async deleteSalesGroupById(
 organization_id: string,
 sales_group_id: string,
 ): Promise<TSalesGroupSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .delete(salesGroups)
 .where(and(
 eq(
 salesGroups.sales_group_organization_id,
 organization_id
 ),
 eq(
 salesGroups.sales_group_id,
 sales_group_id
 ),
 ),);
 return tx
 .select()
 .from(salesGroups)
 .where(eq(
 salesGroups.sales_group_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: delete_sales_group_by_id',
 );
 }
 
 
 async addClient(
 organization_id: string,
 clientDetails: Omit<TClientInsert, 'client_organization_id'>
 ): Promise<TClientSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx.insert(clients)
 .values(clientDetails);
 return tx
 .select()
 .from(clients)
 .where(eq(
 clients.client_organization_id,
 organization_id
 ),);
 });
 return this.logger.logAndReturn(
 result,
 'operation: add_client'
 );
 }
 
 
 async getClientProfileById(organization_id: string): Promise<TClientSelect> {
 const result = await this.driver
 .select()
 .from(clients)
 .where(eq(
 clients.client_organization_id,
 organization_id
 ))
 .limit(1);
 return this.logger.logAndReturn(
 result[0],
 'operation: get_client_profile_by_id',
 );
 }
 
 
 async getClientsByOrganizationId(organization_id: string,): Promise<TClientSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(clients)
 .where(eq(
 clients.client_organization_id,
 organization_id
 )),
 'operation: get_clients_by_organization_id',
 );
 }
 
 
 async updateClientById(
 organization_id: string,
 client_id: string,
 clientUpdates: Omit<TClientUpdate, 'client_id' | 'client_organization_id'>,
 ): Promise<TClientSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .update(clients)
 .set(clientUpdates)
 .where(and(
 eq(
 clients.client_organization_id,
 organization_id
 ),
 eq(
 clients.client_id,
 client_id
 ),
 ),);
 return tx
 .select()
 .from(clients)
 .where(eq(
 clients.client_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: update_client_by_id'
 );
 }
 
 
 async updateClientsByIds(
 organization_id: string,
 clients_ids: string[],
 clientUpdates: Omit<TClientUpdate, 'client_organization_id' | 'client_id'>,
 ): Promise<TClientSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .update(clients)
 .set(clientUpdates)
 .where(and(
 eq(
 clients.client_organization_id,
 organization_id
 ),
 inArray(
 clients.client_id,
 clients_ids
 ),
 ),);
 return tx
 .select()
 .from(clients)
 .where(eq(
 clients.client_organization_id,
 organization_id
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: update_client_by_id'
 );
 }
 
 
 async addOrganizationPayment(
 organization_id: string,
 paymentDetails: Omit<TOrganizationPaymentInsert, 'organization_payment_organization_id'>,
 ): Promise<TOrganizationPaymentSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx.insert(organizationsPayments)
 .values(paymentDetails);
 return tx
 .select()
 .from(organizationsPayments)
 .where(eq(
 organizationsPayments.organization_payment_organization_id,
 organization_id
 ),);
 });
 return this.logger.logAndReturn(
 result,
 'operation: add_organization_payment',
 );
 }
 
 
 async getOrganizationPaymentById(
 organization_id: string,
 payment_id: string
 ): Promise<TOrganizationPaymentSelect> {
 
 return this.logger.logAndReturn(
 (await this.driver
 .select()
 .from(organizationsPayments)
 .where(and(
 eq(
 organizationsPayments.organization_payment_organization_id,
 organization_id
 ),
 eq(
 organizationsPayments.organization_payment_id,
 payment_id
 )
 )))[0],
 'operation: get_organization_payments_by_organization_id',
 );
 }
 
 
 async getOrganizationPaymentsByOrganizationId(organization_id: string,): Promise<TOrganizationPaymentSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(organizationsPayments)
 .where(eq(
 organizationsPayments.organization_payment_organization_id,
 organization_id
 ),),
 'operation: get_organization_payments_by_organization_id',
 );
 }
 
 
 async updateOrganizationPaymentById(
 organization_id: string,
 payment_id: string,
 paymentUpdates: Omit<TOrganizationPaymentUpdate, 'organization_payment_id' | 'organization_payment_organization_id'>,
 ): Promise<TOrganizationPaymentSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .update(organizationsPayments)
 .set(paymentUpdates)
 .where(and(
 eq(
 organizationsPayments.organization_payment_organization_id,
 organization_id
 ),
 eq(
 organizationsPayments.organization_payment_id,
 payment_id
 ),
 ),);
 return tx
 .select()
 .from(organizationsPayments)
 .where(eq(
 organizationsPayments.organization_payment_organization_id,
 organization_id
 ),);
 });
 return this.logger.logAndReturn(
 result,
 'operation: update_organization_payment_by_id',
 );
 }
 
 
 async addClientPayment(
 organization_id: string,
 client_id: string,
 paymentDetails: Omit<TClientPaymentInsert, 'client_payment_organization_id' | 'client_payment_client_id'>,
 ): Promise<TClientPaymentSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx.insert(clientsPayments)
 .values(paymentDetails);
 return tx
 .select()
 .from(clientsPayments)
 .where(
 and(
 eq(
 clientsPayments.client_payment_organization_id,
 organization_id
 ),
 eq(
 clientsPayments.client_payment_client_id,
 client_id
 )
 ));
 });
 return this.logger.logAndReturn(
 result,
 'operation: add_client_payment'
 );
 }
 
 
 async getClientPaymentById(payment_id: string,): Promise<TClientPaymentSelect> {
 const result = await this.driver
 .select()
 .from(clientsPayments)
 .where(eq(
 clientsPayments.client_payment_id,
 payment_id
 ))
 .limit(1);
 return this.logger.logAndReturn(
 result[0],
 'operation: get_client_payment_by_id',
 );
 }
 
 
 async getClientPaymentsByClientId(client_id: string,): Promise<TClientPaymentSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(clientsPayments)
 .where(eq(
 clientsPayments.client_payment_client_id,
 client_id
 )),
 'operation: get_client_payments_by_client_id',
 );
 }
 
 
 async updateClientPaymentById(
 organization_id: string,
 payment_id: string,
 clientPaymentUpdates: Omit<TClientPaymentUpdate, 'client_payment_id' | 'client_payment_organization_id' | 'client_payment_client_id'>,
 ): Promise<TClientPaymentSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx
 .update(clientsPayments)
 .set(clientPaymentUpdates)
 .where(and(
 eq(
 clientsPayments.client_payment_organization_id,
 organization_id
 ),
 eq(
 clientsPayments.client_payment_id,
 payment_id
 ),
 ),);
 return tx
 .select()
 .from(clientsPayments)
 .where(eq(
 clientsPayments.client_payment_organization_id,
 organization_id
 ),);
 });
 return this.logger.logAndReturn(
 result,
 'operation: update_client_payment_by_id',
 );
 }
 
 
 async addSale(
 organization_id: string,
 employee_id: string,
 saleDetails: TSaleInsert
 ): Promise<TSaleSelect[]> {
 const result = await this.driver.transaction(async (tx) => {
 await tx.insert(sales)
 .values(saleDetails);
 return tx
 .select()
 .from(sales)
 .where(eq(
 sales.sale_organization_id,
 saleDetails.sale_organization_id
 ),);
 });
 return this.logger.logAndReturn(
 result,
 'operation: add_sale_item'
 );
 }
 
 
 async getSaleById(sale_id: string): Promise<TSaleSelect> {
 const result = await this.driver
 .select()
 .from(sales)
 .where(eq(
 sales.sale_id,
 sale_id
 ));
 return this.logger.logAndReturn(
 result[0],
 'operation: view_sale_by_id'
 );
 }
 
 
 async getSalesByEmployeeId(employee_id: string): Promise<TSaleSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(sales)
 .where(eq(
 sales.sale_employee_id,
 employee_id
 )),
 'operation: get_sales_by_employee_id',
 );
 }
 
 
 async getSalesByItemId(item_id: string): Promise<TSaleSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(sales)
 .where(eq(
 sales.sale_item_id,
 item_id
 )),
 'operation: get_sales_by_item_id',
 );
 }
 
 
 async getSalesByOrganizationId(organization_id: string,): Promise<TSaleSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(sales)
 .where(eq(
 sales.sale_organization_id,
 organization_id
 )),
 'operation: get_sales_by_organization_id',
 );
 }
 
 
 async getSalesByClientId(client_id: string): Promise<TSaleSelect[]> {
 return this.logger.logAndReturn(
 await this.driver
 .select()
 .from(sales)
 .where(eq(
 sales.sale_client_id,
 client_id
 )),
 'operation: get_sales_by_client_id',
 );
 }
 
 
 async getSalesByDate(
 organization_id: string,
 date: number,
 ): Promise<TSaleSelect[]> {
 const result = await this.driver
 .select()
 .from(sales)
 .where(and(
 eq(
 sales.sale_organization_id,
 organization_id
 ),
 eq(
 sales.sale_date,
 date
 ),
 ),);
 return this.logger.logAndReturn(
 result,
 'operation: get_sales_by_date'
 );
 }
 
 
 async getSalesWithinDates(
 organization_id: string,
 date_start: number,
 date_end: number,
 ): Promise<TSaleSelect[]> {
 const result = await this.driver
 .select()
 .from(sales)
 .where(and(
 eq(
 sales.sale_organization_id,
 organization_id
 ),
 between(
 sales.sale_date,
 date_start,
 date_end
 ),
 ),);
 return this.logger.logAndReturn(
 result,
 'operation: get_sales_within_dates',
 );
 }
 
 
 async updateSaleById(
 organization_id: string, sale_id: string,
 saleUpdates: Omit<TSaleUpdate, 'sale_id' | 'sale_organization_id' | 'sale_employee_id'>
 ): Promise<TSaleSelect[]> {
 await this.driver.update(sales)
 .set(saleUpdates)
 .where(
 and(
 eq(
 sales.sale_organization_id,
 organization_id
 ),
 eq(
 sales.sale_id,
 sale_id
 )
 )
 )
 
 const organizationSales = await this.driver.select()
 .from(sales)
 .where(eq(
 sales.sale_organization_id,
 organization_id
 ))
 
 return this.logger.logAndReturn(
 organizationSales,
 'operation: update_sale_by_id'
 )
 }
 }
 */