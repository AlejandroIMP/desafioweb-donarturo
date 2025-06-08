export interface IProductCategory {
  category_id?: number;
  user_id: number;
  state_id: number;
  category_name: string;
  category_description?: string;
  is_deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}