export interface IUser {
  user_id: number;
  role_id: number;
  state_id: number;
  email: string;
  full_name: string;
  password_hash: string;
  phone: string;
  birth_date: string;
  created_at: string;
  client_id?: number;
  failed_login_attempts?: number;
  last_login?: Date;
  locked_until?: Date;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    user_id: number;
    email: string;
    full_name: string;
    role_id: number;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    user_id: number;
    email: string;
    full_name: string;
    role_id: number;
    state_id: number;
  };
}

export interface LoginErrorResponse {
  success: false;
  message: string;
  attempts_remaining?: number;
  locked_until?: Date;
}

export interface Country {
  code: string;
  label: string;
  prefix: string;
}

export interface userResponseGet {
  success: boolean;
  data: IUser[];
  count: number;
}