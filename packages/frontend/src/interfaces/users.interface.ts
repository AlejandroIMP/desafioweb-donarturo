import { IUser } from '@/interfaces/auth.interface';

export interface IUserCreate {
  rol_idrol: number;
  estados_idestados: number;
  correo_electronico: string;
  nombre_completo: string;
  user_password: string;
  telefono: string;
  fecha_nacimiento: string;
  Clientes_idClientes: number | null;
}

export interface IUserUpdate {
  rol_idrol: number;
  estados_idestados: number;
  correo_electronico: string;
  nombre_completo: string;
  telefono: string;
  fecha_nacimiento: string;
  Clientes_idClientes?: number;
}

export interface userResponsePost {
  succcess: boolean;
  data: IUser;
  message: string;
}