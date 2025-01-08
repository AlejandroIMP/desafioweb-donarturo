import { z } from 'zod';

export const clientSchema = z.object({
  razon_social: z.string().min(1, 'Razón social es requerida'),
  nombre_comercial: z.string().min(1, 'Nombre comercial es requerido'),
  direccion_entrega: z.string().min(1, 'Dirección es requerida'),
  telefono: z.string()
    .min(8, 'Teléfono debe tener al menos 8 caracteres')
    .max(9, 'Teléfono no debe exceder 9 caracteres')
    .regex(/^\d{4}-\d{4}$/, 'Formato inválido. Use: XXXX-XXXX'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email es requerido')
});

export type ClientCreateFormSchema = z.infer<typeof clientSchema>;