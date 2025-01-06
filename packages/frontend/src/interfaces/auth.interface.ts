export interface IUser {
  idusuarios: number;
  rol_idrol: number;
  estados_idestados: number;
  correo_electronico: string;
  nombre_completo: string;
  user_password: string;
  telefono: string;
  fecha_nacimiento: string;
  fecha_creacion: string;
  Clientes_idClientes: number;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
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

export interface userResponseGet {
  succcess: boolean;
  data: IUser[];
  count: number;
}