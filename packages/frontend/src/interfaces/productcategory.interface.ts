export interface IProductCategory {
  category_id: number;
  user_id: number;
  category_name: string;
  state_id: number;
  category_description?: string;
  is_deleted?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ProductCategoryResponseGet {
  success: boolean;
  data: IProductCategory[];
  count: number; 
}

export interface ICategory {
  category_id: number;
  user_id: number;
  category_name: string;
  state_id: number;
}

export interface ICategoryCreate {
  user_id: number;
  category_name: string;
  state_id: number;
  category_description?: string;
}