import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '@/schemas/auth.schemas';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { LoginResponse } from '@/interfaces/auth.interface';
import { navigateByRole } from '@/utils/loginUtils';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post<LoginResponse>(`${apiBaseUrl}auth/login`, {
        correo_electronico: data.correo_electronico,
        user_password: data.user_password
      });


      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', String(response.data.user.rol));
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('idusuario', String(response.data.user.id));

        reset({
          correo_electronico: '',
          user_password: ''
        });
        const redirectPath = navigateByRole(response.data.user.rol);

        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error al iniciar sesión');
        console.error('Login error:', error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  const handleRegister = () => {
    navigate('/auth/register');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <div className='auth-message-error'>{error}</div>}
      <div>
        <TextField
          {...register('correo_electronico')}
          type="email"
          placeholder="Email"
          autoComplete="new-email"
          disabled={isLoading}
        />
        {errors.correo_electronico && (
          <span className='auth-message-error' >{errors.correo_electronico.message}</span>
        )}
      </div>
      <div>
        <div>
          <TextField
            {...register('user_password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            autoComplete='current-password'
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </Button>
        </div>
        {errors.user_password && (
          <span className='auth-message-error'>{errors.user_password.message}</span>
        )}
      </div>
      <div className='auth-buttons'>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isDirty || !isValid || isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          disabled={isLoading}
        >
          ¿No tienes cuenta? Regístrate
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={handleForgotPassword}
          disabled={isLoading}
        >
          Olvidé mi contraseña
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
