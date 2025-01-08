import { z } from 'zod';

export const categoryUpdateSchema = z.object({
  usuarios_idusuarios: z.number(),
  nombre: z.string().min(1, 'Nombre es requerido'),
  estados_idestados: z.number().transform(val => Number(val)),
});

export type CategoryUpdateFormSchema = z.infer<typeof categoryUpdateSchema>;