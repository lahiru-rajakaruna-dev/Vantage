import { Inject }           from '@nestjs/common';
import { ConfigService }    from '@nestjs/config';
import type ILoggerService  from '../../logger/logger.interface';
import {
    TOKEN__LOGGER_FACTORY
}                           from '../../logger/logger_factory/logger_factory.service';
import { TEmployeeProfile } from '../../schemas';
import IOrmInterface, {
    TClient,
    TClientPayment,
    TEmployee,
    TItem,
    TOrganization,
    TOrganizationPayment,
    TSale,
    TSalesGroup,
}                           from '../orm.interface';



export default abstract class AbstractDrizzlerService implements IOrmInterface {
    protected readonly configService: ConfigService;
    protected readonly logger: ILoggerService;
    
    
    protected constructor(
        @Inject() configService: ConfigService,
        @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
    ) {
        this.configService = configService;
        this.logger        = logger;
    }
    
    
    abstract addOrganization(organizationDetails: TOrganization,): Promise<TOrganization>;
    
    
    abstract updateOrganizationById(
        organization_id: string,
        organizationUpdates: Partial<TOrganization>,
    ): Promise<TOrganization>;
    
    
    abstract getOrganizationDetailsById(organization_id: string,): Promise<TOrganization>;
    
    
    abstract getOrganizationDetailsByAdminId(admin_id: string,): Promise<TOrganization>;
    
    
    abstract addEmployee(
        organization_id: string,
        employeeDetails: {
            employees_credentials_username: string;
            employees_credentials_password: string
        }
    ): Promise<TEmployee[]>;
    
    
    abstract getEmployeeProfileById(
        organization_id: string,
        employee_id: string
    ): Promise<TEmployeeProfile>;
    
    
    abstract getEmployeesByOrganizationId(organization_id: string,): Promise<TEmployee[]>;
    
    
    abstract getEmployeesBySalesGroupId(sales_group_id: string,): Promise<TEmployee[]>;
    
    
    abstract updateEmployeeById(
        organization_id: string,
        employee_id: string,
        employeeUpdates: Partial<TEmployee>,
    ): Promise<TEmployee[]>;
    
    
    abstract updateEmployeesByIds(
        organization_id: string,
        employees_ids: string[],
        employeeUpdates: Partial<TEmployee>,
    ): Promise<TEmployee[]>;
    
    
    abstract deleteEmployeeById(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployee[]>;
    
    
    abstract addItem(itemDetails: TItem): Promise<TItem[]>;
    
    
    abstract viewItemById(item_id: string): Promise<TItem>;
    
    
    abstract getItemsByOrganizationId(organization_id: string): Promise<TItem[]>;
    
    
    abstract updateItemById(
        organization_id: string,
        item_id: string,
        itemUpdates: Partial<TItem>,
    ): Promise<TItem[]>;
    
    
    abstract updateItemsByIds(
        organization_id: string,
        items_ids: string[],
        itemUpdates: Partial<TItem>,
    ): Promise<TItem[]>;
    
    
    abstract deleteItemById(
        organization_id: string,
        item_id: string
    ): Promise<TItem[]>
    
    abstract deleteItemById(
        organization_id: string,
        item_id: string,
    ): Promise<TItem[]>;
    
    
    abstract deleteItemsByIds(
        organization_id: string,
        items_ids: string[],
    ): Promise<TItem[]>;
    
    
    abstract addSalesGroup(salesGroupDetails: TSalesGroup,): Promise<TSalesGroup[]>;
    
    
    abstract getSalesGroupsByOrganizationId(organization_id: string,): Promise<TSalesGroup[]>;
    
    
    abstract getSalesGroupDetailsById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroup>
    
    
    abstract updateSalesGroupById(
        organization_id: string,
        sales_group_id: string,
        salesGroupUpdates: Partial<TSalesGroup>,
    ): Promise<TSalesGroup[]>;
    
    
    abstract deleteSalesGroupById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroup[]>;
    
    
    abstract addClient(clientDetails: TClient): Promise<TClient[]>;
    
    
    abstract getClientProfileById(client_id: string): Promise<TClient>;
    
    
    abstract getClientsByOrganizationId(organization_id: string,): Promise<TClient[]>;
    
    
    abstract updateClientById(
        organization_id: string,
        client_id: string,
        clientUpdates: Partial<TClient>,
    ): Promise<TClient[]>;
    
    
    abstract updateClientsByIds(
        organization_id: string,
        clients_ids: string[],
        clientUpdates: Partial<TClient>,
    ): Promise<TClient[]>;
    
    
    abstract addOrganizationPayment(paymentDetails: TOrganizationPayment,): Promise<TOrganizationPayment[]>;
    
    
    abstract getOrganizationPaymentById(
        organization_id: string,
        payment_id: string
    ): Promise<TOrganizationPayment>
    
    
    abstract getOrganizationPaymentsByOrganizationId(organization_id: string,): Promise<TOrganizationPayment[]>;
    
    
    abstract updateOrganizationPaymentById(
        organization_id: string,
        payment_id: string,
        paymentUpdates: Partial<TOrganizationPayment>,
    ): Promise<TOrganizationPayment[]>;
    
    
    abstract addClientPayment(paymentDetails: TClientPayment,): Promise<TClientPayment[]>;
    
    
    abstract getClientPaymentById(payment_id: string): Promise<TClientPayment>;
    
    
    abstract getClientPaymentsByClientId(client_id: string,): Promise<TClientPayment[]>;
    
    
    abstract updateClientPaymentById(
        organization_id: string,
        client_payment_id: string,
        clientPaymentUpdates: Partial<TClientPayment>,
    ): Promise<TClientPayment[]>;
    
    
    abstract addSaleItem(saleDetails: TSale): Promise<TSale[]>;
    
    
    abstract viewSaleById(sale_id: string): Promise<TSale>;
    
    
    abstract getSalesByEmployeeId(employee_id: string): Promise<TSale[]>;
    
    
    abstract getSalesByItemId(item_id: string): Promise<TSale[]>;
    
    
    abstract getSalesByOrganizationId(organization_id: string): Promise<TSale[]>;
    
    
    abstract getSalesByClientId(client_id: string): Promise<TSale[]>;
    
    
    abstract getSalesByDate(
        organization_id: string,
        date: number,
    ): Promise<TSale[]>;
    
    
    abstract getSalesWithinDates(
        organization_id: string,
        date_start: number,
        date_end: number,
    ): Promise<TSale[]>;
}
