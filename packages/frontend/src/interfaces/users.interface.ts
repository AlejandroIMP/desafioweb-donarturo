import { IUser } from '@/interfaces/auth.interface';

export interface IUserCreate {
  role_id: number;
  state_id: number;
  email: string;
  full_name: string;
  password_hash: string;
  phone: string;
  birth_date: string;
  client_id: number | null;
}

export interface IUserUpdate {
  role_id: number;
  state_id: number;
  email: string;
  full_name: string;
  phone: string;
  birth_date: string;
  client_id?: number;
}

export interface userResponsePost {
  succcess: boolean;
  data: IUser;
  message: string;
}