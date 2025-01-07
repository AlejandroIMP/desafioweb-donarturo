import { z } from 'zod'

export const createUserSchema = z.object({
  rol_idrol: z.number(),
  estados_idestados: z.number(),
  correo_electronico: z.string(),
  nombre_completo: z.string(),
  user_password: z.string(),
  telefono: z.string(),
  fecha_nacimiento: z.string(),
  Clientes_idClientes: z.number(),
})

export type CreateUserForm = z.infer<typeof createUserSchema>