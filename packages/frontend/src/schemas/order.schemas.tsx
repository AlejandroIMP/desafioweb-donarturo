import { z } from 'zod';

export const DetaiisOrderSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive().optional(),
  unit_price: z.number().positive(),
  discount_percentage: z.number().min(0).max(100).optional(),
})

export const OrderSchema = z.object({
  user_id: z.number().int().positive().optional(),
  state_id: z.number().int().positive().optional(),
  customer_name: z.string().nonempty('Nombre requerido'),
  delivery_address: z.string().nonempty('Dirección requerida'),
  phone: z.string()
    .min(7, 'Teléfono debe tener al menos 7 caracteres')
    .max(20, 'Teléfono no debe exceder 20 caracteres')
    .regex(/^\+?[0-9\-\s\(\)]{7,20}$/, 'Formato de teléfono inválido'),
  email: z.string()
    .email('Email inválido')
    .nonempty('Email requerido')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido, ingrese un correo real'),
  delivery_date: z.string().optional(),
  client_id: z.number().int().positive().optional().nullable(),
  order_details: z.array(DetaiisOrderSchema).optional(),
})

export type OrderSchemaForm = z.infer<typeof OrderSchema>;

export const OrderSchemaUpdate = z.object({
  user_id: z.number().int().positive().optional(),
  state_id: z.number().transform(val => Number(val)),
  customer_name: z.string().nonempty('Nombre requerido'),
  delivery_address: z.string().nonempty('Dirección requerida'),
  phone: z.string()
    .min(7, 'Teléfono debe tener al menos 7 caracteres')
    .max(20, 'Teléfono no debe exceder 20 caracteres')
    .regex(/^\+?[0-9\-\s\(\)]{7,20}$/, 'Formato de teléfono inválido'),
  email: z.string()
    .email('Email inválido')
    .nonempty('Email requerido')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido, ingrese un correo real'),
  delivery_date: z.string().optional(),
  client_id: z.string().optional().nullable(),
})

export type OrderSchemaUpdateForm = z.infer<typeof OrderSchemaUpdate>;