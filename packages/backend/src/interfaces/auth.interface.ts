export interface IUser {
  user_id?: number;
  role_id: number;
  state_id: number;
  email: string;
  full_name: string;
  password_hash: string;
  phone?: string;
  birth_date?: Date;
  last_login?: Date;
  failed_login_attempts?: number;
  locked_until?: Date;
  password_changed_at?: Date;
  deleted_at?: Date;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}