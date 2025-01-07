import { z } from 'zod'

export const createUserSchema = z.object({
  rol_idrol: z.number(),
  estados_idestados: z.number(),
  correo_electronico: z.string(),
  nombre_completo: z.string(),
  user_password: z.string(),
  telefono: z.string()
  .nonempty('Teléfono requerido').min(8, 'Numero de telefono invalido').max(9, 'Número de teléfono inválido'),
  fecha_nacimiento: z.string(),
  Clientes_idClientes: z.string().transform(val => Number(val)).nullable()
})

export const updateUserSchema = z.object({
  rol_idrol: z.number().transform(val => Number(val)),
  estados_idestados: z.number().transform(val => Number(val)),
  correo_electronico: z.string().email('Email inválido'),
  nombre_completo: z.string().min(1, 'Nombre requerido'),
  telefono: z.string()
    .nonempty('Teléfono requerido')
    .min(8, 'Numero de telefono invalido')
    .max(9, 'Número de teléfono inválido'),
  fecha_nacimiento: z.string(),
  Clientes_idClientes: z.number().transform(val => Number(val))
});

export type CreateUserForm = z.infer<typeof createUserSchema>

export type UpdateUserForm = z.infer<typeof updateUserSchema>;