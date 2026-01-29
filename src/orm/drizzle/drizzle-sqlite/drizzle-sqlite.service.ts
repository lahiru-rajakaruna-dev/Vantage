import { Inject, Injectable }  from '@nestjs/common';
import { ConfigService }       from '@nestjs/config';
import { and, between, eq }    from 'drizzle-orm';
import { drizzle }             from 'drizzle-orm/libsql/node';
import type ILoggerService     from '../../../logger/logger.interface';
import {
  TOKEN__LOGGER_FACTORY
}                              from '../../../logger/logger_factory/logger_factory.service';
import { EEnvVars }            from '../../../types';
import { TEmployee, TSale }    from '../../orm.interface';
import AbstractDrizzlerService from '../abstract_drizzle.service';
import * as schema             from './drizzle-sqlite.schema';
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
}                              from './drizzle-sqlite.schema';



@Injectable()
export class DrizzleSqliteService extends AbstractDrizzlerService {
  protected driver: ReturnType<typeof drizzle<typeof schema>>;

  constructor(
    @Inject() configService: ConfigService,
    @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
  ) {
    super(configService, logger);

    this.driver = drizzle({
      connection: {
        url: this.configService.get(EEnvVars.SQLITE_URL) as string,
      },
      schema: schema,
    });
  }

  async addOrganization(
    organizationDetails: TSQLiteOrganization,
  ): Promise<TSQLiteOrganization> {
    const result = await this.driver
      .insert(organizations)
      .values(organizationDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async updateOrganizationById(
    organization_id: string,
    organizationUpdates: Partial<TSQLiteOrganization>,
  ): Promise<TSQLiteOrganization> {
    const result = await this.driver
      .update(organizations)
      .set(organizationUpdates)
      .where(eq(organizations.organization_id, organization_id))
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getOrganizationDetailsById(
    organization_id: string,
  ): Promise<TSQLiteOrganization> {
    const result = await this.driver
      .select()
      .from(organizations)
      .where(eq(organizations.organization_id, organization_id));
    return this.logger.logAndReturn(result[0]);
  }

  async getOrganizationDetailsByAdminId(
    admin_id: string,
  ): Promise<TSQLiteOrganization> {
    const result = await this.driver
      .select()
      .from(organizations)
      .where(eq(organizations.organization_admin_id, admin_id));
    return this.logger.logAndReturn(result[0]);
  }

  async addEmployee(
    employeeDetails: TSQLiteEmployee,
  ): Promise<TSQLiteEmployee> {
    const result = await this.driver
      .insert(employees)
      .values(employeeDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async viewEmployeeById(employee_id: string): Promise<TSQLiteEmployee> {
    const result = await this.driver
      .select()
      .from(employees)
      .where(eq(employees.employee_id, employee_id));
    return this.logger.logAndReturn(result[0]);
  }

  async getEmployeesByOrganizationId(
    organization_id: string,
  ): Promise<TSQLiteEmployee[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(employees)
        .where(eq(employees.employee_organization_id, organization_id)),
    );
  }

  async getEmployeesBySalesGroupId(
    sales_group_id: string,
  ): Promise<TSQLiteEmployee[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(employees)
        .where(eq(employees.employee_sales_group_id, sales_group_id)),
    );
  }

  async updateEmployeeById(
    organization_id: string,
    employee_id: string,
    employeeUpdates: Partial<TSQLiteEmployee>,
  ): Promise<TSQLiteEmployee> {
    const result = await this.driver
      .update(employees)
      .set(employeeUpdates)
      .where(
        and(
          eq(employees.employee_organization_id, organization_id),
          eq(employees.employee_id, employee_id),
        ),
      )
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async deleteEmployeeById(employee_id: string): Promise<TSQLiteEmployee> {
    const result = await this.driver
      .delete(employees)
      .where(eq(employees.employee_id, employee_id))
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async addItem(itemDetails: TSQLiteItem): Promise<TSQLiteItem> {
    const result = await this.driver
      .insert(items)
      .values(itemDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async viewItemById(item_id: string): Promise<TSQLiteItem> {
    const result = await this.driver
      .select()
      .from(items)
      .where(eq(items.item_id, item_id));
    return this.logger.logAndReturn(result[0]);
  }

  async getItemsByOrganizationId(
    organization_id: string,
  ): Promise<TSQLiteItem[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(items)
        .where(eq(items.item_organization_id, organization_id)),
    );
  }

  async updateItemById(
    organization_id: string,
    item_id: string,
    itemUpdates: Partial<TSQLiteItem>,
  ): Promise<TSQLiteItem> {
    const result = await this.driver
      .update(items)
      .set(itemUpdates)
      .where(
        and(
          eq(items.item_organization_id, organization_id),
          eq(items.item_id, item_id),
        ),
      )
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async deleteItemById(item_id: string): Promise<TSQLiteItem> {
    const result = await this.driver
      .delete(items)
      .where(eq(items.item_id, item_id))
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async addSalesGroup(
    salesGroupDetails: TSQLiteSalesGroup,
  ): Promise<TSQLiteSalesGroup> {
    const result = await this.driver
      .insert(salesGroups)
      .values(salesGroupDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getSalesGroupsByOrganizationId(
    organization_id: string,
  ): Promise<TSQLiteSalesGroup[]> {
    const result = await this.driver
      .select()
      .from(salesGroups)
      .where(eq(salesGroups.sales_group_organization_id, organization_id));
    return this.logger.logAndReturn(result);
  }

  async getSalesGroupDetailsById(
    organization_id: string,
    sales_group_id: string,
  ): Promise<
    TSQLiteSalesGroup & {
      sales_group_employees: Array<
        TEmployee & { employee_sales: Array<TSale> }
      >;
    }
  > {
    const sales_group_details = await this.driver
      .select()
      .from(salesGroups)
      .where(
        and(
          eq(salesGroups.sales_group_organization_id, organization_id),
          eq(salesGroups.sales_group_id, sales_group_id),
        ),
      )[0];

    this.logger.log(sales_group_details);

    const sales_group_employees = await this.driver
      .select({
        employee_id: employees.employee_id,
        employee_username: employees.employee_username,
      })
      .from(employees)
      .where(
        and(
          eq(employees.employee_organization_id, organization_id),
          eq(employees.employee_sales_group_id, sales_group_id),
        ),
      );

    this.logger.log(sales_group_employees);

    const employees_with_sales = await Promise.all(
      sales_group_employees.map(async (employee) => {
        const employee_sales = await this.driver
          .select()
          .from(sales)
          .where(
            and(
              eq(sales.sale_organization_id, organization_id),
              eq(sales.sale_employee_id, employee.employee_id),
            ),
          );

        employee['employee_sales'] = employee_sales;

        return employee as typeof employee & { employee_sales: TSale[] };
      }),
    );

    this.logger.log(employees_with_sales);

    return this.logger.logAndReturn({
      ...sales_group_details,
      sales_group_employees: employees_with_sales,
    });
  }

  async updateSalesGroupById(
    organization_id: string,
    sales_group_id: string,
    salesGroupUpdates: Partial<TSQLiteSalesGroup>,
  ): Promise<TSQLiteSalesGroup> {
    const result = await this.driver
      .update(salesGroups)
      .set(salesGroupUpdates)
      .where(
        and(
          eq(salesGroups.sales_group_organization_id, organization_id),
          eq(salesGroups.sales_group_id, sales_group_id),
        ),
      )
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async deleteSalesGroupById(
    organization_id: string,
    sales_group_id: string,
  ): Promise<TSQLiteSalesGroup> {
    const result = await this.driver
      .delete(salesGroups)
      .where(
        and(
          eq(salesGroups.sales_group_organization_id, organization_id),
          eq(salesGroups.sales_group_id, sales_group_id),
        ),
      )
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async addClient(clientDetails: TSQLiteClient): Promise<TSQLiteClient> {
    const result = await this.driver
      .insert(clients)
      .values(clientDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getClientProfileById(organization_id: string): Promise<TSQLiteClient> {
    const result = await this.driver
      .select()
      .from(clients)
      .where(eq(clients.client_organization_id, organization_id))
      .limit(1);

    return this.logger.logAndReturn(result[0]);
  }

  async getClientsByOrganizationId(
    organization_id: string,
  ): Promise<TSQLiteClient[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(clients)
        .where(eq(clients.client_organization_id, organization_id)),
    );
  }

  async updateClientById(
    organization_id: string,
    client_id: string,
    clientUpdates: Partial<TSQLiteClient>,
  ): Promise<TSQLiteClient> {
    const result = await this.driver
      .update(clients)
      .set(clientUpdates)
      .where(
        and(
          eq(clients.client_organization_id, organization_id),
          eq(clients.client_id, client_id),
        ),
      )
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async addOrganizationPayment(
    paymentDetails: TSQLiteOrganizationPayment,
  ): Promise<TSQLiteOrganizationPayment> {
    const result = await this.driver
      .insert(organizationsPayments)
      .values(paymentDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getOrganizationPaymentsByOrganizationId(
    organization_id: string,
  ): Promise<TSQLiteOrganizationPayment[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(organizationsPayments)
        .where(
          eq(organizationsPayments.payment_organization_id, organization_id),
        ),
    );
  }

  async updateOrganizationPaymentById(
    organization_id: string,
    payment_id: string,
    paymentUpdates: Partial<TSQLiteOrganizationPayment>,
  ): Promise<TSQLiteOrganizationPayment> {
    const result = await this.driver
      .update(organizationsPayments)
      .set(paymentUpdates)
      .where(
        and(
          eq(organizationsPayments.payment_organization_id, organization_id),
          eq(organizationsPayments.payment_id, payment_id),
        ),
      )
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async addClientPayment(
    paymentDetails: TSQLiteClientPayment,
  ): Promise<TSQLiteClientPayment> {
    const result = await this.driver
      .insert(clientsPayments)
      .values(paymentDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getClientPaymentById(
    payment_id: string,
  ): Promise<TSQLiteClientPayment> {
    const result = await this.driver
      .select()
      .from(clientsPayments)
      .where(eq(clientsPayments.client_payment_id, payment_id))
      .limit(1);

    return this.logger.logAndReturn(result[0]);
  }

  async getClientPaymentsByClientId(
    client_id: string,
  ): Promise<TSQLiteClientPayment[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(clientsPayments)
        .where(eq(clientsPayments.client_payment_client_id, client_id)),
    );
  }

  async updateClientPaymentById(
    organization_id: string,
    client_payment_id: string,
    clientPaymentUpdates: Partial<TSQLiteClientPayment>,
  ): Promise<TSQLiteClientPayment> {
    const result = await this.driver
      .update(clientsPayments)
      .set(clientPaymentUpdates)
      .where(
        and(
          eq(clientsPayments.client_payment_organization_id, organization_id),
          eq(clientsPayments.client_payment_id, client_payment_id),
        ),
      )
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async addSaleItem(saleDetails: TSQLiteSale): Promise<TSQLiteSale> {
    const result = await this.driver
      .insert(sales)
      .values(saleDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async viewSaleById(sale_id: string): Promise<TSQLiteSale> {
    const result = await this.driver
      .select()
      .from(sales)
      .where(eq(sales.sale_id, sale_id));
    return this.logger.logAndReturn(result[0]);
  }

  async getSalesByEmployeeId(employee_id: string): Promise<TSQLiteSale[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_employee_id, employee_id)),
    );
  }

  async getSalesByItemId(item_id: string): Promise<TSQLiteSale[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_item_id, item_id)),
    );
  }

  async getSalesByOrganizationId(
    organization_id: string,
  ): Promise<TSQLiteSale[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_organization_id, organization_id)),
    );
  }

  async getSalesByClientId(client_id: string): Promise<TSQLiteSale[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_client_id, client_id)),
    );
  }

  async getSalesByDate(
    organization_id: string,
    date: number,
  ): Promise<TSQLiteSale[]> {
    const result = await this.driver
      .select()
      .from(sales)
      .where(
        and(
          eq(sales.sale_organization_id, organization_id),
          eq(sales.sale_date, date),
        ),
      );

    return this.logger.logAndReturn(result);
  }

  async getSalesWithinDates(
    organization_id: string,
    date_start: number,
    date_end: number,
  ): Promise<TSQLiteSale[]> {
    const result = await this.driver
      .select()
      .from(sales)
      .where(
        and(
          eq(sales.sale_organization_id, organization_id),
          between(sales.sale_date, date_start, date_end),
        ),
      );

    return this.logger.logAndReturn(result);
  }
}
