import { z } from 'zod';
import { EPaymentStatus } from '../types';

export const SchemaEmployee = z.object({
  employee_id: z.string(),
  employee_organization_id: z.string(),
  employee_sales_group_id: z.string(),
  employee_username: z.string(),
  employee_phone: z.string(),
  employee_nic_number: z.string(),
});

export type TEmployee = z.infer<typeof SchemaEmployee>;

export const SchemaOrganization = z.object({
  organization_id: z.string(),
  organization_name: z.string(),
  organization_email: z.string(),
  organization_phone: z.string(),
});

export type TOrganization = z.infer<typeof SchemaOrganization>;

export const SchemaClient = z.object({
  client_id: z.string(),
  client_organization_id: z.string(),
  client_paddle_customer_id: z.string(),
  client_username: z.string(),
  client_nic_number: z.string(),
  client_phone: z.string(),
  client_email: z.string(),
});

export type TClient = z.infer<typeof SchemaClient>;

export const SchemaItem = z.object({
  item_id: z.string(),
  item_organization_id: z.string(),
  item_name: z.string(),
  item_stock_unit_count: z.int(),
});

export type TItem = z.infer<typeof SchemaItem>;

export const SchemaSalesGroup = z.object({
  sales_group_id: z.string(),
  sales_group_organization_id: z.string(),
  sales_group_name: z.string(),
});

export type TSalesGroup = z.infer<typeof SchemaSalesGroup>;

export const SchemaSale = z.object({
  sale_client_id: z.uuid(),
  sale_item_id: z.uuid(),
  sale_employee_id: z.uuid(),
  sale_organization_id: z.uuid(),
  sale_unit_count: z.int(),
  sale_client_payment_id: z.uuid(),
});

export type TSale = z.infer<typeof SchemaSale>;

export const SchemaOrganizationPayment = z.object({
  payment_id: z.string(),
  payment_organization_id: z.string(),
  payment_amount: z.number(),
  payment_status: z.enum(EPaymentStatus),
  payment_timestamp: z.int(),
});

export type TOrganizationPayment = z.infer<typeof SchemaOrganizationPayment>;

export const SchemaClientPayment = z.object({
  client_payment_id: z.string(),
  client_payment_client_id: z.uuid(),
  client_payment_organization_id: z.string(),
  client_payment_amount: z.number(),
});

export type TClientPayment = z.infer<typeof SchemaClientPayment>;
