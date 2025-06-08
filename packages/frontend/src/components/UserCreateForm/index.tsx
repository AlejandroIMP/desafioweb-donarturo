import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserForm, createUserSchema } from "@/schemas/user.schemas";
import { createUser } from "@/services/users.service";
import { useState, useEffect } from "react";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { getClients } from "@/services/clients.service";
import { IClient } from "@/interfaces/clients.interface";
import ButtonVisibility from "../ButtonVisibility";
import './index.css'

const UserFormCreate = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [valueState, setValueState] = useState('');
  const [valueRol, setValueRol] = useState('');
  const [clients, setClients] = useState<IClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('0');
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await getClients();
        setClients(response.data);
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    };
    loadClients();
  }, []);

  const onSubmit = async (data: CreateUserForm) => {
    try {

      if (data.client_id === 0) {
        data.client_id = null;
      }

      const formData = {
        ...data,
        client_id: selectedClient ? Number(selectedClient) : null
      };

      await createUser(formData);
      reset();
      location.reload();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='user-form-create'>
        <p className='rol-user'>Rol del usuario</p>
        <Select
          {...register("role_id")}
          fullWidth
          label="Rol"
          error={!!errors.role_id}
          value={valueRol}
          onChange={(e) => setValueRol(e.target.value)}
        >
          <MenuItem value={1}>Operador</MenuItem>
          <MenuItem value={2}>Usuario</MenuItem>
          <MenuItem value={3}>Cliente</MenuItem>
        </Select>
        {errors.role_id && <p>{errors.role_id.message}</p>}
      </div>
      <div className='user-form-create'>
        <p className='state-user'>Estado del usuario</p>
        <Select
          {...register("state_id")}
          label="Estado"
          fullWidth
          error={!!errors.state_id}
          value={valueState}
          onChange={(e) => setValueState(e.target.value)}
        >
          <MenuItem value={1}>Activo</MenuItem>
          <MenuItem value={2}>Inactivo</MenuItem>
        </Select>
      </div>
      <div className='user-form-create'>
        <p className='client-user'>Cliente</p>
        <Select
        {...register("client_id")}
        label="Cliente"
        fullWidth
        error={!!errors.client_id}
        value={selectedClient}
        onChange={(e) => setSelectedClient(e.target.value)}
      >
        <MenuItem value={0}>Ninguno</MenuItem>
        {clients.map((client) => (
          <MenuItem key={client.client_id} value={client.client_id}>
            {client.commercial_name} - {client.business_name}
          </MenuItem>
        ))}
      </Select>
      {errors.client_id && <p>{errors.client_id.message}</p>}
      </div>
      <TextField
        {...register("email")}
        label="Correo electronico"
        fullWidth
        error={!!errors.email}
        helperText={errors.email ? errors.email.message : null}
      />
      <TextField
        {...register("full_name")}
        label="Nombre completo"
        fullWidth
        error={!!errors.full_name}
        helperText={errors.full_name ? errors.full_name.message : null}
      />
      <div
        className="auth-password-field">
        <TextField
          {...register('password_hash')}
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          placeholder="Password"
          autoComplete='current-password'
          fullWidth
          error={!!errors.password_hash}
          helperText={errors.password_hash ? errors.password_hash.message : null}
        />
        <ButtonVisibility showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} />
      </div>
      <TextField
        {...register("phone")}
        label="Telefono"
        type="tel"
        fullWidth
        error={!!errors.phone}
        helperText={errors.phone ? errors.phone.message : null}
      />
      <TextField
        {...register("birth_date")}
        label="Fecha de nacimiento"
        fullWidth
        error={!!errors.birth_date}
        helperText={errors.birth_date ? errors.birth_date.message : null}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        type="submit">Crear</Button>
    </form>
  );
}

export default UserFormCreate;
