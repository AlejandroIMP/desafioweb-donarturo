export interface IProduct {
  product_id: number;
  category_id: number;
  user_id: number;
  product_name: string;
  brand: string;
  product_code: string;
  stock_quantity: number;
  state_id: number;
  unit_price: number;
  created_at: string;
  image_url: string;
  description?: string;
  cloudinary_public_id?: string;
  weight?: number;
  dimensions?: string;
  is_deleted?: boolean;
  updated_at?: string;
}

export interface ProductResponse {
  success: boolean;
  data: DataProduct[];
  count: number;
}

export interface CartProduct extends DataProduct {
  quantity?: number;
}

export interface IProductCreate {
  category_id: number;  // Convertido a number antes de enviarlo
  user_id: string;      // Se mantiene como string en el formulario
  product_name: string;
  brand: string;
  product_code: string;
  stock_quantity: number; // Convertido a number antes de enviarlo
  state_id: number;      // Convertido a number antes de enviarlo 
  unit_price: number;    // Convertido a number antes de enviarlo
  image_url: string;
  description?: string;
}

export interface DataProduct {
  product_id: number;
  product_name: string;
  brand: string;
  product_code: string;
  stock_quantity: number;
  unit_price: number;
  image_url: string;
  created_at: string;
  description?: string;
  cloudinary_public_id?: string;
  weight?: number;
  dimensions?: string;
  category: {
    category_name: string;
    category_id: number;
  }
  user: {
    full_name: string;
    user_id: number;
  }
  state: {
    state_name: string;
    state_id: number;
  }
}