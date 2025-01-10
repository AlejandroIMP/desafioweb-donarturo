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
  const [valueState, setValueState] = useState(usuario.estados_idestados);
  const [valueRol, setValueRol] = useState(usuario.rol_idrol);
  const [clients, setClients] = useState<IClient[]>([]);
  const [selectedClient, setSelectedClient] = useState(usuario.Clientes_idClientes?.toString() || '');

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
      idusuarios: usuario.idusuarios,
      rol_idrol: usuario.rol_idrol,
      estados_idestados: usuario.estados_idestados,
      correo_electronico: usuario.correo_electronico,
      nombre_completo: usuario.nombre_completo,
      telefono: usuario.telefono,
      fecha_nacimiento: usuario.fecha_nacimiento,
      Clientes_idClientes: selectedClient ? Number(selectedClient) : null
    }
  });

  const onSubmit = async (data: UpdateUserForm) => {
    try {
      const formattedData = {
        ...data,
        rol_idrol: Number(data.rol_idrol),
        estados_idestados: Number(data.estados_idestados),
        Clientes_idClientes: selectedClient ? Number(selectedClient) : null
      };

      await updateUsers(usuario.idusuarios, formattedData);

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
        defaultValue={usuario.idusuarios}
      />
      <Select
        {...register("rol_idrol")}
        label="Rol"
        fullWidth
        error={!!errors.rol_idrol}
        value={valueRol}
        onChange={(e) => setValueRol(Number(e.target.value))}
      >
        <MenuItem value={"1"}>Operador</MenuItem>
        <MenuItem value={"2"}>Usuario</MenuItem>
        <MenuItem value={"3"}>Cliente</MenuItem>
      </Select>
      <Select
        {...register("estados_idestados")}
        label="Estado"
        fullWidth
        error={!!errors.estados_idestados}
        value={valueState}
        onChange={(e) => setValueState(Number(e.target.value))}
      >
        <MenuItem value={"1"}>Activo</MenuItem>
        <MenuItem value={"2"}>Inactivo</MenuItem>
      </Select>
      <TextField
        {...register("correo_electronico")}
        label="Email"
        fullWidth
        error={!!errors.correo_electronico}
        helperText={errors.correo_electronico?.message}
      />
      <TextField
        {...register("nombre_completo")}
        label="Nombre"
        fullWidth
        error={!!errors.nombre_completo}
        helperText={errors.nombre_completo?.message}
      />
      <TextField
        {...register("telefono")}
        label="Teléfono"
        fullWidth
        error={!!errors.telefono}
        helperText={errors.telefono?.message}
      />
      <TextField
        {...register("fecha_nacimiento")}
        label="Fecha Nacimiento"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        error={!!errors.fecha_nacimiento}
        helperText={errors.fecha_nacimiento?.message}
      />
      <Select
        {...register("Clientes_idClientes")}
        label="Cliente"
        fullWidth
        error={!!errors.Clientes_idClientes}
        value={selectedClient}
        onChange={(e) => setSelectedClient(e.target.value)}
      >
        <MenuItem value="">Ninguno</MenuItem>
        {clients.map((client) => (
          <MenuItem key={client.idClientes} value={client.idClientes}>
            {client.nombre_comercial} - {client.razon_social}
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