import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, RegisterSchema } from '@/schemas/auth.schemas';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Alert } from '@mui/material';
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
      setSuccess(null);

      console.log('Register attempt with data:', {
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        birth_date: data.birth_date
      });

      const response = await axios.post<RegisterResponse>(`${apiBaseUrl}auth/register`, {
        email: data.email,
        password_hash: data.password_hash,
        full_name: data.full_name,
        phone: data.phone,
        birth_date: data.birth_date,
        role_id: 2, // Default role for new users (customer)
        state_id: 1 // Default state (active)
      });

      if (response.data.success) {
        setSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');
        reset();

        setTimeout(() => {
          navigate('/auth/login', {
            state: {
              message: '¡Registro exitoso! Por favor inicia sesión con tus credenciales.',
              email: data.email
            }
          });
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Error al registrar el usuario';
        setError(errorMessage);
        console.error('Register error:', error.response?.data);
      } else {
        setError('Error al conectar con el servidor');
        console.error('Network error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='auth-form--style' onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ width: '100%', marginBottom: 2 }}>
          {success}
        </Alert>
      )}

      <div>
        <TextField
          {...register('full_name')}
          variant="outlined"
          type="text"
          placeholder="Nombre Completo"
          autoComplete="name"
          disabled={isLoading}
          fullWidth
          error={!!errors.full_name}
          helperText={errors.full_name ? errors.full_name.message : null}
        />
      </div>
      
      <div>
        <TextField
          {...register('email')}
          variant="outlined"
          type="email"
          placeholder="Email"
          autoComplete="email"
          disabled={isLoading}
          fullWidth
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : null}
        />
      </div>
      
      <div>
        <div className="auth-password-field" style={{ position: 'relative' }}>	
          <TextField
            {...register('password_hash')}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            placeholder="Contraseña"
            autoComplete='new-password'
            fullWidth
            disabled={isLoading}
            error={!!errors.password_hash}
            helperText={errors.password_hash ? errors.password_hash.message : null}
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
        <div className="auth-password-field" style={{ position: 'relative' }}>
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
          {...register('phone')}
          variant="outlined"
          type="tel"
          placeholder="Teléfono (opcional)"
          autoComplete="tel"
          disabled={isLoading}
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone ? errors.phone.message : null}
        />
      </div>
      
      <div>
        <TextField
          {...register('birth_date')}
          variant="outlined"
          type="date"
          label="Fecha de nacimiento"
          autoComplete="bday"
          disabled={isLoading}
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors.birth_date}
          helperText={errors.birth_date ? errors.birth_date.message : null}
        />
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
