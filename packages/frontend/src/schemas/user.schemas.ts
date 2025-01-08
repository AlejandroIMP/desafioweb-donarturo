import { z } from 'zod'

export const createUserSchema = z.object({
  rol_idrol: z.number(),
  estados_idestados: z.number(),
  correo_electronico: z.string(),
  nombre_completo: z.string(),
  user_password: z.string(),
  telefono: z.string()
  .min(8, 'Teléfono debe tener al menos 8 caracteres')
  .max(9, 'Teléfono no debe exceder 9 caracteres')
  .regex(/^\d{4}-\d{4}$/, 'Formato inválido. Use: XXXX-XXXX'),
  fecha_nacimiento: z.string(),
  Clientes_idClientes: z.string().transform(val => Number(val)).nullable()
})

export const updateUserSchema = z.object({
  idusuarios: z.number().transform(val => Number(val)),
  rol_idrol: z.number().transform(val => Number(val)),
  estados_idestados: z.number().transform(val => Number(val)),
  correo_electronico: z.string().email('Email inválido'),
  nombre_completo: z.string().min(1, 'Nombre requerido'),
  telefono: z.string()
  .min(8, 'Teléfono debe tener al menos 8 caracteres')
  .max(9, 'Teléfono no debe exceder 9 caracteres')
  .regex(/^\d{4}-\d{4}$/, 'Formato inválido. Use: XXXX-XXXX'),
  fecha_nacimiento: z.string().optional(),
  Clientes_idClientes: z.string().optional().nullable(),
});

export type CreateUserForm = z.infer<typeof createUserSchema>

export type UpdateUserForm = z.infer<typeof updateUserSchema>;