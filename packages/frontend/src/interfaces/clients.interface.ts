export interface IClient {
  idClientes: number;
  razon_social: string;
  nombre_comercial: string;
  direccion_entrega: string;
  telefono: string;
  email: string;
}

export interface ClientResponseGet {
  success: boolean;
  count: number;
  data: IClient[];
}

export interface IClientCreate {
  razon_social: string;
  nombre_comercial: string;
  direccion_entrega: string;
  telefono: string;
  email: string;
}