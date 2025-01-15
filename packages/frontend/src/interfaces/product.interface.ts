import { z } from "zod";

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
  fecha_creacion: string;
  foto: string;
}

export interface ProductResponse {
  success: boolean;
  data: DataProduct[];
  count: number;
}

export interface CartProduct extends DataProduct {
  quantity?: number;
}

export interface IProductCreate {
  CategoriaProductos_idCategoriaProductos: number;
  usuarios_idusuarios: string;
  nombre: string;
  marca: string;
  codigo: string;
  stock: string;
  estados_idestados: string;
  precio: string;
  foto: string;
}

export interface DataProduct {
  idProductos: number;
  nombre: string;
  marca: string;
  codigo: string;
  stock: number;
  precio: number;
  foto: string;
  fecha_creacion: string;
  categoria: {
    nombre: string;
    idCategoriaProductos: number;
  }
  usuario: {
    nombre_completo: string;
    idusuarios: number;
  }
  estado: {
    nombre: string;
    idestados: number;
  }
}