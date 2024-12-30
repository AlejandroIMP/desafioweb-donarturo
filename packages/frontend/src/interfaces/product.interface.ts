export interface IProduct {
  idProductos?: number;
  CategoriaProductos_idCategoriaProductos: number;
  usuarios_idusuarios: number;
  nombre: string;
  marca: string;
  codigo: string;
  stock: number;
  estados_idestados: number;
  precio: number;
  fecha_creacion?: Date;
  foto: number;
}