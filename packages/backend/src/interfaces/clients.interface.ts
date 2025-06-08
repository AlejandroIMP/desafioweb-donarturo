export interface IClient {
  client_id?: number;
  business_name: string;
  commercial_name?: string;
  delivery_address: string;
  phone: string;
  email: string;
  tax_id?: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}