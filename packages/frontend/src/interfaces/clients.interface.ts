export interface IClient {
  client_id: number;
  business_name: string;
  commercial_name: string;
  delivery_address: string;
  phone: string;
  email: string;
  tax_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientResponseGet {
  success: boolean;
  count: number;
  data: IClient[];
}

export interface IClientCreate {
  business_name: string;
  commercial_name: string;
  delivery_address: string;
  phone: string;
  email: string;
  tax_id?: string;
}