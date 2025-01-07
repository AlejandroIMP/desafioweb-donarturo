import { IUser } from '@/interfaces/auth.interface';

export interface createUserDta {
  rol_idrol: number;
  estados_idestados: number;
  correo_electronico: string;
  user_password: string;
  nombre_completo: string;
  telefono: string;
  fecha_nacimiento: string;
  Clientes_idClientes: number;
}

export interface updateUserDta {
  rol_idrol: number;
  estados_idestados: number;
  correo_electronico: string;
  user_password: string;
  nombre_completo: string;
  telefono: string;
  fecha_nacimiento: string;
  Clientes_idClientes: string;
}

export interface userResponsePost {
  succcess: boolean;
  data: IUser;
  message: string;
}