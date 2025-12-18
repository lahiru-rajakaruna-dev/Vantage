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

  abstract addOrganization(
    organizationDetails: TOrganization,
  ): Promise<TOrganization>;

  abstract updateOrganizationById(
    organization_id: string,
    organizationUpdates: Partial<TOrganization>,
  ): Promise<TOrganization>;

  abstract getOrganizationDetailsById(
    organization_id: string,
  ): Promise<TOrganization>;

  abstract addEmployee(employeeDetails: TEmployee): Promise<TEmployee>;

  abstract viewEmployeeById(employee_id: string): Promise<TEmployee>;

  abstract getEmployeesByOrganizationId(
    organization_id: string,
  ): Promise<TEmployee[]>;

  abstract getEmployeesBySalesGroupId(
    sales_group_id: string,
  ): Promise<TEmployee[]>;

  abstract updateEmployeeById(
    employee_id: string,
    employeeUpdates: Partial<TEmployee>,
  ): Promise<TEmployee>;

  abstract deleteEmployeeById(employee_id: string): Promise<TEmployee>;

  abstract addItem(itemDetails: TItem): Promise<TItem>;

  abstract viewItemById(item_id: string): Promise<TItem>;

  abstract getItemsByOrganizationId(organization_id: string): Promise<TItem[]>;

  abstract updateItemById(
    item_id: string,
    itemUpdates: Partial<TItem>,
  ): Promise<TItem>;

  abstract deleteItemById(item_id: string): Promise<TItem>;

  abstract addSalesGroup(salesGroupDetails: TSalesGroup): Promise<TSalesGroup>;

  abstract getSalesGroupsByOrganizationId(
    organization_id: string,
  ): Promise<TSalesGroup>;

  abstract updateSalesGroupById(
    sales_group_id: string,
    salesGroupUpdates: Partial<TSalesGroup>,
  ): Promise<TSalesGroup>;

  abstract deleteSalesGroupById(sales_group_id: string): Promise<TSalesGroup>;

  abstract addClient(clientDetails: TClient): Promise<TClient>;

  abstract getClientProfileById(client_id: string): Promise<TClient>;

  abstract getClientsByOrganizationId(
    organization_id: string,
  ): Promise<TClient[]>;

  abstract updateClientById(
    client_id: string,
    clientUpdates: Partial<TClient>,
  ): Promise<TClient>;

  abstract addOrganizationPayment(
    paymentDetails: TOrganizationPayment,
  ): Promise<TOrganizationPayment>;

  abstract getOrganizationPaymentsByOrganizationId(
    organization_id: string,
  ): Promise<TOrganizationPayment[]>;

  abstract updateOrganizationPaymentById(
    payment_id: string,
    paymentUpdates: Partial<TOrganizationPayment>,
  ): Promise<TOrganizationPayment>;

  abstract addClientPayment(
    paymentDetails: TClientPayment,
  ): Promise<TClientPayment>;

  abstract getClientPaymentById(payment_id: string): Promise<TClientPayment>;

  abstract getClientPaymentsByClientId(
    client_id: string,
  ): Promise<TClientPayment[]>;

  abstract updateClientPaymentById(
    client_payment_id: string,
    clientPaymentUpdates: Partial<TClientPayment>,
  ): Promise<TClientPayment>;

  abstract addSaleItem(saleDetails: TSale): Promise<TSale>;

  abstract viewSaleById(sale_id: string): Promise<TSale>;

  abstract getSalesByEmployeeId(employee_id: string): Promise<TSale[]>;

  abstract getSalesByItemId(item_id: string): Promise<TSale[]>;

  abstract getSalesByOrganizationId(organization_id: string): Promise<TSale[]>;

  abstract getSalesByClientId(client_id: string): Promise<TSale[]>;

  abstract getSalesByDate(date: number): Promise<TSale[]>;

  abstract getSalesWithinDates(
    date_start: number,
    date_end: number,
  ): Promise<TSale[]>;
}
