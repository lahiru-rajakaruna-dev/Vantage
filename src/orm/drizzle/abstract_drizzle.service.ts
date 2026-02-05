import { ConfigService } from '@nestjs/config';
import type ILoggerService from '../../logger/logger.interface';
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
    TEmployeeLeavesSelect,
    TEmployeeLeavesUpdate,
    TEmployeeSalarySelect,
    TEmployeeSalaryUpdate,
    TEmployeeSelect,
    TEmployeeUpdate,
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
    TSalesGroupUpdate,
    TSaleUpdate
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
        paymentDetails: Omit<TOrganizationPaymentInsert, 'organization_payment_organization_id'>
    ): Promise<TOrganizationPaymentSelect[]>
    
    
    abstract updateOrganizationPaymentById(
        organization_id: string, payment_id: string,
        paymentUpdates: Omit<TOrganizationPaymentUpdate, 'organization_payment_id' | 'organization_payment_organization_id'>
    ): Promise<TOrganizationPaymentSelect[]>
    
    
    abstract getOrganizationPaymentById(
        organization_id: string,
        payment_id: string
    ): Promise<TOrganizationPaymentSelect>
    
    
    abstract getOrganizationPaymentsByOrganizationId(organization_id: string): Promise<TOrganizationPaymentSelect[]>
    
    
    // EMPLOYEE
    
    abstract addEmployee(
        organization_id: string,
        employeeCredentials: Pick<TEmployeeCredentialsInsert, 'employee_credential_username' | 'employee_credential_password'>
    ): Promise<TEmployeeSelect[]>
    
    
    abstract updateEmployeeById(
        organization_id: string, employee_id: string,
        employeeUpdates: Omit<TEmployeeUpdate, 'employee_id' | 'employee_organization_id'>
    ): Promise<TEmployeeSelect[]>
    
    
    abstract updateEmployeesByIds(
        organization_id: string, employees_ids: string[],
        employeeUpdates: Omit<TEmployeeUpdate, 'employee_id' | 'employee_organization_id'>
    ): Promise<TEmployeeSelect[]>
    
    
    abstract getEmployeeProfileById(
        organization_id: string,
        employee_id: string
    ): Promise<TEmployeeSelect & {
        employee_sales: TSaleSelect[];
        employee_leaves: TEmployeeLeavesSelect;
        employee_salary: TEmployeeSalarySelect
    }>
    
    
    abstract getEmployeesByOrganizationId(organization_id: string): Promise<TEmployeeSelect[]>
    
    
    abstract getEmployeesBySalesGroupId(
        organization_id: string,
        sales_group_id: string
    ): Promise<TEmployeeSelect[]>


//     EMPLOYEE_CREDENTIALS
    
    abstract updateEmployeeCredentials(
        organization_id: string, employee_id: string,
        credentialUpdates: Omit<TEmployeeCredentialsUpdate, 'employee_credential_id' | 'employee_credential_organization_id' | 'employee_credential_employee_id'>
    ): Promise<TEmployeeCredentialsSelect>


//     EMPLOYEE_LEAVES
    
    abstract updateEmployeeLeave(
        organization_id: string,
        employee_id: string,
        employeeLeavesUpdates: Omit<TEmployeeLeavesUpdate, 'employee_leave_id' | 'employee_leave_organization_id' | 'employee_leave_employee_id'>
    ): Promise<TEmployeeLeavesSelect>


//     EMPLOYEE_SALARY
    
    abstract updateEmployeeSalary(
        organization_id: string, employee_id: string,
        employeeSalaryUpdates: Omit<TEmployeeSalaryUpdate, 'employee_salary_id' | 'employee_salary_organization_id' | 'employee_salary_employee_id'>
    ): Promise<TEmployeeSalarySelect>
    
    
    abstract getOrganizationDetailsByAdminId(admin_id: string): Promise<TOrganizationSelect>
    
    
    abstract getOrganizationDetailsById(organization_id: string): Promise<TOrganizationSelect>


//     SALES_GROUP
    
    abstract addSalesGroup(
        organization_id: string,
        salesGroupDetails: Omit<TSalesGroupInsert, 'sales_group_organization_id'>
    ): Promise<TSalesGroupSelect[]>
    
    
    abstract updateSalesGroupById(
        organization_id: string, sales_group_id: string,
        salesGroupUpdates: Omit<TSalesGroupUpdate, 'sales_group_organization_id' | 'sales_group_id'>
    ): Promise<TSalesGroupSelect[]>
    
    
    abstract getSalesGroupDetailsById(
        organization_id: string,
        sales_group_id: string
    ): Promise<TSalesGroupSelect & {
        sales_group_employees: (TEmployeeSelect & {
            employee_sales: TSaleSelect[];
            employee_leaves: TEmployeeLeavesSelect
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
        clientDetails: Omit<TClientInsert, 'client_organization_id'>
    ): Promise<TClientSelect[]>
    
    
    abstract updateClientById(
        organization_id: string, client_id: string,
        clientUpdates: Omit<TClientUpdate, 'client_id' | 'client_organization_id'>
    ): Promise<TClientSelect[]>
    
    
    abstract updateClientsByIds(
        organization_id: string, clients_ids: string[],
        clientUpdates: Omit<TClientUpdate, 'client_organization_id' | 'client_id'>
    ): Promise<TClientSelect[]>
    
    
    abstract getClientProfileById(
        organization_id: string, client_id: string): Promise<TClientSelect>
    
    
    abstract getClientsByOrganizationId(organization_id: string): Promise<TClientSelect[]>


//     CLIENT_PAYMENT
    abstract addClientPayment(
        organization_id: string,
        client_id: string
        ,
        paymentDetails: Omit<TClientPaymentInsert, 'client_payment_organization_id' | 'client_payment_client_id'>
    ): Promise<TClientPaymentSelect[]>
    
    
    abstract updateClientPaymentById(
        organization_id: string, payment_id: string,
        clientPaymentUpdates: Omit<TClientPaymentUpdate, 'client_payment_id' | 'client_payment_organization_id' | 'client_payment_client_id'>
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
        itemDetails: Omit<TItemInsert, 'item_organization_id'>
    ): Promise<TItemSelect[]>
    
    
    abstract updateItemById(
        organization_id: string, item_id: string,
        itemUpdates: Omit<TItemUpdate, 'item_organization_id' | 'item_id'>
    ): Promise<TItemSelect[]>
    
    
    abstract updateItemsByIds(
        organization_id: string, items_ids: string[],
        itemUpdates: Omit<TItemUpdate, 'item_organization_id' | 'item_id'>
    ): Promise<TItemSelect[]>
    
    
    abstract getItemsByOrganizationId(organization_id: string): Promise<TItemSelect[]>
    
    
    abstract getItemById(
        organization_id: string, item_id: string): Promise<TItemSelect>


//     SALE
    abstract addSale(
        organization_id: string,
        employee_id: string,
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
    
    
    abstract updateSaleById(
        organization_id: string, sale_id: string,
        saleUpdates: Omit<TSaleUpdate, 'sale_id' | 'sale_organization_id' | 'sale_employee_id'>
    ): Promise<TSaleSelect[]>
}
