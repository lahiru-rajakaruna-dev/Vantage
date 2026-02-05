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
} from './drizzle/drizzle-postgres/drizzle-postgres.schema';

// ============================================
// EXTRACTED TYPE ALIASES
// ============================================

// Employee Types
export type TCreateEmployee = Pick<TEmployeeCredentialsInsert, 'employee_credential_username' | 'employee_credential_password'>;
export type TEmployeeProfile =
    TEmployeeSelect
    & {
    employee_sales: TSaleSelect[];
    employee_leaves: TEmployeeLeavesSelect;
    employee_salary: TEmployeeSalarySelect;
};
export type TUpdateEmployee = Omit<TEmployeeUpdate, 'employee_id' | 'employee_organization_id'>;
export type TUpdateEmployeeCredentials = Omit<TEmployeeCredentialsUpdate, 'employee_credential_id' | 'employee_credential_organization_id' | 'employee_credential_employee_id'>;
export type TUpdateEmployeeLeave = Omit<TEmployeeLeavesUpdate, 'employee_leave_id' | 'employee_leave_organization_id' | 'employee_leave_employee_id'>;
export type TUpdateEmployeeSalary = Omit<TEmployeeSalaryUpdate, 'employee_salary_id' | 'employee_salary_organization_id' | 'employee_salary_employee_id'>;

// Item Types
export type TCreateItem = Omit<TItemInsert, 'item_organization_id'>;
export type TUpdateItem = Omit<TItemUpdate, 'item_organization_id' | 'item_id'>;

// Sales Group Types
export type TCreateSalesGroup = Omit<TSalesGroupInsert, 'sales_group_organization_id'>;
export type TSalesGroupDetails =
    TSalesGroupSelect
    & {
    sales_group_employees: (TEmployeeSelect & {
        employee_sales: TSaleSelect[];
        employee_leaves: TEmployeeLeavesSelect;
    })[];
};
export type TUpdateSalesGroup = Omit<TSalesGroupUpdate, 'sales_group_organization_id' | 'sales_group_id'>;

// Sale Types
export type TCreateSale = Omit<TSaleInsert, 'sale_organization_id' | 'sale_employee_id'>;
export type TUpdateSale = Omit<TSaleUpdate, 'sale_id' | 'sale_organization_id' | 'sale_employee_id'>;

// Organization Payment Types
export type TCreateOrganizationPayment = Omit<TOrganizationPaymentInsert, 'organization_payment_organization_id'>;
export type TUpdateOrganizationPayment = Omit<TOrganizationPaymentUpdate, 'organization_payment_id' | 'organization_payment_organization_id'>;

// Client Types
export type TCreateClient = Omit<TClientInsert, 'client_organization_id'>;
export type TUpdateClient = Omit<TClientUpdate, 'client_id' | 'client_organization_id'>;

// Client Payment Types
export type TCreateClientPayment = Omit<TClientPaymentInsert, 'client_payment_organization_id' | 'client_payment_client_id'>;
export type TUpdateClientPayment = Omit<TClientPaymentUpdate, 'client_payment_id' | 'client_payment_organization_id' | 'client_payment_client_id'>;

// ============================================
// ORM INTERFACE
// ============================================
export default interface IOrmInterface {
    // --- ORGANIZATION ---
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
        employeeCredentials: TCreateEmployee
    ): Promise<TEmployeeSelect[]>;
    
    getEmployeeProfileById(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployeeProfile>;
    
    getEmployeesByOrganizationId(organization_id: string): Promise<TEmployeeSelect[]>;
    
    getEmployeesBySalesGroupId(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TEmployeeSelect[]>;
    
    updateEmployeeById(
        organization_id: string,
        employee_id: string,
        employeeUpdates: TUpdateEmployee,
    ): Promise<TEmployeeSelect[]>;
    
    updateEmployeesByIds(
        organization_id: string,
        employees_ids: string[],
        employeeUpdates: TUpdateEmployee,
    ): Promise<TEmployeeSelect[]>;
    
    // --- EMPLOYEE CREDENTIALS (Security Update) ---
    updateEmployeeCredentials(
        organization_id: string,
        employee_id: string,
        credentialUpdates: TUpdateEmployeeCredentials
    ): Promise<TEmployeeCredentialsSelect>;
    
    // --- EMPLOYEE LEAVE ---
    updateEmployeeLeave(
        organization_id: string,
        employee_id: string,
        employeeLeavesUpdates: TUpdateEmployeeLeave
    ): Promise<TEmployeeLeavesSelect>;
    
    // --- EMPLOYEE SALARY ---
    updateEmployeeSalary(
        organization_id: string,
        employee_id: string,
        employeeSalaryUpdates: TUpdateEmployeeSalary
    ): Promise<TEmployeeSalarySelect>;
    
    // --- ITEM ---
    addItem(
        organization_id: string,
        itemDetails: TCreateItem
    ): Promise<TItemSelect[]>;
    
    getItemById(
        organization_id: string,
        item_id: string
    ): Promise<TItemSelect>;
    
    getItemsByOrganizationId(organization_id: string): Promise<TItemSelect[]>;
    
    updateItemById(
        organization_id: string,
        item_id: string,
        itemUpdates: TUpdateItem,
    ): Promise<TItemSelect[]>;
    
    updateItemsByIds(
        organization_id: string,
        items_ids: string[],
        itemUpdates: TUpdateItem,
    ): Promise<TItemSelect[]>;
    
    // --- SALES_GROUP ---
    addSalesGroup(
        organization_id: string,
        salesGroupDetails: TCreateSalesGroup
    ): Promise<TSalesGroupSelect[]>;
    
    getSalesGroupsByOrganizationId(organization_id: string): Promise<TSalesGroupSelect[]>;
    
    getSalesGroupDetailsById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroupDetails>;
    
    updateSalesGroupById(
        organization_id: string,
        sales_group_id: string,
        salesGroupUpdates: TUpdateSalesGroup,
    ): Promise<TSalesGroupSelect[]>;
    
    deleteSalesGroupById(
        organization_id: string,
        sales_group_id: string
    ): Promise<TSalesGroupSelect[]>
    
    // --- SALE ---
    addSale(
        organization_id: string,
        employee_id: string,
        saleDetails: TCreateSale
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
    
    updateSaleById(
        organization_id: string,
        sale_id: string,
        saleUpdates: TUpdateSale,
    ): Promise<TSaleSelect[]>;
    
    // --- ORGANIZATION PAYMENT ---
    addOrganizationPayment(
        organization_id: string,
        paymentDetails: TCreateOrganizationPayment,
    ): Promise<TOrganizationPaymentSelect[]>;
    
    getOrganizationPaymentById(
        organization_id: string,
        payment_id: string
    ): Promise<TOrganizationPaymentSelect>;
    
    getOrganizationPaymentsByOrganizationId(organization_id: string): Promise<TOrganizationPaymentSelect[]>;
    
    updateOrganizationPaymentById(
        organization_id: string,
        payment_id: string,
        paymentUpdates: TUpdateOrganizationPayment,
    ): Promise<TOrganizationPaymentSelect[]>;
    
    // --- CLIENT ---
    addClient(
        organization_id: string,
        clientDetails: TCreateClient
    ): Promise<TClientSelect[]>;
    
    getClientProfileById(
        organization_id: string,
        client_id: string,
    ): Promise<TClientSelect>;
    
    getClientsByOrganizationId(organization_id: string): Promise<TClientSelect[]>;
    
    updateClientById(
        organization_id: string,
        client_id: string,
        clientUpdates: TUpdateClient,
    ): Promise<TClientSelect[]>;
    
    updateClientsByIds(
        organization_id: string,
        clients_ids: string[],
        clientUpdates: TUpdateClient,
    ): Promise<TClientSelect[]>;
    
    // --- CLIENT PAYMENTS ---
    addClientPayment(
        organization_id: string,
        client_id: string,
        paymentDetails: TCreateClientPayment
    ): Promise<TClientPaymentSelect[]>
    
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
        payment_id: string,
        clientPaymentUpdates: TUpdateClientPayment,
    ): Promise<TClientPaymentSelect[]>;
}

//
//
// // Employee Types
// export type TCreateEmployee = Pick<TEmployeeCredentialsInsert,
// 'employee_credential_username' | 'employee_credential_password'>; export
// type TEmployeeProfile = TEmployeeSelect & { employee_sales: TSaleSelect[];
// employee_leaves: TEmployeeLeavesSelect; employee_salary:
// TEmployeeSalarySelect; }; export type TUpdateEmployee =
// Omit<TEmployeeUpdate, 'employee_id' | 'employee_organization_id'>; export
// type TUpdateEmployeeCredentials = Omit<TEmployeeCredentialsUpdate,
// 'employee_credential_id' | 'employee_credential_organization_id' |
// 'employee_credential_employee_id'>; export type EmployeeLeavesUpdateData =
// Omit<TEmployeeLeavesUpdate, 'employee_leave_id' |
// 'employee_leave_organization_id' | 'employee_leave_employee_id'>; export
// type EmployeeSalaryUpdateData = Omit<TEmployeeSalaryUpdate,
// 'employee_salary_id' | 'employee_salary_organization_id' |
// 'employee_salary_employee_id'>;  // Item Types export type ItemInsertData =
// Omit<TItemInsert, 'item_organization_id'>; export type ItemUpdateData =
// Omit<TItemUpdate, 'item_organization_id' | 'item_id'>;  // Sales Group Types
// export type SalesGroupInsertData = Omit<TSalesGroupInsert,
// 'sales_group_organization_id'>; export type SalesGroupDetailsWithEmployees =
// TSalesGroupSelect & { sales_group_employees: (TEmployeeSelect & {
// employee_sales: TSaleSelect[]; employee_leaves: TEmployeeLeavesSelect; })[];
// }; export type SalesGroupUpdateData = Omit<TSalesGroupUpdate,
// 'sales_group_organization_id' | 'sales_group_id'>;  // Sale Types export
// type SaleInsertData = Omit<TSaleInsert, 'sale_organization_id' |
// 'sale_employee_id'>; export type SaleUpdateData = Omit<TSaleUpdate,
// 'sale_id' | 'sale_organization_id' | 'sale_employee_id'>;  // Organization
// Payment Types export type OrganizationPaymentInsertData =
// Omit<TOrganizationPaymentInsert, 'organization_payment_organization_id'>;
// export type OrganizationPaymentUpdateData = Omit<TOrganizationPaymentUpdate,
// 'organization_payment_id' | 'organization_payment_organization_id'>;  //
// Client Types export type ClientInsertData = Omit<TClientInsert,
// 'client_organization_id'>; export type ClientUpdateData =
// Omit<TClientUpdate, 'client_id' | 'client_organization_id'>;  // Client
// Payment Types export type ClientPaymentInsertData =
// Omit<TClientPaymentInsert, 'client_payment_organization_id' |
// 'client_payment_client_id'>; export type ClientPaymentUpdateData =
// Omit<TClientPaymentUpdate, 'client_payment_id' |
// 'client_payment_organization_id' | 'client_payment_client_id'>;  export
// default interface IOrmInterface { // --- ORGANIZATION --- // Returns single
// object as requested addOrganization(organizationDetails:
// TOrganizationInsert): Promise<TOrganizationSelect>;
// getOrganizationDetailsById(organization_id: string):
// Promise<TOrganizationSelect>;  getOrganizationDetailsByAdminId(admin_id:
// string): Promise<TOrganizationSelect>;  updateOrganizationById(
// organization_id: string, organizationUpdates: TOrganizationUpdate, ):
// Promise<TOrganizationSelect>;  // --- EMPLOYEE (Transaction-based
// Onboarding) --- addEmployee( organization_id: string, employeeCredentials:
// Pick<TEmployeeCredentialsInsert, 'employee_credential_username' |
// 'employee_credential_password'> ): Promise<TEmployeeSelect[]>;
// getEmployeeProfileById( organization_id: string, employee_id: string, ):
// Promise<TEmployeeSelect & { employee_sales: TSaleSelect[]; employee_leaves:
// TEmployeeLeavesSelect; employee_salary: TEmployeeSalarySelect }>;
// getEmployeesByOrganizationId(organization_id: string):
// Promise<TEmployeeSelect[]>;  getEmployeesBySalesGroupId( organization_id:
// string, sales_group_id: string, ): Promise<TEmployeeSelect[]>;
// updateEmployeeById( organization_id: string, employee_id: string,
// employeeUpdates: Omit<TEmployeeUpdate, 'employee_id' |
// 'employee_organization_id'>, ): Promise<TEmployeeSelect[]>;
// updateEmployeesByIds( organization_id: string, employees_ids: string[],
// employeeUpdates: Omit<TEmployeeUpdate, 'employee_id' |
// 'employee_organization_id'>, ): Promise<TEmployeeSelect[]>;  // --- EMPLOYEE
// CREDENTIALS (Security Update) --- updateEmployeeCredentials( organization_id: string, employee_id: string, credentialUpdates: Omit<TEmployeeCredentialsUpdate, 'employee_credential_id' | 'employee_credential_organization_id' | 'employee_credential_employee_id'> ): Promise<TEmployeeCredentialsSelect>;  // --- EMPLOYEE LEAVE --- updateEmployeeLeave( organization_id: string, employee_id: string, employeeLeavesUpdates: Omit<TEmployeeLeavesUpdate, 'employee_leave_id' | 'employee_leave_organization_id' | 'employee_leave_employee_id'> // Changed from employee_salary_id to employee_leave_id ): Promise<TEmployeeLeavesSelect>;  // --- EMPLOYEE SALARY --- updateEmployeeSalary( organization_id: string, employee_id: string, employeeSalaryUpdates: Omit<TEmployeeSalaryUpdate, 'employee_salary_id' | 'employee_salary_organization_id' | 'employee_salary_employee_id'> ): Promise<TEmployeeSalarySelect>;  // --- ITEM --- addItem( organization_id: string, itemDetails: Omit<TItemInsert, 'item_organization_id'> ): Promise<TItemSelect[]>;  getItemById( organization_id: string, item_id: string ): Promise<TItemSelect>;  getItemsByOrganizationId(organization_id: string): Promise<TItemSelect[]>;  updateItemById( organization_id: string, item_id: string, itemUpdates: Omit<TItemUpdate, 'item_organization_id' | 'item_id'>, ): Promise<TItemSelect[]>;  updateItemsByIds( organization_id: string, items_ids: string[], itemUpdates: Omit<TItemUpdate, 'item_organization_id' | 'item_id'>, ): Promise<TItemSelect[]>;  // --- SALES_GROUP --- addSalesGroup( organization_id: string, salesGroupDetails: Omit<TSalesGroupInsert, 'sales_group_organization_id'> ): Promise<TSalesGroupSelect[]>;  getSalesGroupsByOrganizationId(organization_id: string): Promise<TSalesGroupSelect[]>;  getSalesGroupDetailsById( organization_id: string, sales_group_id: string, ): Promise<TSalesGroupSelect & { sales_group_employees: (TEmployeeSelect & { employee_sales: TSaleSelect[]; employee_leaves: TEmployeeLeavesSelect })[] }>;  updateSalesGroupById( organization_id: string, sales_group_id: string, salesGroupUpdates: Omit<TSalesGroupUpdate, 'sales_group_organization_id' | 'sales_group_id'>, ): Promise<TSalesGroupSelect[]>;  deleteSalesGroupById( organization_id: string, sales_group_id: string ): Promise<TSalesGroupSelect[]>  // --- SALE --- addSale( organization_id: string, employee_id: string, saleDetails: Omit<TSaleInsert, 'sale_organization_id' | 'sale_employee_id'> ): Promise<TSaleSelect[]>;  getSaleById( organization_id: string, sale_id: string ): Promise<TSaleSelect>;  getSalesByEmployeeId( organization_id: string, employee_id: string, ): Promise<TSaleSelect[]>;  getSalesByClientId( organization_id: string, client_id: string, ): Promise<TSaleSelect[]>;  getSalesByItemId( organization_id: string, item_id: string ): Promise<TSaleSelect[]>;  getSalesByOrganizationId(organization_id: string): Promise<TSaleSelect[]>;  getSalesByDate( organization_id: string, date: number ): Promise<TSaleSelect[]>;  getSalesWithinDates( organization_id: string, date_start: number, date_end: number, ): Promise<TSaleSelect[]>;  updateSaleById( organization_id: string, sale_id: string, saleUpdates: Omit<TSaleUpdate, 'sale_id' | 'sale_organization_id' | 'sale_employee_id'>, ): Promise<TSaleSelect[]>;  // --- ORGANIZATION PAYMENT --- addOrganizationPayment( organization_id: string, paymentDetails: Omit<TOrganizationPaymentInsert, 'organization_payment_organization_id'>, ): Promise<TOrganizationPaymentSelect[]>;  getOrganizationPaymentById( organization_id: string, payment_id: string ): Promise<TOrganizationPaymentSelect>;  getOrganizationPaymentsByOrganizationId(organization_id: string): Promise<TOrganizationPaymentSelect[]>;  updateOrganizationPaymentById( organization_id: string, payment_id: string, paymentUpdates: Omit<TOrganizationPaymentUpdate, 'organization_payment_id' | 'organization_payment_organization_id'>, ): Promise<TOrganizationPaymentSelect[]>;  // --- CLIENT --- addClient( organization_id: string, clientDetails: Omit<TClientInsert, 'client_organization_id'> ): Promise<TClientSelect[]>;  getClientProfileById( organization_id: string, client_id: string, ): Promise<TClientSelect>;  getClientsByOrganizationId(organization_id: string): Promise<TClientSelect[]>;  updateClientById( organization_id: string, client_id: string, clientUpdates: Omit<TClientUpdate, 'client_id' | 'client_organization_id'>, ): Promise<TClientSelect[]>;  updateClientsByIds( organization_id: string, clients_ids: string[], clientUpdates: Omit<TClientUpdate, 'client_organization_id' | 'client_id'>, ): Promise<TClientSelect[]>;  // --- CLIENT PAYMENTS --- addClientPayment( organization_id: string, client_id: string, paymentDetails: Omit<TClientPaymentInsert, 'client_payment_organization_id' | 'client_payment_client_id'> ): Promise<TClientPaymentSelect[]>  getClientPaymentById( organization_id: string, payment_id: string, ): Promise<TClientPaymentSelect>;  getClientPaymentsByClientId( organization_id: string, client_id: string, ): Promise<TClientPaymentSelect[]>;  updateClientPaymentById( organization_id: string, payment_id: string, clientPaymentUpdates: Omit<TClientPaymentUpdate, 'client_payment_id' | 'client_payment_organization_id' | 'client_payment_client_id'>, ): Promise<TClientPaymentSelect[]>; }
