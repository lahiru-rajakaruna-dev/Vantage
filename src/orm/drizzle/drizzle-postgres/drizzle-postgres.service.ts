import { POSTGRES_URL } from './../../../types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import LoggerFactoryService from '../../../logger/logger-factory.service';
import * as schema from './drizzle-postgres.schema';
import DrizzleOrm from '../drizzle-orm.service';
import {
  organizations,
  employees,
  items,
  clients,
  sales,
  salesGroups,
  organizationsPayments,
  clientsPayments,
  TOrganization,
  TEmployee,
  TItem,
  TSale,
  TSalesGroup,
  TClient,
  TOrganizationPayment,
  TClientPayment,
} from './drizzle-postgres.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzlePostgresService extends DrizzleOrm {
  private readonly driver: PostgresJsDatabase<typeof schema>;

  constructor(
    @Inject() configService: ConfigService,
    @Inject() loggerFactory: LoggerFactoryService,
  ) {
    super(configService, loggerFactory);

    const pgDriver = postgres(this.configService.get(POSTGRES_URL) as string);
    this.driver = drizzle(pgDriver, {
      schema: schema,
    });
  }

  async addOrganization(organizationDetails: TOrganization) {
    return this.logger.logAndReturn(
      this.driver.insert(organizations).values(organizationDetails).returning(),
    );
  }

  async updateOrganizationById(
    organization_id: string,
    organizationUpdates: Partial<TOrganization>,
  ) {
    return this.logger.logAndReturn(
      await this.driver
        .update(organizations)
        .set(organizationUpdates)
        .where(eq(organizations.organization_id, organization_id))
        .returning(),
    );
  }

  async getOrganizationDetailsById(organization_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(organizations)
        .where(eq(organizations.organization_id, organization_id)),
    );
  }

  async addEmployee(employeeDetails: TEmployee) {
    return this.logger.logAndReturn(
      await this.driver.insert(employees).values(employeeDetails).returning(),
    );
  }

  async viewEmployeeById(employee_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(employees)
        .where(eq(employees.employee_id, employee_id)),
    );
  }

  async getEmployeesByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(employees)
        .where(eq(employees.employee_organization_id, organization_id)),
    );
  }

  async getEmployeesBySalesGroupId(sales_group_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(employees)
        .where(eq(employees.employee_sales_group_id, sales_group_id)),
    );
  }

  async updateEmployeeById(
    employee_id: string,
    employeeUpdates: Partial<TEmployee>,
  ) {
    return this.logger.logAndReturn(
      await this.driver
        .update(employees)
        .set(employeeUpdates)
        .where(eq(employees.employee_id, employee_id))
        .returning(),
    );
  }

  async deleteEmployeeById(employee_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .delete(employees)
        .where(eq(employees.employee_id, employee_id))
        .returning(),
    );
  }

  async addItem(itemDetails: TItem) {
    return this.logger.logAndReturn(
      await this.driver.insert(items).values(itemDetails).returning(),
    );
  }

  async viewItemById(item_id: string) {
    return this.logger.logAndReturn(
      await this.driver.select().from(items).where(eq(items.item_id, item_id)),
    );
  }

  async getItemsByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(items)
        .where(eq(items.item_organization_id, organization_id)),
    );
  }

  async updateItemById(item_id: string, itemUpdates: Partial<TItem>) {
    return this.logger.logAndReturn(
      await this.driver
        .update(items)
        .set(itemUpdates)
        .where(eq(items.item_id, item_id))
        .returning(),
    );
  }

  async deleteItemById(item_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .delete(items)
        .where(eq(items.item_id, item_id))
        .returning(),
    );
  }

  async addSalesGroup(salesGroupDetails: TSalesGroup) {
    return this.logger.logAndReturn(
      await this.driver
        .insert(salesGroups)
        .values(salesGroupDetails)
        .returning(),
    );
  }

  async getSalesGroupsByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(salesGroups)
        .where(eq(salesGroups.sales_group_organization_id, organization_id)),
    );
  }

  async updateSalesGroupById(
    sales_group_id: string,
    salesGroupUpdates: Partial<TSalesGroup>,
  ) {
    return this.logger.logAndReturn(
      await this.driver
        .update(salesGroups)
        .set(salesGroupUpdates)
        .where(eq(salesGroups.sales_group_id, sales_group_id))
        .returning(),
    );
  }

  async deleteSalesGroupById(sales_group_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .delete(salesGroups)
        .where(eq(salesGroups.sales_group_id, sales_group_id)),
    );
  }

  async addClient(clientDetails: TClient) {
    return this.logger.logAndReturn(
      await this.driver.insert(clients).values(clientDetails).returning(),
    );
  }

  async getClientsByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(clients)
        .where(eq(clients.client_organization_id, organization_id)),
    );
  }

  async updateClientById(client_id: string, clientUpdates: Partial<TClient>) {
    return this.logger.logAndReturn(
      await this.driver
        .update(clients)
        .set(clientUpdates)
        .where(eq(clients.client_id, client_id)),
    );
  }

  async addOrganizationPayment(paymentDetails: TOrganizationPayment) {
    return this.logger.logAndReturn(
      await this.driver
        .insert(organizationsPayments)
        .values(paymentDetails)
        .returning(),
    );
  }

  async getOrganizationPaymentsByOrganizationId(organization_id: string) {
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
    payment_id: string,
    paymentUpdates: Partial<TOrganizationPayment>,
  ) {
    return this.logger.logAndReturn(
      await this.driver
        .update(organizationsPayments)
        .set(paymentUpdates)
        .where(eq(organizationsPayments.payment_organization_id, payment_id)),
    );
  }

  async addClientPayment(paymentDetails: TClientPayment) {
    return this.logger.logAndReturn(
      await this.driver
        .insert(clientsPayments)
        .values(paymentDetails)
        .returning(),
    );
  }

  async getClientPaymentsByClientId(client_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(clientsPayments)
        .where(eq(clientsPayments.client_payment_client_id, client_id)),
    );
  }

  async updateClientPaymentById(
    client_payment_id: string,
    clientPaymentUpdates: Partial<TClientPayment>,
  ) {
    return this.logger.logAndReturn(
      await this.driver
        .update(clientsPayments)
        .set(clientPaymentUpdates)
        .where(eq(clientsPayments.client_payment_id, client_payment_id))
        .returning(),
    );
  }

  async addSaleItem(saleDetails: TSale) {
    return this.logger.logAndReturn(
      await this.driver.insert(sales).values(saleDetails).returning(),
    );
  }

  async viewSaleById(sale_id: string) {
    return this.logger.logAndReturn(
      await this.driver.select().from(sales).where(eq(sales.sale_id, sale_id)),
    );
  }

  async getSalesByEmployeeId(employee_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_employee_id, employee_id)),
    );
  }

  async getSalesByItemId(item_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_item_id, item_id)),
    );
  }

  async getSalesByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_organization_id, organization_id)),
    );
  }

  async getSalesByClientId(client_id: string) {
    return this.logger.logAndReturn(
      await this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_client_id, client_id)),
    );
  }
}
