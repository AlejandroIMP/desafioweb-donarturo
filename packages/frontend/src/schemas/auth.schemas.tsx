import { z } from 'zod';

const getMinimumAge = () => {
  const date = new Date().getFullYear();
  return date - 18;
}

export const loginSchema = z.object({
  email: z.string().email('Email inválido').nonempty('Email requerido').regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido, ingrese un correo real'),
  password: z.string().min(1, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional()
});

export const RegisterSchema = z.object({
  state_id: z.number().int().positive().nullable().optional(),
  email: z.string()
    .email('Email inválido')
    .nonempty('Email requerido')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido, ingrese un correo real'),
  password_hash: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
  confirm_password: z.string()
    .min(6, 'Confirma tu contraseña'),
  full_name: z.string()
    .nonempty('Nombre requerido'),
  phone: z.string()
  .min(8, 'Teléfono debe tener al menos 8 caracteres')
  .max(9, 'Teléfono no debe exceder 9 caracteres')
  .regex(/^\d{4}-\d{4}$/, 'Formato inválido. Use: XXXX-XXXX'),
  birth_date: z.string()
    .nonempty('Fecha de nacimiento requerida')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de nacimiento inválida')
    .refine((date) => new Date(date).getFullYear() <= getMinimumAge(), {
      message: 'Debes ser mayor de 18 años'
    }),
  role_id: z.number().int().positive().nullable().optional()
}).refine((data) => data.password_hash === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;

