import IOrmInterface from '../orm.interface';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TClient,
  TClientPayment,
  TEmployee,
  TItem,
  TOrganization,
  TOrganizationPayment,
  TSale,
  TSalesGroup,
} from './drizzle-postgres/drizzle-postgres.schema';
import ILoggerService from '../../logger/logger.interface';
import LoggerFactoryService from '../../logger/logger-factory.service';

export default abstract class DrizzleOrm implements IOrmInterface {
  protected readonly configService: ConfigService;
  protected readonly logger: ILoggerService;

  constructor(
    @Inject() configService: ConfigService,
    @Inject() loggerFactory: LoggerFactoryService,
  ) {
    this.configService = configService;
    this.logger = loggerFactory.getLogger();
  }

  abstract addOrganization(organizationDetails: TOrganization);

  abstract updateOrganizationById(
    organization_id: string,
    organizationUpdates: Partial<TOrganization>,
  );

  abstract getOrganizationDetailsById(organization_id: string): any;

  abstract addEmployee(employeeDetails: TEmployee): any;

  abstract viewEmployeeById(employee_id: string): any;

  abstract getEmployeesByOrganizationId(organization_id: string): any;

  abstract getEmployeesBySalesGroupId(sales_group_id: string): any;

  abstract updateEmployeeById(
    employee_id: string,
    employeeUpdates: Partial<TEmployee>,
  ): any;

  abstract deleteEmployeeById(employee_id: string): any;

  abstract addItem(itemDetails: TItem): any;

  abstract viewItemById(item_id: string): any;

  abstract getItemsByOrganizationId(organization_id: string): any;

  abstract updateItemById(item_id: string, itemUpdates: Partial<TItem>): any;

  abstract deleteItemById(item_id: string): any;

  abstract addSalesGroup(salesGroupDetails: TSalesGroup): any;

  abstract getSalesGroupsByOrganizationId(organization_id: string): any;

  abstract updateSalesGroupById(
    sales_group_id: string,
    salesGroupUpdates: Partial<TSalesGroup>,
  ): any;

  abstract deleteSalesGroupById(sales_group_id: string): any;

  abstract addClient(clientDetails: TClient): any;

  abstract getClientsByOrganizationId(organization_id: string): any;

  abstract updateClientById(
    client_id: string,
    clientUpdates: Partial<TClient>,
  ): any;

  abstract addOrganizationPayment(paymentDetails: TOrganizationPayment): any;

  abstract getOrganizationPaymentsByOrganizationId(
    organization_id: string,
  ): any;

  abstract updateOrganizationPaymentById(
    payment_id: string,
    paymentUpdates: Partial<TOrganizationPayment>,
  ): any;

  abstract addClientPayment(paymentDetails: TClientPayment): any;

  abstract getClientPaymentsByClientId(client_id: string): any;

  abstract updateClientPaymentById(
    client_payment_id: string,
    clientPaymentUpdates: Partial<TClientPayment>,
  ): any;

  abstract addSaleItem(saleDetails: TSale): any;

  abstract viewSaleById(sale_id: string): any;

  abstract getSalesByEmployeeId(employee_id: string): any;

  abstract getSalesByItemId(item_id: string): any;

  abstract getSalesByOrganizationId(organization_id: string): any;

  abstract getSalesByClientId(client_id: string): any;
}
