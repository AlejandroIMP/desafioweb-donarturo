import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, RegisterSchema } from '@/schemas/auth.schemas';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { RegisterResponse } from '@/interfaces/auth.interface';
import './index.css';
import ButtonVisibility from '../ButtonVisibility';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const selectedRole = 1;
  const selectedStatus = 1;
  const selectedClient = null;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange'
  });



  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post<RegisterResponse>(`${apiBaseUrl}auth/register`, {
        correo_electronico: data.correo_electronico,
        user_password: data.user_password,
        nombre_completo: data.nombre_completo,
        telefono: data.telefono,
        fecha_nacimiento: data.fecha_nacimiento
      });
      if (response.data.success) {
        setSuccess('Registro exitoso! Redirigiendo al inicio de sesión...');
        reset();

        setTimeout(() => {
          navigate('/auth/login', {
            state: {
              message: 'Registro exitoso! Por favor inicia sesión.',
              email: data.correo_electronico
            }
          });

        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error al registrar el usuario');
        console.error('Register error:', error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='auth-form--style' onSubmit={handleSubmit(onSubmit)}>
      {error && <div className="auth-message-error">{error}</div>}
      {success && <div className="auth-message-success">{success}</div>}

      <div>
        <TextField
          {...register('nombre_completo')}
          variant="outlined"
          type="text"
          placeholder="Nombre"
          autoComplete="new-name"
          disabled={isLoading}
          fullWidth
          error={!!errors.nombre_completo}
          helperText={errors.nombre_completo ? errors.nombre_completo.message : null}
        />
      </div>
      <div>
        <TextField
          {...register('correo_electronico')}
          variant="outlined"
          type="email"
          placeholder="Email"
          autoComplete="new-email"
          disabled={isLoading}
          fullWidth
          error={!!errors.correo_electronico}
          helperText={errors.correo_electronico ? errors.correo_electronico.message : null}
        />
      </div>
      <div>
        <div className="auth-password-field" style={{ position: 'relative' }}>	
          <TextField
            {...register('user_password')}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            placeholder="Password"
            autoComplete='current-password'
            fullWidth
            disabled={isLoading}
            error={!!errors.user_password}
            helperText={errors.user_password ? errors.user_password.message : null}
          />
          <div style={{
            position: 'absolute',
            right: '0',
            top: '20%'
          }}>
            <ButtonVisibility showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} />
          </div>
        </div>
      </div>
      <div>
        <div>
          <TextField
            {...register('confirm_password')}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            autoComplete='new-password'
            fullWidth
            disabled={isLoading}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password ? errors.confirm_password.message : null}
          />
        </div>
      </div>
      <div>
        <TextField
          {...register('telefono')}
          variant="outlined"
          type="tel"
          placeholder="Teléfono"
          autoComplete="tel"
          disabled={isLoading}
          fullWidth
          error={!!errors.telefono}
          helperText={errors.telefono ? errors.telefono.message : null}
        />
      </div>
      <div>
        <TextField
          {...register('fecha_nacimiento')}
          variant="outlined"
          type="date"
          placeholder="Fecha de nacimiento"
          autoComplete="new-birthdate"
          disabled={isLoading}
          fullWidth
          error={!!errors.fecha_nacimiento}
          helperText={errors.fecha_nacimiento ? errors.fecha_nacimiento.message : null}
        />
      </div>
      <div className='auth-select-hidden'>
        <TextField className='auth-select-hidden'>
          <Select
            {...register('estados_idestados')}
            value={selectedStatus}
            variant="outlined"
            disabled={true}
          >
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={2}>Inactivo</MenuItem>
          </Select>
        </TextField>
        <TextField className='auth-select-hidden'>
          <Select
            {...register('Clientes_idClientes')}
            value={selectedRole}
            variant="outlined"
            disabled={true}
          >
            <MenuItem value={1}>Cliente</MenuItem>
          </Select>
        </TextField>
        <TextField className='auth-select-hidden'>
          <Select
            {...register('Clientes_idClientes')}
            value={selectedClient}
            variant="outlined"
            disabled={true}
          >
            <MenuItem value={1}>Cliente</MenuItem>
          </Select>
        </TextField>
      </div>
      <div className="auth-buttons">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isDirty || !isValid || isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrar'}
        </Button>

        <Button
          type="button"
          variant="text"
          color="secondary"
          fullWidth
          disabled={isLoading}
          onClick={() => navigate('/auth/login')}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
