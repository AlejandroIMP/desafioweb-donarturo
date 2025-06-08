import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '@/schemas/auth.schemas';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Alert, Typography } from '@mui/material';
import axios from 'axios';
import { LoginResponse, LoginErrorResponse } from '@/interfaces/auth.interface';
import { navigateByRole } from '@/utils/loginUtils';
import './index.css'
import ButtonVisibility from '../ButtonVisibility';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState<Date | null>(null);
  
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
      setAttemptsRemaining(null);
      setIsLocked(false);

      const response = await axios.post<LoginResponse>(`${apiBaseUrl}auth/login`, {
        email: data.email,
        password: data.password
      });

      if (response.data.success && response.data.token) {
        // Store user data with new field names
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', String(response.data.user.role_id));
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('idusuario', String(response.data.user.user_id));
        localStorage.setItem('username', response.data.user.full_name);

        reset({
          email: '',
          password: ''
        });

        const redirectPath = navigateByRole(response.data.user.role_id);

        navigate(redirectPath, { replace: true });
        location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as LoginErrorResponse;
        
        // Handle different types of errors
        if (error.response?.status === 403 && errorData.locked_until) {
          setIsLocked(true);
          setLockUntil(new Date(errorData.locked_until));
          setError(`Cuenta bloqueada hasta: ${new Date(errorData.locked_until).toLocaleString()}`);
        } else if (error.response?.status === 401 && errorData.attempts_remaining !== undefined) {
          setAttemptsRemaining(errorData.attempts_remaining);
          setError(`${errorData.message}. Intentos restantes: ${errorData.attempts_remaining}`);
        } else {
          setError(errorData.message || error.response?.data?.message || 'Error al iniciar sesión');
        }
      } else {
        setError('Error de conexión. Por favor, inténtalo de nuevo.');
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

  const formatLockTime = (lockDate: Date) => {
    const now = new Date();
    const timeDiff = lockDate.getTime() - now.getTime();
    const minutes = Math.ceil(timeDiff / (1000 * 60));
    
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <form className='auth-form--style' onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert severity={isLocked ? "warning" : "error"} sx={{ mb: 2 }}>
          {error}
          {lockUntil && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Tiempo restante: {formatLockTime(lockUntil)}
            </Typography>
          )}
        </Alert>
      )}
      
      {attemptsRemaining !== null && attemptsRemaining > 0 && !isLocked && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          ⚠️ Cuidado: Te quedan {attemptsRemaining} intentos antes de que tu cuenta sea bloqueada.
        </Alert>
      )}

      <div>
        <TextField
          {...register('email')}
          type="email"
          placeholder="Email"
          autoComplete="email"
          disabled={isLoading || isLocked}
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </div>
      
      <div>
        <div
          style={{
            position: 'relative',
          }}
        >
          <TextField
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            autoComplete='current-password'
            disabled={isLoading || isLocked}
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <div
            style={{
              position: 'absolute',
              right: '0',
              top: '20%'
            }}
          >
            <ButtonVisibility 
              showPassword={showPassword} 
              togglePasswordVisibility={togglePasswordVisibility} 
            />
          </div>
        </div>
      </div>
      
      <div className='auth-buttons'>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isDirty || !isValid || isLoading || isLocked}
        >
          {isLoading ? 'Iniciando sesión...' : isLocked ? 'Cuenta bloqueada' : 'Iniciar sesión'}
        </Button>
        
        <Button
          variant="text"
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
          disabled={true}
        >
          Olvidé mi contraseña
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
