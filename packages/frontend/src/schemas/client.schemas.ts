import { z } from 'zod';

export const clientSchema = z.object({
  business_name: z.string().min(1, 'Nombre de negocio es requerido'),
  commercial_name: z.string().min(1, 'Nombre comercial es requerido'),
  delivery_address: z.string().min(1, 'Dirección es requerida'),
  phone: z.string()
    .min(8, 'Teléfono debe tener al menos 8 caracteres')
    .max(20, 'Teléfono no debe exceder 20 caracteres')
    .regex(/^\+?[0-9\-\s\(\)]{7,20}$/, 'Formato de teléfono inválido'),
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email es requerido'),
  tax_id: z.string().optional(),
});

export type ClientCreateFormSchema = z.infer<typeof clientSchema>;