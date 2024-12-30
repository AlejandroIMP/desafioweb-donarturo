export interface IOrder {
  idOrden?: number;
  idusuarios: number;
  estados_idestados: number;
  nombre_completo: string;
  direccion: string;
  telefono: string;
  correo_electronico: string;
  fecha_creacion?: Date;
  fecha_entrega: Date;
  total_orden: number;
  Clientes_idClientes: number;
}
