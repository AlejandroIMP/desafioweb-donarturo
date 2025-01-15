export interface IUser {
  idusuarios?: number;
  rol_idrol?: number;
  estados_idestados: number;
  correo_electronico: string;
  nombre_completo: string;
  user_password: string;
  telefono: string;
  fecha_nacimiento: Date;
  fecha_creacion?: Date;
  Clientes_idClientes?: number | null;
}