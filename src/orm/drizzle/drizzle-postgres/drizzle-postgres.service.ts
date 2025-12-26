import { EEnvVars } from '../../../types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './drizzle-postgres.schema';
import {
  clients,
  clientsPayments,
  employees,
  items,
  organizations,
  organizationsPayments,
  sales,
  salesGroups,
  TClient,
  TClientPayment,
  TEmployee,
  TItem,
  TOrganization,
  TOrganizationPayment,
  TSale,
  TSalesGroup,
} from './drizzle-postgres.schema';
import AbstractDrizzlerService from '../abstract_drizzle.service';
import { and, between, eq } from 'drizzle-orm';
import { TOKEN__LOGGER_FACTORY } from '../../../logger/logger_factory/logger_factory.service';
import type ILoggerService from '../../../logger/logger.interface';

@Injectable()
export class DrizzlePostgresService extends AbstractDrizzlerService {
  private readonly driver: PostgresJsDatabase<typeof schema>;

  constructor(
    @Inject() configService: ConfigService,
    @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
  ) {
    super(configService, logger);

    const pgDriver = postgres(
      this.configService.get(EEnvVars.POSTGRES_URL) as string,
    );
    this.driver = drizzle(pgDriver, {
      schema: schema,
    });
  }

  async addOrganization(
    organizationDetails: TOrganization,
  ): Promise<TOrganization> {
    const result = await this.driver
      .insert(organizations)
      .values(organizationDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async updateOrganizationById(
    organization_id: string,
    organizationUpdates: Partial<TOrganization>,
  ): Promise<TOrganization> {
    const result = await this.driver
      .update(organizations)
      .set(organizationUpdates)
      .where(eq(organizations.organization_id, organization_id))
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getOrganizationDetailsById(
    organization_id: string,
  ): Promise<TOrganization> {
    const result = await this.driver
      .select()
      .from(organizations)
      .where(eq(organizations.organization_id, organization_id));
    return this.logger.logAndReturn(result[0]);
  }

  async addEmployee(employeeDetails: TEmployee): Promise<TEmployee> {
    const result = await this.driver
      .insert(employees)
      .values(employeeDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async viewEmployeeById(employee_id: string): Promise<TEmployee> {
    const result = await this.driver
      .select()
      .from(employees)
      .where(eq(employees.employee_id, employee_id));
    return this.logger.logAndReturn(result[0]);
  }

  async getEmployeesByOrganizationId(
    organization_id: string,
  ): Promise<TEmployee[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(employees)
        .where(eq(employees.employee_organization_id, organization_id)),
    );
  }

  async getEmployeesBySalesGroupId(
    sales_group_id: string,
  ): Promise<TEmployee[]> {
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
    employeeUpdates: Partial<TEmployee>,
  ): Promise<TEmployee> {
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

  async deleteEmployeeById(employee_id: string): Promise<TEmployee> {
    const result = await this.driver
      .delete(employees)
      .where(eq(employees.employee_id, employee_id))
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async addItem(itemDetails: TItem): Promise<TItem> {
    const result = await this.driver
      .insert(items)
      .values(itemDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async viewItemById(item_id: string): Promise<TItem> {
    const result = await this.driver
      .select()
      .from(items)
      .where(eq(items.item_id, item_id));
    return this.logger.logAndReturn(result[0]);
  }

  async getItemsByOrganizationId(organization_id: string): Promise<TItem[]> {
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
    itemUpdates: Partial<TItem>,
  ): Promise<TItem> {
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

  async deleteItemById(item_id: string): Promise<TItem> {
    const result = await this.driver
      .delete(items)
      .where(eq(items.item_id, item_id))
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async addSalesGroup(salesGroupDetails: TSalesGroup): Promise<TSalesGroup> {
    const result = await this.driver
      .insert(salesGroups)
      .values(salesGroupDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getSalesGroupsByOrganizationId(
    organization_id: string,
  ): Promise<TSalesGroup> {
    const result = await this.driver
      .select()
      .from(salesGroups)
      .where(eq(salesGroups.sales_group_organization_id, organization_id));
    return this.logger.logAndReturn(result[0]);
  }

  async updateSalesGroupById(
    organization_id: string,
    sales_group_id: string,
    salesGroupUpdates: Partial<TSalesGroup>,
  ): Promise<TSalesGroup> {
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

  async deleteSalesGroupById(sales_group_id: string): Promise<TSalesGroup> {
    const result = await this.driver
      .delete(salesGroups)
      .where(eq(salesGroups.sales_group_id, sales_group_id))
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async addClient(clientDetails: TClient): Promise<TClient> {
    const result = await this.driver
      .insert(clients)
      .values(clientDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getClientProfileById(client_id: string): Promise<TClient> {
    const result = await this.driver
      .select()
      .from(clients)
      .where(eq(clients.client_id, client_id));

    return this.logger.logAndReturn(result[0]);
  }

  async getClientsByOrganizationId(
    organization_id: string,
  ): Promise<TClient[]> {
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
    clientUpdates: Partial<TClient>,
  ): Promise<TClient> {
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
    paymentDetails: TOrganizationPayment,
  ): Promise<TOrganizationPayment> {
    const result = await this.driver
      .insert(organizationsPayments)
      .values(paymentDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getOrganizationPaymentsByOrganizationId(
    organization_id: string,
  ): Promise<TOrganizationPayment[]> {
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
    paymentUpdates: Partial<TOrganizationPayment>,
  ): Promise<TOrganizationPayment> {
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
    paymentDetails: TClientPayment,
  ): Promise<TClientPayment> {
    const result = await this.driver
      .insert(clientsPayments)
      .values(paymentDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async getClientPaymentById(payment_id: string): Promise<TClientPayment> {
    const result = await this.driver
      .select()
      .from(clientsPayments)
      .where(eq(clientsPayments.client_payment_id, payment_id))
      .limit(1);

    return this.logger.logAndReturn(result[0]);
  }

  async getClientPaymentsByClientId(
    client_id: string,
  ): Promise<TClientPayment[]> {
    const result = await this.driver
      .select()
      .from(clientsPayments)
      .where(eq(clientsPayments.client_payment_client_id, client_id));

    return this.logger.logAndReturn(result);
  }

  async updateClientPaymentById(
    organization_id: string,
    client_payment_id: string,
    clientPaymentUpdates: Partial<TClientPayment>,
  ): Promise<TClientPayment> {
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

  async addSaleItem(saleDetails: TSale): Promise<TSale> {
    const result = await this.driver
      .insert(sales)
      .values(saleDetails)
      .returning();
    return this.logger.logAndReturn(result[0]);
  }

  async viewSaleById(sale_id: string): Promise<TSale> {
    const result = await this.driver
      .select()
      .from(sales)
      .where(eq(sales.sale_id, sale_id));
    return this.logger.logAndReturn(result[0]);
  }

  async getSalesByEmployeeId(employee_id: string): Promise<TSale[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_employee_id, employee_id)),
    );
  }

  async getSalesByItemId(item_id: string): Promise<TSale[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_item_id, item_id)),
    );
  }

  async getSalesByOrganizationId(organization_id: string): Promise<TSale[]> {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_organization_id, organization_id)),
    );
  }

  async getSalesByClientId(client_id: string): Promise<TSale[]> {
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
  ): Promise<TSale[]> {
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
  ): Promise<TSale[]> {
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
