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

export interface IOrderDetails {
  idOrdenDetalles?: number;
  idOrden: number;
  idProductos: number;
  cantidad: number;
  precio: number;
  subtotal: number;
}

interface DetalleProducto {
  idProductos: number;
  cantidad: number;
  precio: number;
}

export interface OrderRequest {
  idusuarios?: number;
  estados_idestados: number;
  nombre_completo: string;
  direccion: string;
  telefono: string;
  correo_electronico: string;
  fecha_entrega: string;
  Clientes_idClientes: number;
  DetallesProductos: DetalleProducto[];
}