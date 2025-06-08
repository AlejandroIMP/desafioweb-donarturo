import { z } from 'zod'

export const createUserSchema = z.object({
  role_id: z.number(),
  state_id: z.number(),
  email: z.string()
  .email('Email inválido')
  .nonempty('Email requerido')
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido, ingrese un correo real'),
  full_name: z.string(),
  password_hash: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
  .regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
  .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
  phone: z.string()
  .min(8, 'Teléfono debe tener al menos 8 caracteres')
  .max(9, 'Teléfono no debe exceder 9 caracteres')
  .regex(/^\d{4}-\d{4}$/, 'Formato inválido. Use: XXXX-XXXX'),
  birth_date: z.string(),
  client_id: z.number().nullable().optional(),
})

export const updateUserSchema = z.object({
  user_id: z.number().transform(val => Number(val)),
  role_id: z.number().transform(val => Number(val)),
  state_id: z.number().transform(val => Number(val)),
  email: z.string().email('Email inválido'),
  full_name: z.string().min(1, 'Nombre requerido'),
  phone: z.string()
  .min(8, 'Teléfono debe tener al menos 8 caracteres')
  .max(9, 'Teléfono no debe exceder 9 caracteres')
  .regex(/^\d{4}-\d{4}$/, 'Formato inválido. Use: XXXX-XXXX'),
  birth_date: z.string().optional(),
  client_id: z.number().nullable(),
});

export type CreateUserForm = z.infer<typeof createUserSchema>

export type UpdateUserForm = z.infer<typeof updateUserSchema>;