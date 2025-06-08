export interface IProduct {
  product_id?: number;
  category_id: number;
  user_id: number;
  state_id: number;
  product_name: string;
  brand: string;
  product_code: string;
  stock_quantity: number;
  unit_price: number;
  description?: string;
  image_url?: string;
  cloudinary_public_id?: string;
  weight?: number;
  dimensions?: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}