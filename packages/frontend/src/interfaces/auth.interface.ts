export interface IUser {
  idusuarios?: number;
  rol_idrol: number;
  estados_idestados: number;
  correo_electronico: string;
  nombre_completo: string;
  user_password: string;
  telefono: string;
  fecha_nacimiento: Date;
  fecha_creacion?: Date;
  Clientes_idClientes: number;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    rol: number;
    email: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface Country {
  code: string;
  label: string;
  prefix: string;
}