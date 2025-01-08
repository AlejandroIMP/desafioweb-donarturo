export interface IProductCategory {
  idCategoriaProductos: number;
  usuarios_idusuarios: number;
  nombre: string;
  estados_idestados: number;
  fecha_creacion: string;
}

export interface ProductCategoryResponseGet {
  success: boolean;
  data: IProductCategory[];
  count: number; 
}

export interface ICategory {
  idCategoriaProductos: number;
  usuarios_idusuarios: number;
  nombre: string;
  estados_idestados: number;
}

export interface ICategoryCreate {
  usuarios_idusuarios: number;
  nombre: string;
  estados_idestados: number;
}