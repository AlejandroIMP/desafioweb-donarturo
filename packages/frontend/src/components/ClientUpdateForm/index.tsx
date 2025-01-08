import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button } from '@mui/material';
import { clientSchema, ClientCreateFormSchema } from '@/schemas/client.schemas';
import { updateClient } from '@/services/clients.service';
import { IClient } from '@/interfaces/clients.interface';

interface ClientUpdateFormProps {
  client: IClient;
  onClose: () => void;
}

const ClientUpdateForm = ({ client, onClose }: ClientUpdateFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ClientCreateFormSchema>({
    resolver: zodResolver(clientSchema),
    mode: 'onChange',
    defaultValues: {
      razon_social: client.razon_social,
      nombre_comercial: client.nombre_comercial,
      direccion_entrega: client.direccion_entrega,
      telefono: client.telefono,
      email: client.email
    }
  });

  const onSubmit = async (data: ClientCreateFormSchema) => {
    try {
      await updateClient(client.idClientes, data);
      reset();
      onClose();
      location.reload();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('razon_social')}
        label="Razón Social"
        fullWidth
        error={!!errors.razon_social}
        helperText={errors.razon_social?.message}
      />
      <TextField
        {...register('nombre_comercial')}
        label="Nombre Comercial"
        fullWidth
        error={!!errors.nombre_comercial}
        helperText={errors.nombre_comercial?.message}
      />
      <TextField
        {...register('direccion_entrega')}
        label="Dirección"
        fullWidth
        error={!!errors.direccion_entrega}
        helperText={errors.direccion_entrega?.message}
      />
      <TextField
        {...register('telefono')}
        label="Teléfono"
        fullWidth
        placeholder="XXXX-XXXX"
        error={!!errors.telefono}
        helperText={errors.telefono?.message}
      />
      <TextField
        {...register('email')}
        label="Email"
        type="email"
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
      >
        Actualizar Cliente
      </Button>
    </form>
  );
};

export default ClientUpdateForm;