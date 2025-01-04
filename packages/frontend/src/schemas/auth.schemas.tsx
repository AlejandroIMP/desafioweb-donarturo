import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const getMinimumAge = () => {
  const date = new Date().getFullYear();
  return date - 18;
}

export const loginSchema = z.object({
  correo_electronico: z.string().email('Email inválido').nonempty('Email requerido').regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido, ingrese un correo real'),
  user_password: z.string().min(1, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional()
});

export const RegisterSchema = z.object({
  estados_idestados: z.number().int().positive().nullable().optional(),
  correo_electronico: z.string()
    .email('Email inválido')
    .nonempty('Email requerido')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido, ingrese un correo real'),
  user_password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
  confirm_password: z.string()
    .min(6, 'Confirma tu contraseña'),
  nombre_completo: z.string()
    .nonempty('Nombre requerido'),
  telefono: z.string()
    .nonempty('Teléfono requerido')
    .refine((value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid() || false;
    }, 'Número de teléfono inválido'),
  fecha_nacimiento: z.string()
    .nonempty('Fecha de nacimiento requerida')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de nacimiento inválida')
    .refine((date) => new Date(date).getFullYear() <= getMinimumAge(), {
      message: 'Debes ser mayor de 18 años'
    }),
  Clientes_idClientes: z.number().int().positive().nullable().optional()
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;

