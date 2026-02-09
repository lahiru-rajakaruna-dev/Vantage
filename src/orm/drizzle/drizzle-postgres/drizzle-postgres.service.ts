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
import {
    drizzle,
    PostgresJsDatabase
}                                from 'drizzle-orm/postgres-js';
import postgres                  from 'postgres';
import { v4 as uuid }            from 'uuid';
import type ILoggerService       from '../../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../../logger/logger_factory/logger_factory.service';
import { EEnvVars }              from '../../../types';
import AbstractDrizzlerService   from '../abstract_drizzle.service';
import * as schema               from './schema';
import {
    clients,
    clientsPayments,
    employees,
    employeesActivities,
    employeesAttendances,
    employeesCredentials,
    employeesSalaries,
    items,
    organizations,
    organizationsPayments,
    sales,
    salesGroups,
    TClientData,
    TClientPaymentData,
    TClientPaymentSelect,
    TClientPaymentUpdate,
    TClientSelect,
    TClientUpdate,
    TEmployeeActivityData,
    TEmployeeActivitySelect,
    TEmployeeAttendanceSelect,
    TEmployeeAttendanceUpdate,
    TEmployeeCredentialsData,
    TEmployeeCredentialsSelect,
    TEmployeeCredentialsUpdate,
    TEmployeeSalarySelect,
    TEmployeeSalaryUpdate,
    TEmployeeSelect,
    TEmployeeUpdate,
    TItemData,
    TItemSelect,
    TItemUpdate,
    TOrganizationData,
    TOrganizationPaymentData,
    TOrganizationPaymentSelect,
    TOrganizationPaymentUpdate,
    TOrganizationSelect,
    TOrganizationUpdate,
    TSaleData,
    TSaleSelect,
    TSalesGroupData,
    TSalesGroupSelect,
    TSalesGroupUpdate,
    TSaleUpdate
}                                from './schema';



@Injectable()
export class DrizzlePostgresService extends AbstractDrizzlerService {
    private readonly driver: PostgresJsDatabase<typeof schema>;
    
    
    constructor(
        configService: ConfigService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService,
    ) {
        super(
            configService,
            logger
        );
        
        const pgDriver = postgres(this.configService.get(EEnvVars.POSTGRES_URL) as string,);
        this.driver    = drizzle(
            pgDriver,
            {
                schema: schema,
            }
        );
    }
    
    
    async addOrganization(
        organization_id: string,
        organization_admin_id: string,
        organization_stripe_customer_id: string,
        organizationDetails: TOrganizationData
    ): Promise<TOrganizationSelect> {
        const result = await this.driver.transaction(async (tx) => {
            return tx.insert(organizations)
                     .values({
                                 ...organizationDetails,
                                 organization_id                : organization_id,
                                 organization_admin_id          : organization_admin_id,
                                 organization_stripe_customer_id: organization_stripe_customer_id
                             })
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
        employee_id: string,
        currentMonth: number,
        currentYear: number,
        employeeCredentials: TEmployeeCredentialsData
    ): Promise<TEmployeeSelect[]> {
        
        const result = await this.driver.transaction(async (tx) => {
            
            const employeeRecord = (await tx.insert(employees)
                                            .values({
                                                        employee_id                 : employee_id,
                                                        employee_first_name         : null,
                                                        employee_last_name          : null,
                                                        employee_registration_date  : Date.now(),
                                                        employee_active_territory   : null,
                                                        employee_phone              : null,
                                                        employee_nic_number         : employeeCredentials.employee_credential_username,
                                                        employee_organization_id    : organization_id,
                                                        employee_sales_group_id     : null,
                                                        employee_profile_picture_url: null // Added missing field
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
            
            await tx.insert(employeesAttendances)
                    .values({
                                employee_attendance_id             : uuid()
                                    .toString(),
                                employee_attendance_organization_id: organization_id,
                                employee_attendance_employee_id    : employeeRecord.employee_id,
                                employee_attendance_month          : currentMonth,
                                employee_attendance_year           : currentYear
                            })
            
            await tx.insert(employeesSalaries)
                    .values({
                                employee_salary_id                   : uuid()
                                    .toString(),
                                employee_salary_organization_id      : organization_id,
                                employee_salary_employee_id          : employeeRecord.employee_id,
                                employee_salary_base                 : 30_000,
                                employee_salary_commission_percentage: 0
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
    
    
    async addEmployeeActivity(
        organization_id: string,
        employee_id: string,
        activity_id: string,
        employeeActivityData: TEmployeeActivityData
    ): Promise<TEmployeeActivitySelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(employeesActivities)
                    .values({
                                ...employeeActivityData,
                                employee_activity_organization_id: organization_id,
                                employee_activity_employee_id    : employee_id,
                                employee_activity_id             : activity_id,
                            });
            
            return tx.select()
                     .from(employeesActivities)
                     .where(and(
                         eq(
                             employeesActivities.employee_activity_organization_id,
                             organization_id
                         ),
                         eq(
                             employeesActivities.employee_activity_employee_id,
                             employee_id
                         )
                     ));
        })
        
        return this.logger.logAndReturn(
            result,
            'operation:' + ' add_employee_activity'
        )
    }
    
    
    async getEmployeeProfileById(
        organization_id: string,
        employee_id: string
    ): Promise<TEmployeeSelect & {
        employee_sales: TSaleSelect[];
        employee_leaves: TEmployeeAttendanceSelect;
        employee_salary: TEmployeeSalarySelect
    }> {
        const result = await this.driver.transaction(async (tx) => {
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
                                           .where(and(
                                               eq(
                                                   sales.sale_organization_id,
                                                   organization_id
                                               ),
                                               eq(
                                                   sales.sale_employee_id,
                                                   employee.employee_id
                                               )
                                           ))
                                           .orderBy(sales.sale_date)
            
            const employee_leaves = await tx.select()
                                            .from(employeesAttendances)
                                            .where(and(
                                                eq(
                                                    employeesAttendances.employee_attendance_organization_id,
                                                    organization_id
                                                ),
                                                eq(
                                                    employeesAttendances.employee_attendance_employee_id,
                                                    employee.employee_id
                                                )
                                            ))
            
            const employee_salary = await tx.select()
                                            .from(employeesSalaries)
                                            .where(and(
                                                eq(
                                                    employeesSalaries.employee_salary_organization_id,
                                                    organization_id
                                                ),
                                                eq(
                                                    employeesSalaries.employee_salary_employee_id,
                                                    employee.employee_id
                                                )
                                            ))
            
            employee['employee_sales']  = employee_sales;
            employee['employee_leaves'] = employee_leaves[0];
            employee['employee_salary'] = employee_salary[0];
            
            return employee as TEmployeeSelect & {
                employee_sales: TSaleSelect[],
                employee_leaves: TEmployeeAttendanceSelect,
                employee_salary: TEmployeeSalarySelect
            }
        })
        
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
        employeeUpdates: TEmployeeUpdate,
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
        employeeUpdates: TEmployeeUpdate,
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
        organization_id: string,
        employee_id: string,
        credentialUpdates: TEmployeeCredentialsUpdate
    ): Promise<TEmployeeCredentialsSelect> {
        const result = await this.driver.update(employeesCredentials)
                                 .set(credentialUpdates)
                                 .where(and(
                                     eq(
                                         employeesCredentials.employee_credential_organization_id,
                                         organization_id
                                     ),
                                     eq(
                                         employeesCredentials.employee_credential_employee_id,
                                         employee_id
                                     )
                                 ))
                                 .returning()
        
        return this.logger.logAndReturn(
            result[0],
            'operation: update_employee_credentials'
        )
        
    }
    
    
    async getEmployeeAttendance(
        organization_id: string,
        employee_id: string
    ): Promise<TEmployeeAttendanceSelect> {
        const result = await this.driver.select()
                                 .from(employeesAttendances)
                                 .where(and(
                                     eq(
                                         employeesAttendances.employee_attendance_organization_id,
                                         organization_id
                                     ),
                                     eq(
                                         employeesAttendances.employee_attendance_employee_id,
                                         employee_id
                                     )
                                 ))
        
        return this.logger.logAndReturn(
            result[0],
            'operation: update_employee_leave'
        )
    }
    
    
    async updateEmployeeAttendance(
        organization_id: string,
        employee_id: string,
        employeeAttendanceUpdates: TEmployeeAttendanceUpdate
    ): Promise<TEmployeeAttendanceSelect> {
        const result = await this.driver.update(employeesAttendances)
                                 .set(employeeAttendanceUpdates)
                                 .where(and(
                                     eq(
                                         employeesAttendances.employee_attendance_organization_id,
                                         organization_id
                                     ),
                                     eq(
                                         employeesAttendances.employee_attendance_employee_id,
                                         employee_id
                                     )
                                 ))
                                 .returning()
        
        return this.logger.logAndReturn(
            result[0],
            'operation: update_employee_leave'
        )
    }
    
    
    async updateEmployeeSalary(
        organization_id: string,
        employee_id: string,
        employeeSalaryUpdates: TEmployeeSalaryUpdate
    ): Promise<TEmployeeSalarySelect> {
        const result = await this.driver.update(employeesSalaries)
                                 .set(employeeSalaryUpdates)
                                 .where(and(
                                     eq(
                                         employeesSalaries.employee_salary_organization_id,
                                         organization_id
                                     ),
                                     eq(
                                         employeesSalaries.employee_salary_employee_id,
                                         employee_id
                                     )
                                 ))
                                 .returning()
        
        return this.logger.logAndReturn(
            result[0],
            'operation: update_employee_salary'
        )
    }
    
    
    async addItem(
        organization_id: string,
        item_id: string,
        itemDetails: TItemData
    ): Promise<TItemSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(items)
                    .values({
                                ...itemDetails,
                                item_organization_id: organization_id,
                                item_id             : item_id,
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
    
    
    async getItemsByOrganizationId(organization_id: string): Promise<TItemSelect[]> {
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
        itemUpdates: TItemUpdate,
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
        itemUpdates: TItemUpdate,
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
        sales_group_id: string,
        salesGroupDetails: TSalesGroupData
    ): Promise<TSalesGroupSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(salesGroups)
                    .values({
                                ...salesGroupDetails,
                                sales_group_organization_id: organization_id,
                                sales_group_id             : sales_group_id
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
    ): Promise<TSalesGroupSelect> {
        
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
                                            .from(employeesAttendances)
                                            .where(and(
                                                eq(
                                                    employeesAttendances.employee_attendance_organization_id,
                                                    organization_id
                                                ),
                                                inArray(
                                                    employeesAttendances.employee_attendance_employee_id,
                                                    employees_ids
                                                )
                                            ))
            
            return {
                ...sales_group[0],
                sales_group_employees: sales_group_employees.map((employee) => {
                    return {
                        ...employee,
                        employee_sales : employee_sales.filter((sale) => (sale.sale_employee_id === employee.employee_id)),
                        employee_leaves: employee_leaves.find((leave) => (leave.employee_attendance_employee_id === employee.employee_id))!
                    }
                    
                }) as (TEmployeeSelect & {
                    employee_sales: TSaleSelect[];
                    employee_leaves: TEmployeeAttendanceSelect
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
        salesGroupUpdates: TSalesGroupUpdate,
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
        client_id: string,
        clientDetails: TClientData
    ): Promise<TClientSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(clients)
                    .values({
                                ...clientDetails,
                                client_organization_id: organization_id,
                                client_id             : client_id
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
                                 ));
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
        clientUpdates: TClientUpdate,
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
        clientUpdates: TClientUpdate,
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
        organization_payment_id: string,
        paymentDetails: TOrganizationPaymentData,
    ): Promise<TOrganizationPaymentSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(organizationsPayments)
                    .values({
                                ...paymentDetails,
                                organization_payment_organization_id: organization_id,
                                organization_payment_id             : organization_payment_id
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
        paymentUpdates: TOrganizationPaymentUpdate,
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
        client_payment_id: string,
        paymentDetails: TClientPaymentData
    ): Promise<TClientPaymentSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(clientsPayments)
                    .values({
                                ...paymentDetails,
                                client_payment_organization_id: organization_id,
                                client_payment_client_id      : client_payment_id,
                                client_payment_id             : client_id,
                            });
            return tx
                .select()
                .from(clientsPayments)
                .where(and(
                    eq(
                        clientsPayments.client_payment_organization_id,
                        organization_id
                    ),
                    eq(
                        clientsPayments.client_payment_client_id,
                        client_payment_id
                    ),
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: add_client_payment'
        );
    }
    
    
    async getClientPaymentById(
        organization_id: string,
        payment_id: string
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
        const result = await this.driver
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
                                 ));
        return this.logger.logAndReturn(
            result,
            'operation: get_client_payments_by_client_id',
        );
    }
    
    
    async updateClientPaymentById(
        organization_id: string,
        payment_id: string,
        clientPaymentUpdates: TClientPaymentUpdate,
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
        sale_id: string,
        saleDetails: TSaleData
    ): Promise<TSaleSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(sales)
                    .values({
                                ...saleDetails,
                                sale_organization_id: organization_id,
                                sale_employee_id    : sale_id,
                                sale_id             : employee_id
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
        employee_id: string
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
    
    
    async getSalesByOrganizationId(organization_id: string): Promise<TSaleSelect[]> {
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
        client_id: string
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
        saleUpdates: TSaleUpdate,
    ): Promise<TSaleSelect[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.update(sales)
                    .set(saleUpdates)
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
            
            return await tx.select()
                           .from(sales)
                           .where(eq(
                               sales.sale_organization_id,
                               organization_id
                           ),);
        });
        
        return this.logger.logAndReturn(
            result,
            'operation: update_sale_by_id'
        );
    }
}
