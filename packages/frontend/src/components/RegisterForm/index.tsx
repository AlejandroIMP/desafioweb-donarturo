import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, RegisterSchema } from '@/schemas/auth.schemas';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { RegisterResponse } from '@/interfaces/auth.interface';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { countries } from '@/utils/registerUtils';
import './index.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('GT');
  const [selectedRole, setSelectedRole] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange'
  });

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    const country = countries.find(c => c.code === selectedCountry);

    const phoneNumber = parsePhoneNumberFromString(value, { defaultCountry: country?.code as CountryCode });

    if (phoneNumber) {
      setValue('telefono', phoneNumber.formatInternational());
    }
  };

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
    <form onSubmit={handleSubmit(onSubmit)}>
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
        />
        {errors.nombre_completo && (
          <span className='auth-message-error' >{errors.nombre_completo.message}</span>
        )}
      </div>
      <div>
        <TextField
          {...register('correo_electronico')}
          variant="outlined"
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
            variant="outlined"
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
      <div>
        <div>
          <TextField
            {...register('confirm_password')}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            autoComplete='new-password'
            disabled={isLoading}
          />
        </div>
        {errors.confirm_password && (
          <span className='auth-message-error'>{errors.confirm_password.message}</span>
        )}
      </div>
      <div>
        <Select
          value={selectedCountry}
          variant="outlined"
          onChange={(e) => setSelectedCountry(e.target.value)}
          disabled={isLoading}
        >
          {countries.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              {country.label} ({country.prefix})
            </MenuItem>
          ))}
        </Select>
        <TextField
          {...register('telefono')}
          variant="outlined"
          onChange={handlePhoneChange}
          type="tel"
          placeholder="Teléfono"
          autoComplete="tel"
          disabled={isLoading}
        />
        {errors.telefono && (
          <span className='auth-message-error'>{errors.telefono.message}</span>
        )}
      </div>
      <div>
        <TextField
          {...register('fecha_nacimiento')}
          variant="outlined"
          type="date"
          placeholder="Fecha de nacimiento"
          autoComplete="new-birthdate"
          disabled={isLoading}
        />
        {errors.fecha_nacimiento && (
          <span className='auth-message-error'>{errors.fecha_nacimiento.message}</span>
        )}
      </div>
      <div className='auth-select-hidden'>
        <TextField className='auth-select-hidden'>
          <Select
            {...register('estados_idestados')}
            value={selectedStatus}
            variant="outlined"
            disabled={isLoading}
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
            disabled={isLoading}
          >
            <MenuItem value={1}>Cliente</MenuItem>
            <MenuItem value={2}>Administrador</MenuItem>
          </Select>
        </TextField>
        <TextField className='auth-select-hidden'>
          <Select
            {...register('Clientes_idClientes')}
            value={selectedClient}
            variant="outlined"
            disabled={isLoading}
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
