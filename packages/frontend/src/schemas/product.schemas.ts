import { z } from 'zod' 

export const createProductSchema = z.object({
  category_id: z.number(),
  user_id: z.string(),
  product_name: z.string().min(3, { message: "El nombre del producto debe tener al menos 3 caracteres" }),
  brand: z.string().min(2, { message: "La marca debe tener al menos 2 caracteres" }),
  product_code: z.string().min(1, { message: "El código del producto es requerido" }),
  stock_quantity: z.string().refine(value => !isNaN(Number(value)), { 
    message: "El stock debe ser un número válido" 
  }), // Mantener como string para el formulario, se convertirá a number antes de enviar
  state_id: z.string().refine(value => value === '1' || value === '2', {
    message: "El estado debe ser 1 (Activo) o 2 (Inactivo)"
  }),    // Mantener como string para el formulario, se convertirá a number antes de enviar
  unit_price: z.string().refine(value => !isNaN(Number(value)), { 
    message: "El precio debe ser un número válido" 
  }),    // Mantener como string para el formulario, se convertirá a number antes de enviar
  image_url: z.string(),
})

export type CreateProductForm = z.infer<typeof createProductSchema>