import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateUserForm, updateUserSchema } from '@/schemas/user.schemas';
import { updateUsers } from '@/services/users.service';
import { Button, TextField, Select, MenuItem } from '@mui/material';
import { IUser } from '@/interfaces/auth.interface';
import { IClient } from '@/interfaces/clients.interface';
import { getClients } from '@/services/clients.service';

interface UserFormUpdateProps {
  usuario: IUser;
}

const UserFormUpdate = ({ usuario }: UserFormUpdateProps) => {
  const [valueState, setValueState] = useState(usuario.state_id);
  const [valueRol, setValueRol] = useState(usuario.role_id);
  const [clients, setClients] = useState<IClient[]>([]);
  const [selectedClient, setSelectedClient] = useState(usuario.client_id?.toString() || 0);

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

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onChange',
    defaultValues: {
      user_id: usuario.user_id,
      role_id: usuario.role_id,
      state_id: usuario.state_id,
      email: usuario.email,
      full_name: usuario.full_name,
      phone: usuario.phone,
      birth_date: usuario.birth_date,
      client_id: selectedClient ? Number(selectedClient) : null
    }
  });

  const onSubmit = async (data: UpdateUserForm) => {
    try {
      
      if (data.client_id === 0) {
        data.client_id = null;
      }

      const formattedData = {
        ...data,
        role_id: Number(data.role_id),
        state_id: Number(data.state_id),
        client_id: selectedClient ? Number(selectedClient) : null
      };

      await updateUsers(usuario.user_id, formattedData);

      location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="ID"
        type="number"
        fullWidth
        disabled
        defaultValue={usuario.user_id}
      />
      <Select
        {...register("role_id")}
        label="Rol"
        fullWidth
        error={!!errors.role_id}
        value={valueRol}
        onChange={(e) => setValueRol(Number(e.target.value))}
      >
        <MenuItem value={"1"}>Operador</MenuItem>
        <MenuItem value={"2"}>Usuario</MenuItem>
        <MenuItem value={"3"}>Cliente</MenuItem>
      </Select>
      <Select
        {...register("state_id")}
        label="Estado"
        fullWidth
        error={!!errors.state_id}
        value={valueState}
        onChange={(e) => setValueState(Number(e.target.value))}
      >
        <MenuItem value={"1"}>Activo</MenuItem>
        <MenuItem value={"2"}>Inactivo</MenuItem>
      </Select>
      <TextField
        {...register("email")}
        label="Email"
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        {...register("full_name")}
        label="Nombre"
        fullWidth
        error={!!errors.full_name}
        helperText={errors.full_name?.message}
      />
      <TextField
        {...register("phone")}
        label="Teléfono"
        fullWidth
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />
      <TextField
        {...register("birth_date")}
        label="Fecha Nacimiento"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        error={!!errors.birth_date}
        helperText={errors.birth_date?.message}
      />
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
      >
        Actualizar Usuario
      </Button>
    </form>
  );
};

export default UserFormUpdate;