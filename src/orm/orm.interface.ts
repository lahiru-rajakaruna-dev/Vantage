import { TEmployeeUpdate } from '../schemas';
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
    TEmployeeLeavesUpdateSchema,
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
}                          from './drizzle/drizzle-postgres/drizzle-postgres.schema';



export default interface IOrmInterface {
    // --- ORGANIZATION ---
    // Returns single object as requested
    addOrganization(organizationDetails: TOrganizationInsert): Promise<TOrganizationSelect>;
    
    getOrganizationDetailsById(organization_id: string): Promise<TOrganizationSelect>;
    
    getOrganizationDetailsByAdminId(admin_id: string): Promise<TOrganizationSelect>;
    
    updateOrganizationById(
        organization_id: string,
        organizationUpdates: TOrganizationUpdate,
    ): Promise<TOrganizationSelect>;
    
    // --- EMPLOYEE (Transaction-based Onboarding) ---
    addEmployee(
        organization_id: string,
        employeeCredentials: TEmployeeCredentialsInsert // Starts the
                                                        // transaction
    ): Promise<TEmployeeSelect[]>;
    
    getEmployeeProfileById(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployeeSelect & {
        employee_sales: TSaleSelect[];
        employee_leaves: TEmployeeLeavesSelect
    }>;
    
    getEmployeesByOrganizationId(organization_id: string): Promise<TEmployeeSelect[]>;
    
    getEmployeesBySalesGroupId(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TEmployeeSelect[]>;
    
    updateEmployeeById(
        organization_id: string,
        employee_id: string,
        employeeUpdates: TEmployeeUpdate, // Includes "deactivation" via status
    ): Promise<TEmployeeSelect[]>;
    
    updateEmployeesByIds(
        organization_id: string,
        employees_ids: string[],
        employeeUpdates: TEmployeeUpdate,
    ): Promise<TEmployeeSelect[]>;
    
    // --- EMPLOYEE CREDENTIALS (Security Update) ---
    updateEmployeeCredentials(
        organization_id: string,
        employee_id: string,
        credentialUpdates: TEmployeeCredentialsUpdate
    ): Promise<TEmployeeCredentialsSelect>;
    
    // --- EMPLOYEE LEAVE ---
    
    updateEmployeeLeave(
        organization_id: string,
        employee_id: string, // Added parameter
        employeeLeavesUpdates: TEmployeeLeavesUpdateSchema
    ): Promise<TEmployeeLeavesSelect>;
    
    // --- EMPLOYEE SALARY ---
    
    updateEmployeeSalary(
        organization_id: string,
        employee_id: string,
        employeeSalaryUpdates: TEmployeeSalaryUpdate
    ): Promise<TEmployeeSalarySelect>;
    
    // --- ITEM ---
    addItem(
        organization_id: string,
        itemDetails: TItemInsert
    ): Promise<TItemSelect[]>;
    
    getItemById(
        organization_id: string,
        item_id: string
    ): Promise<TItemSelect>;
    
    getItemsByOrganizationId(organization_id: string): Promise<TItemSelect[]>;
    
    updateItemById(
        organization_id: string,
        item_id: string,
        itemUpdates: TItemUpdate,
    ): Promise<TItemSelect[]>;
    
    updateItemsByIds(
        organization_id: string,
        items_ids: string[],
        itemUpdates: TItemUpdate,
    ): Promise<TItemSelect[]>;
    
    // --- SALES_GROUP ---
    addSalesGroup(
        organization_id: string,
        salesGroupDetails: TSalesGroupInsert
    ): Promise<TSalesGroupSelect[]>;
    
    getSalesGroupsByOrganizationId(organization_id: string): Promise<TSalesGroupSelect[]>;
    
    getSalesGroupDetailsById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroupSelect & {
        sales_group_employees: (TEmployeeSelect & {
            employee_sales: TSaleSelect[]
        })[]
    }>;
    
    updateSalesGroupById(
        organization_id: string,
        sales_group_id: string,
        salesGroupUpdates: TSalesGroupUpdate,
    ): Promise<TSalesGroupSelect[]>;
    
    deleteSalesGroupById(
        organization_id: string,
        sales_group_id: string
    ): Promise<TSalesGroupSelect[]>
    
    // --- SALE ---
    addSale(
        organization_id: string,
        saleDetails: TSaleInsert
    ): Promise<TSaleSelect[]>;
    
    getSaleById(
        organization_id: string,
        sale_id: string
    ): Promise<TSaleSelect>;
    
    getSalesByEmployeeId(
        organization_id: string,
        employee_id: string,
    ): Promise<TSaleSelect[]>;
    
    getSalesByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TSaleSelect[]>;
    
    getSalesByItemId(
        organization_id: string,
        item_id: string
    ): Promise<TSaleSelect[]>;
    
    getSalesByOrganizationId(organization_id: string): Promise<TSaleSelect[]>;
    
    getSalesByDate(
        organization_id: string,
        date: number
    ): Promise<TSaleSelect[]>;
    
    getSalesWithinDates(
        organization_id: string,
        date_start: number,
        date_end: number,
    ): Promise<TSaleSelect[]>;
    
    // --- ORGANIZATION PAYMENT ---
    addOrganizationPayment(
        organization_id: string,
        paymentDetails: TOrganizationPaymentInsert,
    ): Promise<TOrganizationPaymentSelect[]>;
    
    getOrganizationPaymentById(
        organization_id: string,
        payment_id: string
    ): Promise<TOrganizationPaymentSelect>;
    
    getOrganizationPaymentsByOrganizationId(organization_id: string): Promise<TOrganizationPaymentSelect[]>;
    
    updateOrganizationPaymentById(
        organization_id: string,
        payment_id: string,
        paymentUpdates: TOrganizationPaymentUpdate,
    ): Promise<TOrganizationPaymentSelect[]>;
    
    // --- CLIENT ---
    addClient(
        organization_id: string, // Added missing scope
        clientDetails: TClientInsert
    ): Promise<TClientSelect[]>;
    
    getClientProfileById(
        organization_id: string,
        client_id: string,
    ): Promise<TClientSelect>;
    
    getClientsByOrganizationId(organization_id: string): Promise<TClientSelect[]>;
    
    updateClientById(
        organization_id: string,
        client_id: string,
        clientUpdates: TClientUpdate, // Includes "deactivation" logic
    ): Promise<TClientSelect[]>;
    
    updateClientsByIds(
        organization_id: string,
        clients_ids: string[],
        clientUpdates: TClientUpdate,
    ): Promise<TClientSelect[]>;
    
    // --- CLIENT PAYMENTS ---
    addClientPayment(
        organization_id: string,
        client_id: string
        , paymentDetails: TClientPaymentInsert
    ): Promise<TClientPaymentSelect[]>;
    
    getClientPaymentById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPaymentSelect>;
    
    getClientPaymentsByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TClientPaymentSelect[]>;
    
    updateClientPaymentById(
        organization_id: string,
        client_payment_id: string,
        clientPaymentUpdates: TClientPaymentUpdate,
    ): Promise<TClientPaymentSelect[]>;
}
