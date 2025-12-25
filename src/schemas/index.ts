import * as z from 'zod';

export const SchemaEmployee = z.object({
  employee_username: z.string(),
  employee_phone: z.string(),
  employee_nic_number: z.string(),
});

export const SchemaOrganization = z.object({
  organization_name: z.string(),
  organization_email: z.string(),
  organization_phone: z.string(),
});

export const SchemaClient = z.object({
  client_username: z.string(),
  client_nic_number: z.string(),
  client_phone: z.string(),
  client_email: z.string(),
});

export const SchemaItem = z.object({
  item_name: z.string(),
  item_stock_unit_count: z.int(),
});

export const SchemaSalesGroup = z.object({
  sales_group_name: z.string(),
});

export const SchemaSale = z.object({
  sale_client_id: z.uuid(),
  sale_item_id: z.uuid(),
  sale_employee_id: z.uuid(),
  sale_organization_id: z.uuid(),
  sale_unit_count: z.int(),
  sale_client_payment_id: z.uuid(),
});

export const SchemaOrganizationPayment = z.object({
  payment_amount: z.number(),
});

export const SchemaClientPayment = z.object({
  client_payment_client_id: z.uuid(),
  client_payment_amount: z.number(),
});
