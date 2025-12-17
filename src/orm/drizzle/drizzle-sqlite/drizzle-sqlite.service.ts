import { Inject, Injectable } from '@nestjs/common';
import DrizzleOrm from '../drizzle-orm.service';
import { ConfigService } from '@nestjs/config';
import LoggerFactoryService from '../../../logger/logger-factory.service';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './drizzle-sqlite.schema';
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
} from '../drizzle-postgres/drizzle-postgres.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzleSqliteService extends DrizzleOrm {
  protected driver: ReturnType<typeof drizzle<typeof schema>>;

  constructor(
    @Inject() configService: ConfigService,
    @Inject() loggerFactory: LoggerFactoryService,
  ) {
    super(configService, loggerFactory);
    this.driver = drizzle<typeof schema>(
      this.configService.get('SQLITE_DATABASE_URL'),
      {
        schema: schema,
      },
    );
  }

  async addOrganization(organizationDetails: TOrganization) {
    return this.logger.logAndReturn(
      await this.driver
        .insert(organizations)
        .values(organizationDetails)
        .returning(),
    );
  }

  updateOrganizationById(
    organization_id: string,
    organizationUpdates: Partial<TOrganization>,
  ) {
    return this.logger.logAndReturn(
      this.driver
        .update(organizations)
        .set(organizationUpdates)
        .where(eq(organizations.organization_id, organization_id))
        .returning(),
    );
  }

  getOrganizationDetailsById(organization_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(organizations)
        .where(eq(organizations.organization_id, organization_id)),
    );
  }

  addEmployee(employeeDetails: TEmployee) {
    return this.logger.logAndReturn(
      this.driver.insert(employees).values(employeeDetails).returning(),
    );
  }

  viewEmployeeById(employee_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(employees)
        .where(eq(employees.employee_id, employee_id)),
    );
  }

  getEmployeesByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(employees)
        .where(eq(employees.employee_organization_id, organization_id)),
    );
  }

  getEmployeesBySalesGroupId(sales_group_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(employees)
        .where(eq(employees.employee_sales_group_id, sales_group_id)),
    );
  }

  updateEmployeeById(employee_id: string, employeeUpdates: Partial<TEmployee>) {
    return this.logger.logAndReturn(
      this.driver
        .update(employees)
        .set(employeeUpdates)
        .where(eq(employees.employee_id, employee_id))
        .returning(),
    );
  }

  deleteEmployeeById(employee_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .delete(employees)
        .where(eq(employees.employee_id, employee_id))
        .returning(),
    );
  }

  addItem(itemDetails: TItem) {
    return this.logger.logAndReturn(
      this.driver.insert(items).values(itemDetails).returning(),
    );
  }

  viewItemById(item_id: string) {
    return this.logger.logAndReturn(
      this.driver.select().from(items).where(eq(items.item_id, item_id)),
    );
  }

  getItemsByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(items)
        .where(eq(items.item_organization_id, organization_id)),
    );
  }

  updateItemById(item_id: string, itemUpdates: Partial<TItem>) {
    return this.logger.logAndReturn(
      this.driver
        .update(items)
        .set(itemUpdates)
        .where(eq(items.item_id, item_id))
        .returning(),
    );
  }

  deleteItemById(item_id: string) {
    return this.logger.logAndReturn(
      this.driver.delete(items).where(eq(items.item_id, item_id)).returning(),
    );
  }

  addSalesGroup(salesGroupDetails: TSalesGroup) {
    return this.logger.logAndReturn(
      this.driver.insert(salesGroups).values(salesGroupDetails).returning(),
    );
  }

  getSalesGroupsByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(salesGroups)
        .where(eq(salesGroups.sales_group_organization_id, organization_id)),
    );
  }

  updateSalesGroupById(
    sales_group_id: string,
    salesGroupUpdates: Partial<TSalesGroup>,
  ) {
    return this.logger.logAndReturn(
      this.driver
        .update(salesGroups)
        .set(salesGroupUpdates)
        .where(eq(salesGroups.sales_group_id, sales_group_id))
        .returning(),
    );
  }

  deleteSalesGroupById(sales_group_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .delete(salesGroups)
        .where(eq(salesGroups.sales_group_id, sales_group_id)),
    );
  }

  addClient(clientDetails: TClient) {
    return this.logger.logAndReturn(
      this.driver.insert(clients).values(clientDetails).returning(),
    );
  }

  getClientsByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(clients)
        .where(eq(clients.client_organization_id, organization_id)),
    );
  }

  updateClientById(client_id: string, clientUpdates: Partial<TClient>) {
    return this.logger.logAndReturn(
      this.driver
        .update(clients)
        .set(clientUpdates)
        .where(eq(clients.client_id, client_id)),
    );
  }

  addOrganizationPayment(paymentDetails: TOrganizationPayment) {
    return this.logger.logAndReturn(
      this.driver
        .insert(organizationsPayments)
        .values(paymentDetails)
        .returning(),
    );
  }

  getOrganizationPaymentsByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(organizationsPayments)
        .where(
          eq(organizationsPayments.payment_organization_id, organization_id),
        ),
    );
  }

  updateOrganizationPaymentById(
    payment_id: string,
    paymentUpdates: Partial<TOrganizationPayment>,
  ) {
    return this.logger.logAndReturn(
      this.driver
        .update(organizationsPayments)
        .set(paymentUpdates)
        .where(eq(organizationsPayments.payment_organization_id, payment_id)),
    );
  }

  addClientPayment(paymentDetails: TClientPayment) {
    return this.logger.logAndReturn(
      this.driver.insert(clientsPayments).values(paymentDetails).returning(),
    );
  }

  getClientPaymentsByClientId(client_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(clientsPayments)
        .where(eq(clientsPayments.client_payment_client_id, client_id)),
    );
  }

  updateClientPaymentById(
    client_payment_id: string,
    clientPaymentUpdates: Partial<TClientPayment>,
  ) {
    return this.logger.logAndReturn(
      this.driver
        .update(clientsPayments)
        .set(clientPaymentUpdates)
        .where(eq(clientsPayments.client_payment_id, client_payment_id))
        .returning(),
    );
  }

  addSaleItem(saleDetails: TSale) {
    return this.logger.logAndReturn(
      this.driver.insert(sales).values(saleDetails).returning(),
    );
  }

  viewSaleById(sale_id: string) {
    return this.logger.logAndReturn(
      this.driver.select().from(sales).where(eq(sales.sale_id, sale_id)),
    );
  }

  getSalesByEmployeeId(employee_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_employee_id, employee_id)),
    );
  }

  getSalesByItemId(item_id: string) {
    return this.logger.logAndReturn(
      this.driver.select().from(sales).where(eq(sales.sale_item_id, item_id)),
    );
  }

  getSalesByOrganizationId(organization_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_organization_id, organization_id)),
    );
  }

  getSalesByClientId(client_id: string) {
    return this.logger.logAndReturn(
      this.driver
        .select()
        .from(sales)
        .where(eq(sales.sale_client_id, client_id)),
    );
  }
}
