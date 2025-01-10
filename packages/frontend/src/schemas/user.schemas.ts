import { z } from 'zod'

export const createUserSchema = z.object({
  rol_idrol: z.number(),
  estados_idestados: z.number(),
  correo_electronico: z.string()
  .email('Email inválido')
  .nonempty('Email requerido')
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido, ingrese un correo real'),
  nombre_completo: z.string(),
  user_password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
  .regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
  .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
  telefono: z.string()
  .min(8, 'Teléfono debe tener al menos 8 caracteres')
  .max(9, 'Teléfono no debe exceder 9 caracteres')
  .regex(/^\d{4}-\d{4}$/, 'Formato inválido. Use: XXXX-XXXX'),
  fecha_nacimiento: z.string(),
  Clientes_idClientes: z.number().nullable(),
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
  Clientes_idClientes: z.number().nullable(),
});

export type CreateUserForm = z.infer<typeof createUserSchema>

export type UpdateUserForm = z.infer<typeof updateUserSchema>;