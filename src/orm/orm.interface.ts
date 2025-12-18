import {
  TClient,
  TClientPayment,
  TEmployee,
  TItem,
  TOrganization,
  TOrganizationPayment,
  TSale,
  TSalesGroup,
} from './drizzle/drizzle-postgres/drizzle-postgres.schema';

export default interface IOrmInterface {
  addOrganization(organizationDetails: TOrganization): Promise<TOrganization>;
  getOrganizationDetailsById(organization_id: string): Promise<TOrganization>;
  updateOrganizationById(
    organization_id: string,
    organizationUpdates: Partial<TOrganization>,
  ): Promise<TOrganization>;

  //   EMPLOYEE
  addEmployee(employeeDetails: TEmployee): Promise<TEmployee>;
  viewEmployeeById(employee_id: string): Promise<TEmployee>;
  getEmployeesByOrganizationId(organization_id: string): Promise<TEmployee[]>;
  getEmployeesBySalesGroupId(sales_group_id: string): Promise<TEmployee[]>;
  updateEmployeeById(
    employee_id: string,
    employeeUpdates: Partial<TEmployee>,
  ): Promise<TEmployee>;
  deleteEmployeeById(employee_id: string): Promise<TEmployee>;

  //   ITEM
  addItem(itemDetails: TItem): Promise<TItem>;
  viewItemById(item_id: string): Promise<TItem>;
  getItemsByOrganizationId(organization_id: string): Promise<TItem[]>;
  updateItemById(item_id: string, itemUpdates: Partial<TItem>): Promise<TItem>;
  deleteItemById(item_id: string): Promise<TItem>;

  //   SALES_GROUP
  addSalesGroup(salesGroupDetails: TSalesGroup): Promise<TSalesGroup>;
  getSalesGroupsByOrganizationId(organization_id: string): Promise<TSalesGroup>;
  updateSalesGroupById(
    sales_group_id: string,
    salesGroupUpdates: Partial<TSalesGroup>,
  ): Promise<TSalesGroup>;
  deleteSalesGroupById(sales_group_id: string): Promise<TSalesGroup>;

  //   SALE
  addSaleItem(saleDetails: TSale): Promise<TSale>;
  viewSaleById(sale_id: string): Promise<TSale>;
  getSalesByEmployeeId(employee_id: string): Promise<TSale[]>;
  getSalesByClientId(client_id: string): Promise<TSale[]>;
  getSalesByItemId(item_id: string): Promise<TSale[]>;
  getSalesByOrganizationId(organization_id: string): Promise<TSale[]>;
  getSalesByDate(date: number): Promise<TSale[]>;
  getSalesWithinDates(date_start: number, date_end: number): Promise<TSale[]>;

  //   PAYMENT
  addOrganizationPayment(
    paymentDetails: TOrganizationPayment,
  ): Promise<TOrganizationPayment>;
  getOrganizationPaymentsByOrganizationId(
    organization_id: string,
  ): Promise<TOrganizationPayment[]>;
  updateOrganizationPaymentById(
    payment_id: string,
    paymentUpdates: Partial<TOrganizationPayment>,
  ): Promise<TOrganizationPayment>;

  //   CLIENT
  addClient(clientDetails: TClient): Promise<TClient>;
  getClientProfileById(client_id: string): Promise<TClient>;
  getClientsByOrganizationId(organization_id: string): Promise<TClient[]>;
  updateClientById(
    client_id: string,
    clientUpdates: Partial<TClient>,
  ): Promise<TClient>;

  //   CLIENT PAYMENTS
  addClientPayment(paymentDetails: TClientPayment): Promise<TClientPayment>;
  getClientPaymentById(payment_id: string): Promise<TClientPayment>;
  getClientPaymentsByClientId(client_id: string): Promise<TClientPayment[]>;
  updateClientPaymentById(
    client_payment_id: string,
    clientPaymentUpdates: Partial<TClientPayment>,
  ): Promise<TClientPayment>;
}
