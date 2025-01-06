import { z } from 'zod';

export const DetaiisOrderSchema = z.object({
  idProductos: z.number().int().positive(),
  cantidad: z.number().int().positive().optional(),
  precio: z.number().int().positive(),
})

export const OrderSchema = z.object({
  idusuario: z.number().int().positive().optional(),
  estados_idestados: z.number().int().positive().optional(),
  nombre_completo:  z.string().nonempty('Nombre requerido'),
  direccion: z.string().nonempty('Dirección requerida'),
  telefono: z.string()
    .nonempty('Teléfono requerido').min(8, 'Numero de telefono invalido').max(9, 'Número de teléfono inválido'),
  correo_electronico: z.string()
    .email('Email inválido')
    .nonempty('Email requerido')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido, ingrese un correo real'),
  fecha_entrega: z.string().optional(),
  Clientes_idClientes: z.number().int().positive().optional().nullable(),
  DetallesProductos: z.array(DetaiisOrderSchema).optional(),
})

export type OrderSchemaForm = z.infer<typeof OrderSchema>;

