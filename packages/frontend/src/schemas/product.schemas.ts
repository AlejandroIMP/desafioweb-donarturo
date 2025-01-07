import { z } from 'zod' 
export const createProductSchema = z.object({
  CategoriaProductos_idCategoriaProductos: z.number(),
  usuarios_idusuarios: z.string(),
  nombre: z.string(),
  marca: z.string(),
  codigo: z.string(),
  stock: z.string(),
  estados_idestados: z.string(),
  precio: z.string(),
  foto: z.string(),
})

export type CreateProductForm = z.infer<typeof createProductSchema>