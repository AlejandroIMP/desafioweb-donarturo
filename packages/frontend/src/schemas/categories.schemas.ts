import { z } from 'zod';

export const categoryUpdateSchema = z.object({
  user_id: z.number(),
  category_name: z.string().min(1, 'Nombre de categoría es requerido'),
  state_id: z.number().transform(val => Number(val)),
  category_description: z.string().optional(),
});

export const categoryCreateSchema = z.object({
  user_id: z.number(),
  category_name: z.string().min(1, 'Nombre de categoría es requerido'),
  state_id: z.number().transform(val => Number(val)),
  category_description: z.string().optional(),
});

export type CategoryUpdateFormSchema = z.infer<typeof categoryUpdateSchema>;
export type CategoryCreateFormSchema = z.infer<typeof categoryCreateSchema>;