export interface IOrder {
  order_id?: number;
  user_id: number;
  client_id: number;
  state_id: number;
  order_number?: string;
  customer_name: string;
  delivery_address: string;
  phone: string;
  email: string;
  order_total: number;
  tax_amount?: number;
  delivery_date?: Date;
  special_instructions?: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface IOrderDetails {
  order_detail_id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total?: number;
  discount_percentage?: number;
  discount_amount?: number;
  final_total?: number;
  is_deleted?: boolean;
  created_at?: Date;
}

interface ProductDetail {
  product_id: number;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
}

export interface OrderRequest {
  user_id?: number;
  client_id: number;
  state_id: number;
  customer_name: string;
  delivery_address: string;
  phone: string;
  email: string;
  delivery_date?: string;
  special_instructions?: string;
  product_details: ProductDetail[];
}