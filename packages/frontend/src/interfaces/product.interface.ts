export interface IProduct {
  idProductos: number;
  CategoriaProductos_idCategoriaProductos: number;
  usuarios_idusuarios: number;
  nombre: string;
  marca: string;
  codigo: string;
  stock: number;
  estados_idestados: number;
  precio: number;
  fecha_creacion?: string;
  foto: string;
}

export interface ProductResponse {
  success: boolean;
  data: IProduct[];
  count: number;
}

export interface CartProduct extends IProduct {
  quantity?: number;
}