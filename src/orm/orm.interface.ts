import {
    TPGClient,
    TPGClientPayment,
    TPGEmployee,
    TPGItem,
    TPGOrganization,
    TPGOrganizationPayment,
    TPGSale,
    TPGSalesGroup,
} from './drizzle/drizzle-postgres/drizzle-postgres.schema';
import {
    TSQLiteClient,
    TSQLiteClientPayment,
    TSQLiteEmployee,
    TSQLiteItem,
    TSQLiteOrganization,
    TSQLiteOrganizationPayment,
    TSQLiteSale,
    TSQLiteSalesGroup,
} from './drizzle/drizzle-sqlite/drizzle-sqlite.schema';



export type TOrganization =
    TPGOrganization
    | TSQLiteOrganization;
export type TEmployee =
    TPGEmployee
    | TSQLiteEmployee;
export type TItem =
    TPGItem
    | TSQLiteItem;
export type TSalesGroup =
    TPGSalesGroup
    | TSQLiteSalesGroup;
export type TClient =
    TPGClient
    | TSQLiteClient;
export type TSale =
    TPGSale
    | TSQLiteSale;
export type TOrganizationPayment =
    | TPGOrganizationPayment
    | TSQLiteOrganizationPayment;
export type TClientPayment =
    TPGClientPayment
    | TSQLiteClientPayment;

export default interface IOrmInterface {
    addOrganization(organizationDetails: TOrganization): Promise<TOrganization>;
    
    getOrganizationDetailsById(organization_id: string): Promise<TOrganization>;
    
    getOrganizationDetailsByAdminId(admin_id: string): Promise<TOrganization>;
    
    updateOrganizationById(
        organization_id: string,
        organizationUpdates: Partial<TOrganization>,
    ): Promise<TOrganization>;
    
    //   EMPLOYEE
    addEmployee(
        organization_id: string,
        employeeDetails: {
            employee_nic_number: string;
            employee_password: string
        }
    ): Promise<TEmployee[]>;
    
    viewEmployeeById(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployee>;
    
    getEmployeesByOrganizationId(organization_id: string): Promise<TEmployee[]>;
    
    getEmployeesBySalesGroupId(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TEmployee[]>;
    
    updateEmployeeById(
        organization_id: string,
        employee_id: string,
        employeeUpdates: Partial<TEmployee>,
    ): Promise<TEmployee[]>;
    
    updateEmployeesByIds(
        organization_id: string,
        employees_ids: string[],
        employeeUpdates: Partial<TEmployee>,
    ): Promise<TEmployee[]>;
    
    deleteEmployeeById(
        organization_id: string,
        employee_id: string,
    ): Promise<TEmployee[]>;
    
    //   ITEM
    addItem(itemDetails: TItem): Promise<TItem[]>;
    
    viewItemById(organization_id: string, item_id: string): Promise<TItem>;
    
    getItemsByOrganizationId(organization_id: string): Promise<TItem[]>;
    
    updateItemById(
        organization_id: string,
        item_id: string,
        itemUpdates: Partial<TItem>,
    ): Promise<TItem[]>;
    
    updateItemsByIds(
        organization_id: string,
        items_ids: string[],
        itemUpdates: Partial<TItem>,
    ): Promise<TItem[]>;
    
    deleteItemById(organization_id: string, item_id: string): Promise<TItem[]>
    
    deleteItemsByIds(
        organization_id: string,
        items_ids: string[],
    ): Promise<TItem[]>;
    
    //   SALES_GROUP
    addSalesGroup(salesGroupDetails: TSalesGroup): Promise<TSalesGroup[]>;
    
    getSalesGroupsByOrganizationId(organization_id: string,): Promise<TSalesGroup[]>;
    
    getSalesGroupDetailsById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroup>;
    
    updateSalesGroupById(
        organization_id: string,
        sales_group_id: string,
        salesGroupUpdates: Partial<TSalesGroup>,
    ): Promise<TSalesGroup[]>;
    
    deleteSalesGroupById(
        organization_id: string,
        sales_group_id: string,
    ): Promise<TSalesGroup[]>;
    
    //   SALE
    addSaleItem(saleDetails: TSale): Promise<TSale[]>;
    
    viewSaleById(organization_id: string, sale_id: string): Promise<TSale>;
    
    getSalesByEmployeeId(
        organization_id: string,
        employee_id: string,
    ): Promise<TSale[]>;
    
    getSalesByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TSale[]>;
    
    getSalesByItemId(
        organization_id: string,
        item_id: string
    ): Promise<TSale[]>;
    
    getSalesByOrganizationId(organization_id: string): Promise<TSale[]>;
    
    getSalesByDate(organization_id: string, date: number): Promise<TSale[]>;
    
    getSalesWithinDates(
        organization_id: string,
        date_start: number,
        date_end: number,
    ): Promise<TSale[]>;
    
    //   PAYMENT
    addOrganizationPayment(paymentDetails: TOrganizationPayment,): Promise<TOrganizationPayment[]>;
    
    getOrganizationPaymentById(
        organization_id: string,
        payment_id: string
    ): Promise<TOrganizationPayment>
    
    getOrganizationPaymentsByOrganizationId(organization_id: string,): Promise<TOrganizationPayment[]>;
    
    updateOrganizationPaymentById(
        organization_id: string,
        payment_id: string,
        paymentUpdates: Partial<TOrganizationPayment>,
    ): Promise<TOrganizationPayment[]>;
    
    //   CLIENT
    addClient(clientDetails: TClient): Promise<TClient[]>;
    
    getClientProfileById(
        organization_id: string,
        client_id: string,
    ): Promise<TClient>;
    
    getClientsByOrganizationId(organization_id: string): Promise<TClient[]>;
    
    updateClientById(
        organization_id: string,
        client_id: string,
        clientUpdates: Partial<TClient>,
    ): Promise<TClient[]>;
    
    updateClientsByIds(
        organization_id: string,
        clients_ids: string[],
        clientUpdates: Partial<TClient>,
    ): Promise<TClient[]>;
    
    //   CLIENT PAYMENTS
    addClientPayment(paymentDetails: TClientPayment): Promise<TClientPayment[]>;
    
    getClientPaymentById(
        organization_id: string,
        payment_id: string,
    ): Promise<TClientPayment>;
    
    getClientPaymentsByClientId(
        organization_id: string,
        client_id: string,
    ): Promise<TClientPayment[]>;
    
    updateClientPaymentById(
        organization_id: string,
        client_payment_id: string,
        clientPaymentUpdates: Partial<TClientPayment>,
    ): Promise<TClientPayment[]>;
}
