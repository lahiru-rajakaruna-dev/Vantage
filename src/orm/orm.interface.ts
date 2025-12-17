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
  addOrganization(organizationDetails: TOrganization): TOrganization;
  getOrganizationDetailsById(organization_id: string): TOrganization;
  updateOrganizationById(
    organization_id: string,
    organizationUpdates: Partial<TOrganization>,
  ): TOrganization;

  //   EMPLOYEE
  addEmployee(employeeDetails: TEmployee): TEmployee;
  viewEmployeeById(employee_id: string): TEmployee;
  getEmployeesByOrganizationId(organization_id: string): TEmployee[];
  getEmployeesBySalesGroupId(sales_group_id: string): TEmployee[];
  updateEmployeeById(
    employee_id: string,
    employeeUpdates: Partial<TEmployee>,
  ): TEmployee;
  deleteEmployeeById(employee_id: string): TEmployee;

  //   ITEM
  addItem(itemDetails: TItem): TItem;
  viewItemById(item_id: string): TItem;
  getItemsByOrganizationId(organization_id: string): TItem[];
  updateItemById(item_id: string, itemUpdates: Partial<TItem>): TItem;
  deleteItemById(item_id: string): TItem;

  //   SALES_GROUP
  addSalesGroup(salesGroupDetails: TSalesGroup): TSalesGroup;
  getSalesGroupsByOrganizationId(organization_id: string): TSalesGroup;
  updateSalesGroupById(
    sales_group_id: string,
    salesGroupUpdates: Partial<TSalesGroup>,
  ): TSalesGroup;
  deleteSalesGroupById(sales_group_id: string): TSalesGroup;

  //   SALE
  addSaleItem(saleDetails: TSale): TSale;
  viewSaleById(sale_id: string): TSale;
  getSalesByEmployeeId(employee_id: string): TSale[];
  getSalesByClientId(client_id: string): TSale[];
  getSalesByItemId(item_id: string): TSale[];
  getSalesByOrganizationId(organization_id: string): TSale[];

  //   PAYMENT
  addOrganizationPayment(
    paymentDetails: TOrganizationPayment,
  ): TOrganizationPayment;
  getOrganizationPaymentsByOrganizationId(
    organization_id: string,
  ): TOrganizationPayment[];
  updateOrganizationPaymentById(
    payment_id: string,
    paymentUpdates: Partial<TOrganizationPayment>,
  ): TOrganizationPayment;

  //   CLIENT
  addClient(clientDetails: TClient): TClient;
  getClientsByOrganizationId(organization_id: string): TClient[];
  updateClientById(client_id: string, clientUpdates: Partial<TClient>): TClient;

  //   CLIENT PAYMENTS
  addClientPayment(paymentDetails: TClientPayment): TClientPayment;
  getClientPaymentsByClientId(client_id: string): TClientPayment[];
  updateClientPaymentById(
    client_payment_id: string,
    clientPaymentUpdates: Partial<TClientPayment>,
  ): TClientPayment;
}
