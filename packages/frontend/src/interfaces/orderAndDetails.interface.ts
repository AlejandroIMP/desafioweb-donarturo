export interface IOrder {
  idOrden: number;
  idusuarios: number;
  estados_idestados: number;
  nombre_completo: string;
  direccion: string;
  telefono: string;
  correo_electronico: string;
  fecha_creacion: string;
  fecha_entrega: string;
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
  cantidad?: number;
  precio: number;
}

export interface OrderRequest {
  estados_idestados: number;
  nombre_completo: string;
  direccion: string;
  telefono: string;
  correo_electronico: string;
  fecha_entrega: string;
  Clientes_idClientes: number;
  DetallesProductos: DetalleProducto[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    idOrder: number;
  }
}

export interface OrderResponseGet {
  success: boolean;
  message: string;
  data: IOrder[]
}