export interface IOrder {
  order_id: number;
  user_id: number;
  state_id: number;
  customer_name: string;
  delivery_address: string;
  phone: string;
  email: string;
  created_at: string;
  delivery_date: string;
  order_total: number;
  client_id: number;
  order_number?: string;
  tax_amount?: number;
  discount_amount?: number;
  shipping_cost?: number;
  payment_method?: string;
  payment_status?: string;
  notes?: string;
  tracking_number?: string;
  delivered_at?: string;
  updated_at?: string;
}

export interface IOrderDetails {
  detail_id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  discount_amount?: number;
  line_total?: number;
  created_at?: string;
}

interface DetalleProducto {
  product_id: number;
  quantity?: number;
  unit_price: number;
  discount_percentage?: number;
}

export interface OrderRequest {
  state_id: number;
  customer_name: string;
  delivery_address: string;
  phone: string;
  email: string;
  delivery_date: string;
  client_id: number;
  order_details: DetalleProducto[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    order_id: number;
  }
}

export interface OrderResponseGet {
  success: boolean;
  message: string;
  data: IOrder[]
}