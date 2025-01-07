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
  data: IProduct[];
  count: number;
}

export interface CartProduct extends IProduct {
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