import { createClient }              from '@libsql/client';
import { Inject, Injectable }        from '@nestjs/common';
import { ConfigService }             from '@nestjs/config';
import { and, between, eq, inArray } from 'drizzle-orm';
import { drizzle }                   from 'drizzle-orm/libsql/node';
import type ILoggerService           from '../../../logger/logger.interface';
import {
    TOKEN__LOGGER_FACTORY
}                                    from '../../../logger/logger_factory/logger_factory.service';
import { EEnvVars }                  from '../../../types';
import {
    TClient,
    TClientPayment,
    TEmployee,
    TItem,
    TOrganization,
    TOrganizationPayment,
    TSale,
    TSalesGroup,
}                                    from '../../orm.interface';
import AbstractDrizzlerService       from '../abstract_drizzle.service';
import * as schema                   from './drizzle-sqlite.schema';
import {
    clients,
    clientsPayments,
    employees,
    items,
    organizations,
    organizationsPayments,
    sales,
    salesGroups,
    TSQLiteClient,
    TSQLiteClientPayment,
    TSQLiteEmployee,
    TSQLiteItem,
    TSQLiteOrganization,
    TSQLiteOrganizationPayment,
    TSQLiteSale,
    TSQLiteSalesGroup
}                                    from './drizzle-sqlite.schema';



@Injectable()
export class DrizzleSqliteService extends AbstractDrizzlerService {
    protected driver: ReturnType<typeof drizzle<typeof schema>>;
    
    
    constructor(
        @Inject() configService: ConfigService,
        @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
    ) {
        super(configService, logger);
        
        const sqliteClient = createClient({
                                              url: this.configService.get(
                                                  EEnvVars.SQLITE_URL) as string,
                                          });
        
        sqliteClient.execute('PRAGMA journal_mode = WAL;');
        
        this.driver = drizzle(sqliteClient, {
            schema: schema,
        });
    }
    
    
    async addOrganization(organizationDetails: TOrganization,): Promise<TOrganization> {
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
        organizationUpdates: Partial<TOrganization>,
    ): Promise<TOrganization> {
        const result = await this.driver.transaction(async (tx) => {
            return tx
                .update(organizations)
                .set(organizationUpdates)
                .where(eq(organizations.organization_id, organization_id))
                .returning();
        });
        return this.logger.logAndReturn(
            result[0],
            'operation: update_organization_by_id',
        );
    }
    
    
    async getOrganizationDetailsById(organization_id: string,): Promise<TSQLiteOrganization> {
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
    
    
    async getOrganizationDetailsByAdminId(admin_id: string,): Promise<TSQLiteOrganization> {
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
    
    
    async addEmployee(employeeDetails: TEmployee): Promise<TEmployee[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(employees).values(employeeDetails);
            return tx
                .select()
                .from(employees)
                .where(eq(
                    employees.employee_organization_id,
                    employeeDetails.employee_organization_id,
                ),);
        });
        return this.logger.logAndReturn(result, 'operation: add_employee');
    }
    
    
    async viewEmployeeById(employee_id: string): Promise<TSQLiteEmployee> {
        const result = await this.driver
                                 .select()
                                 .from(employees)
                                 .where(eq(employees.employee_id, employee_id));
        return this.logger.logAndReturn(
            result[0],
            'operation: view_employee_by_id',
        );
    }
    
    
    async getEmployeesByOrganizationId(organization_id: string,): Promise<TSQLiteEmployee[]> {
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
    
    
    async getEmployeesBySalesGroupId(sales_group_id: string,): Promise<TSQLiteEmployee[]> {
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
        employeeUpdates: Partial<TEmployee>,
    ): Promise<TEmployee[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(employees)
                .set(employeeUpdates)
                .where(and(
                    eq(
                        employees.employee_organization_id,
                        organization_id
                    ),
                    eq(employees.employee_id, employee_id),
                ),);
            return tx
                .select()
                .from(employees)
                .where(eq(employees.employee_organization_id, organization_id));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_employee_by_id'
        );
    }
    
    
    async updateEmployeesByIds(
        organization_id: string,
        employees_ids: string[],
        employeeUpdates: Partial<TEmployee>,
    ): Promise<TEmployee[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(employees)
                .set(employeeUpdates)
                .where(and(
                    eq(employees.employee_organization_id, organization_id),
                    inArray(employees.employee_id, employees_ids),
                ),);
            return tx
                .select()
                .from(employees)
                .where(eq(employees.employee_organization_id, organization_id));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_employee_by_id'
        );
    }
    
    
    async deleteEmployeeById(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployee[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .delete(employees)
                .where(and(
                    eq(
                        employees.employee_organization_id,
                        organization_id
                    ),
                    eq(employees.employee_id, employee_id),
                ),);
            return tx
                .select()
                .from(employees)
                .where(eq(employees.employee_organization_id, organization_id));
        });
        return this.logger.logAndReturn(
            result,
            'operation: delete_employee_by_id'
        );
    }
    
    
    async addItem(itemDetails: TItem): Promise<TItem[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(items).values(itemDetails);
            return tx
                .select()
                .from(items)
                .where(eq(
                    items.item_organization_id,
                    itemDetails.item_organization_id
                ),);
        });
        return this.logger.logAndReturn(result, 'operation: add_item');
    }
    
    
    async viewItemById(item_id: string): Promise<TSQLiteItem> {
        const result = await this.driver
                                 .select()
                                 .from(items)
                                 .where(eq(items.item_id, item_id));
        return this.logger.logAndReturn(
            result[0],
            'operation: view_item_by_id'
        );
    }
    
    
    async getItemsByOrganizationId(organization_id: string,): Promise<TSQLiteItem[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(items)
                      .where(eq(items.item_organization_id, organization_id)),
            'operation: get_items_by_organization_id',
        );
    }
    
    
    async updateItemById(
        organization_id: string,
        item_id: string,
        itemUpdates: Partial<TSQLiteItem>,
    ): Promise<TItem[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(items)
                .set(itemUpdates)
                .where(and(
                    eq(items.item_organization_id, organization_id),
                    eq(items.item_id, item_id),
                ),);
            return tx
                .select()
                .from(items)
                .where(eq(items.item_organization_id, organization_id));
        });
        return this.logger.logAndReturn(result, 'operation: update_item_by_id');
    }
    
    
    async updateItemsByIds(
        organization_id: string,
        items_ids: string[],
        itemUpdates: Partial<TSQLiteItem>,
    ): Promise<TItem[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(items)
                .set(itemUpdates)
                .where(and(
                    eq(items.item_organization_id, organization_id),
                    inArray(items.item_id, items_ids),
                ),);
            return tx
                .select()
                .from(items)
                .where(eq(items.item_organization_id, organization_id));
        });
        return this.logger.logAndReturn(result, 'operation: update_item_by_id');
    }
    
    
    async deleteItemById(
        organization_id: string,
        item_id: string,
    ): Promise<TItem[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .delete(items)
                .where(and(
                    eq(items.item_organization_id, organization_id),
                    eq(items.item_id, item_id),
                ),);
            return tx
                .select()
                .from(items)
                .where(eq(items.item_organization_id, organization_id));
        });
        return this.logger.logAndReturn(result, 'operation: delete_item_by_id');
    }
    
    
    async deleteItemsByIds(
        organization_id: string,
        items_ids: string[],
    ): Promise<TItem[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .delete(items)
                .where(and(
                    eq(items.item_organization_id, organization_id),
                    inArray(items.item_id, items_ids),
                ),);
            return tx
                .select()
                .from(items)
                .where(eq(items.item_organization_id, organization_id));
        });
        return this.logger.logAndReturn(result, 'operation: delete_item_by_id');
    }
    
    
    async addSalesGroup(salesGroupDetails: TSalesGroup): Promise<TSalesGroup[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(salesGroups).values(salesGroupDetails);
            return tx
                .select()
                .from(salesGroups)
                .where(eq(
                    salesGroups.sales_group_organization_id,
                    salesGroupDetails.sales_group_organization_id,
                ),);
        });
        return this.logger.logAndReturn(result, 'operation: add_sales_group');
    }
    
    
    async getSalesGroupsByOrganizationId(organization_id: string,): Promise<TSQLiteSalesGroup[]> {
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
    ): Promise<TSQLiteSalesGroup & {
        sales_group_employees: Array<TEmployee & {
            employee_sales: Array<TSale>
        }>;
    }> {
        console.log('org:', organization_id, 'sales_group:', sales_group_id);
        const sales_group_details = await this.driver
                                              .select()
                                              .from(salesGroups)
                                              .where(and(eq(
                                                  salesGroups.sales_group_organization_id,
                                                  organization_id
                                              ), eq(
                                                  salesGroups.sales_group_id,
                                                  sales_group_id
                                              ),),)[0];
        console.log('sales_group:', sales_group_details);
        const sales_group_employees = await this.driver
                                                .select({
                                                            employee_id      : employees.employee_id,
                                                            employee_username: employees.employee_username,
                                                        })
                                                .from(employees)
                                                .where(and(eq(
                                                    employees.employee_organization_id,
                                                    organization_id
                                                ), eq(
                                                    employees.employee_sales_group_id,
                                                    sales_group_id
                                                ),),);
        this.logger.log(sales_group_employees);
        const employees_with_sales = await Promise.all(sales_group_employees.map(
            async (employee) => {
                const employee_sales       = await this.driver
                                                       .select()
                                                       .from(sales)
                                                       .where(and(eq(
                                                           sales.sale_organization_id,
                                                           organization_id
                                                       ), eq(
                                                           sales.sale_employee_id,
                                                           employee.employee_id
                                                       ),),);
                employee['employee_sales'] = employee_sales;
                return employee as typeof employee & {
                    employee_sales: TSale[]
                };
            }),);
        this.logger.log(employees_with_sales);
        return this.logger.logAndReturn(
            {
                ...sales_group_details,
                sales_group_employees: employees_with_sales,
            },
            'operation: get_sales_group_details_by_id',
        );
    }
    
    
    async updateSalesGroupById(
        organization_id: string,
        sales_group_id: string,
        salesGroupUpdates: Partial<TSalesGroup>,
    ): Promise<TSalesGroup[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(salesGroups)
                .set(salesGroupUpdates)
                .where(and(
                    eq(
                        salesGroups.sales_group_organization_id,
                        organization_id
                    ),
                    eq(salesGroups.sales_group_id, sales_group_id),
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
    ): Promise<TSalesGroup[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .delete(salesGroups)
                .where(and(
                    eq(
                        salesGroups.sales_group_organization_id,
                        organization_id
                    ),
                    eq(salesGroups.sales_group_id, sales_group_id),
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
    
    
    async addClient(clientDetails: TClient): Promise<TClient[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(clients).values(clientDetails);
            return tx
                .select()
                .from(clients)
                .where(eq(
                    clients.client_organization_id,
                    clientDetails.client_organization_id,
                ),);
        });
        return this.logger.logAndReturn(result, 'operation: add_client');
    }
    
    
    async getClientProfileById(organization_id: string): Promise<TSQLiteClient> {
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
    
    
    async getClientsByOrganizationId(organization_id: string,): Promise<TSQLiteClient[]> {
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
        clientUpdates: Partial<TClient>,
    ): Promise<TClient[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(clients)
                .set(clientUpdates)
                .where(and(
                    eq(clients.client_organization_id, organization_id),
                    eq(clients.client_id, client_id),
                ),);
            return tx
                .select()
                .from(clients)
                .where(eq(clients.client_organization_id, organization_id));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_client_by_id'
        );
    }
    
    
    async updateClientsByIds(
        organization_id: string,
        clients_ids: string[],
        clientUpdates: Partial<TClient>,
    ): Promise<TClient[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(clients)
                .set(clientUpdates)
                .where(and(
                    eq(clients.client_organization_id, organization_id),
                    inArray(clients.client_id, clients_ids),
                ),);
            return tx
                .select()
                .from(clients)
                .where(eq(clients.client_organization_id, organization_id));
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_client_by_id'
        );
    }
    
    
    async addOrganizationPayment(paymentDetails: TOrganizationPayment,): Promise<TOrganizationPayment[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(organizationsPayments).values(paymentDetails);
            return tx
                .select()
                .from(organizationsPayments)
                .where(eq(
                    organizationsPayments.payment_organization_id,
                    paymentDetails.payment_organization_id,
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: add_organization_payment',
        );
    }
    
    
    async getOrganizationPaymentsByOrganizationId(organization_id: string,): Promise<TSQLiteOrganizationPayment[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(organizationsPayments)
                      .where(eq(
                          organizationsPayments.payment_organization_id,
                          organization_id
                      ),),
            'operation: get_organization_payments_by_organization_id',
        );
    }
    
    
    async updateOrganizationPaymentById(
        organization_id: string,
        payment_id: string,
        paymentUpdates: Partial<TOrganizationPayment>,
    ): Promise<TOrganizationPayment[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(organizationsPayments)
                .set(paymentUpdates)
                .where(and(eq(
                    organizationsPayments.payment_organization_id,
                    organization_id
                ), eq(organizationsPayments.payment_id, payment_id),),);
            return tx
                .select()
                .from(organizationsPayments)
                .where(eq(
                    organizationsPayments.payment_organization_id,
                    organization_id
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: update_organization_payment_by_id',
        );
    }
    
    
    async addClientPayment(paymentDetails: TClientPayment,): Promise<TClientPayment[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(clientsPayments).values(paymentDetails);
            return tx
                .select()
                .from(clientsPayments)
                .where(eq(
                    clientsPayments.client_payment_organization_id,
                    paymentDetails.client_payment_organization_id,
                ),);
        });
        return this.logger.logAndReturn(
            result,
            'operation: add_client_payment'
        );
    }
    
    
    async getClientPaymentById(payment_id: string,): Promise<TSQLiteClientPayment> {
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
    
    
    async getClientPaymentsByClientId(client_id: string,): Promise<TSQLiteClientPayment[]> {
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
        client_payment_id: string,
        clientPaymentUpdates: Partial<TClientPayment>,
    ): Promise<TClientPayment[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx
                .update(clientsPayments)
                .set(clientPaymentUpdates)
                .where(and(eq(
                    clientsPayments.client_payment_organization_id,
                    organization_id
                ), eq(
                    clientsPayments.client_payment_id,
                    client_payment_id
                ),),);
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
    
    
    async addSaleItem(saleDetails: TSale): Promise<TSale[]> {
        const result = await this.driver.transaction(async (tx) => {
            await tx.insert(sales).values(saleDetails);
            return tx
                .select()
                .from(sales)
                .where(eq(
                    sales.sale_organization_id,
                    saleDetails.sale_organization_id
                ),);
        });
        return this.logger.logAndReturn(result, 'operation: add_sale_item');
    }
    
    
    async viewSaleById(sale_id: string): Promise<TSQLiteSale> {
        const result = await this.driver
                                 .select()
                                 .from(sales)
                                 .where(eq(sales.sale_id, sale_id));
        return this.logger.logAndReturn(
            result[0],
            'operation: view_sale_by_id'
        );
    }
    
    
    async getSalesByEmployeeId(employee_id: string): Promise<TSQLiteSale[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(sales)
                      .where(eq(sales.sale_employee_id, employee_id)),
            'operation: get_sales_by_employee_id',
        );
    }
    
    
    async getSalesByItemId(item_id: string): Promise<TSQLiteSale[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(sales)
                      .where(eq(sales.sale_item_id, item_id)),
            'operation: get_sales_by_item_id',
        );
    }
    
    
    async getSalesByOrganizationId(organization_id: string,): Promise<TSQLiteSale[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(sales)
                      .where(eq(sales.sale_organization_id, organization_id)),
            'operation: get_sales_by_organization_id',
        );
    }
    
    
    async getSalesByClientId(client_id: string): Promise<TSQLiteSale[]> {
        return this.logger.logAndReturn(
            await this.driver
                      .select()
                      .from(sales)
                      .where(eq(sales.sale_client_id, client_id)),
            'operation: get_sales_by_client_id',
        );
    }
    
    
    async getSalesByDate(
        organization_id: string,
        date: number,
    ): Promise<TSQLiteSale[]> {
        const result = await this.driver
                                 .select()
                                 .from(sales)
                                 .where(and(eq(
                                     sales.sale_organization_id,
                                     organization_id
                                 ), eq(sales.sale_date, date),),);
        return this.logger.logAndReturn(result, 'operation: get_sales_by_date');
    }
    
    
    async getSalesWithinDates(
        organization_id: string,
        date_start: number,
        date_end: number,
    ): Promise<TSQLiteSale[]> {
        const result = await this.driver
                                 .select()
                                 .from(sales)
                                 .where(and(eq(
                                     sales.sale_organization_id,
                                     organization_id
                                 ), between(
                                     sales.sale_date,
                                     date_start,
                                     date_end
                                 ),),);
        return this.logger.logAndReturn(
            result,
            'operation: get_sales_within_dates',
        );
    }
}
