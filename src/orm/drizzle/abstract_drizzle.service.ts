import { ConfigService } from '@nestjs/config';
import type ILoggerService from '../../logger/logger.interface';
import {
    TEmployeesLeavesUpdate,
    TEmployeeUpdate
} from '../../schemas';
import IOrmInterface from '../orm.interface';
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
    TEmployeeLeavesInsert,
    TEmployeeLeavesSelect,
    TEmployeeSalaryInsert,
    TEmployeeSalarySelect,
    TEmployeeSalaryUpdate,
    TEmployeeSelect,
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
    TSalesGroupUpdate
} from './drizzle-postgres/drizzle-postgres.schema';



export default abstract class AbstractDrizzlerService implements IOrmInterface {
    protected readonly configService: ConfigService;
    protected readonly logger: ILoggerService;
    
    
    protected constructor(
        configService: ConfigService,
        logger: ILoggerService,
    ) {
        this.configService = configService;
        this.logger        = logger;
    }
    
    
    abstract addOrganization(organizationDetails: TOrganizationInsert): Promise<TOrganizationSelect>
    
    
    abstract updateOrganizationById(
        organization_id: string,
        organizationUpdates: TOrganizationUpdate
    ): Promise<TOrganizationSelect>
    
    
    // ORGANIZATION_PAYMENT
    abstract addOrganizationPayment(
        organization_id: string,
        paymentDetails: TOrganizationPaymentInsert
    ): Promise<TOrganizationPaymentSelect[]>
    
    
    abstract updateOrganizationPaymentById(
        organization_id: string, payment_id: string,
        paymentUpdates: TOrganizationPaymentUpdate
    ): Promise<TOrganizationPaymentSelect[]>
    
    
    abstract getOrganizationPaymentById(
        organization_id: string,
        payment_id: string
    ): Promise<TOrganizationPaymentSelect>
    
    
    abstract getOrganizationPaymentsByOrganizationId(organization_id: string): Promise<TOrganizationPaymentSelect[]>
    
    
    // EMPLOYEE
    
    abstract addEmployee(
        organization_id: string,
        employeeCredentials: TEmployeeCredentialsInsert
    ): Promise<TEmployeeSelect[]>
    
    
    abstract updateEmployeeById(
        organization_id: string, employee_id: string,
        employeeUpdates: TEmployeeUpdate
    ): Promise<TEmployeeSelect[]>
    
    
    abstract updateEmployeesByIds(
        organization_id: string, employees_ids: string[],
        employeeUpdates: TEmployeeUpdate
    ): Promise<TEmployeeSelect[]>
    
    
    abstract getEmployeeProfileById(
        organization_id: string,
        employee_id: string
    ): Promise<TEmployeeSelect & {
        employee_sales: TSaleSelect[];
        employee_leaves: TEmployeeLeavesSelect[]
    }>
    
    
    abstract getEmployeesByOrganizationId(organization_id: string): Promise<TEmployeeSelect[]>
    
    
    abstract getEmployeesBySalesGroupId(
        organization_id: string,
        sales_group_id: string
    ): Promise<TEmployeeSelect[]>


//     EMPLOYEE_CREDENTIALS
    
    abstract updateEmployeeCredentials(
        organization_id: string, employee_id: string,
        credentialUpdates: TEmployeeCredentialsUpdate
    ): Promise<TEmployeeCredentialsSelect>


//     EMPLOYEE_LEAVES
    
    abstract addEmployeeLeave(
        organization_id: string,
        employeeLeavesDetails: TEmployeeLeavesInsert
    ): Promise<TEmployeeLeavesSelect[]>
    
    
    abstract updateEmployeeLeave(
        organization_id: string, employee_id: string,
        employeeLeavesUpdates: TEmployeesLeavesUpdate
    ): Promise<TEmployeeLeavesSelect[]>


//     EMPLOYEE_SALARY
    abstract addEmployeeSalary(
        organization_id: string,
        employeeSalaryDetails: TEmployeeSalaryInsert
    ): Promise<TEmployeeSalarySelect[]>
    
    
    abstract updateEmployeeSalary(
        organization_id: string, employee_id: string,
        employeeSalaryUpdates: TEmployeeSalaryUpdate
    ): Promise<TEmployeeSalarySelect[]>
    
    
    abstract getOrganizationDetailsByAdminId(admin_id: string): Promise<TOrganizationSelect>
    
    
    abstract getOrganizationDetailsById(organization_id: string): Promise<TOrganizationSelect>


//     SALES_GROUP
    
    abstract addSalesGroup(
        organization_id: string,
        salesGroupDetails: TSalesGroupInsert
    ): Promise<TSalesGroupSelect[]>
    
    
    abstract updateSalesGroupById(
        organization_id: string, sales_group_id: string,
        salesGroupUpdates: TSalesGroupUpdate
    ): Promise<TSalesGroupSelect[]>
    
    
    abstract getSalesGroupDetailsById(
        organization_id: string,
        sales_group_id: string
    ): Promise<TSalesGroupSelect & {
        sales_group_employees: (TEmployeeSelect & {
            employee_sales: TSaleSelect[]
        })[]
    }>
    
    
    abstract getSalesGroupsByOrganizationId(organization_id: string): Promise<TSalesGroupSelect[]>
    
    
    abstract deleteSalesGroupById(
        organization_id: string,
        sales_group_id: string
    ): Promise<TSalesGroupSelect[]>


//     CLIENT
    abstract addClient(
        organization_id: string,
        clientDetails: TClientInsert
    ): Promise<TClientSelect[]>
    
    
    abstract updateClientById(
        organization_id: string, client_id: string,
        clientUpdates: TClientUpdate
    ): Promise<TClientSelect[]>
    
    
    abstract updateClientsByIds(
        organization_id: string, clients_ids: string[],
        clientUpdates: TClientUpdate
    ): Promise<TClientSelect[]>
    
    
    abstract getClientProfileById(
        organization_id: string, client_id: string): Promise<TClientSelect>
    
    
    abstract getClientsByOrganizationId(organization_id: string): Promise<TClientSelect[]>


//     CLIENT_PAYMENT
    abstract addClientPayment(
        organization_id: string,
        paymentDetails: TClientPaymentInsert
    ): Promise<TClientPaymentSelect[]>
    
    
    abstract updateClientPaymentById(
        organization_id: string, client_payment_id: string,
        clientPaymentUpdates: TClientPaymentUpdate
    ): Promise<TClientPaymentSelect[]>
    
    
    abstract getClientPaymentsByClientId(
        organization_id: string,
        client_id: string
    ): Promise<TClientPaymentSelect[]>
    
    
    abstract getClientPaymentById(
        organization_id: string,
        payment_id: string
    ): Promise<TClientPaymentSelect>


//     ITEM
    abstract addItem(
        organization_id: string,
        itemDetails: TItemInsert
    ): Promise<TItemSelect[]>
    
    
    abstract updateItemById(
        organization_id: string, item_id: string,
        itemUpdates: TItemUpdate
    ): Promise<TItemSelect[]>
    
    
    abstract updateItemsByIds(
        organization_id: string, items_ids: string[],
        itemUpdates: TItemUpdate
    ): Promise<TItemSelect[]>
    
    
    abstract getItemsByOrganizationId(organization_id: string): Promise<TItemSelect[]>
    
    
    abstract getItemById(
        organization_id: string, item_id: string): Promise<TItemSelect>


//     SALE
    abstract addSale(
        organization_id: string,
        saleDetails: TSaleInsert
    ): Promise<TSaleSelect[]>
    
    
    abstract getSaleById(
        organization_id: string, sale_id: string): Promise<TSaleSelect>
    
    
    abstract getSalesByClientId(
        organization_id: string, client_id: string): Promise<TSaleSelect[]>
    
    
    abstract getSalesByEmployeeId(
        organization_id: string, employee_id: string): Promise<TSaleSelect[]>
    
    
    abstract getSalesByItemId(
        organization_id: string, item_id: string): Promise<TSaleSelect[]>
    
    
    abstract getSalesByOrganizationId(organization_id: string): Promise<TSaleSelect[]>
    
    
    abstract getSalesByDate(
        organization_id: string, date: number): Promise<TSaleSelect[]>
    
    
    abstract getSalesWithinDates(
        organization_id: string, date_start: number,
        date_end: number
    ): Promise<TSaleSelect[]>
}
