import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button } from '@mui/material';
import { ClientCreateFormSchema, clientSchema } from '@/schemas/client.schemas';
import { createClient } from '@/services/clients.service';

const ClientCreateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ClientCreateFormSchema>({
    resolver: zodResolver(clientSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: ClientCreateFormSchema) => {
    try {
      await createClient(data);
      reset();
      location.reload();
    } catch (error) {
      console.error('Error creating client:', error);
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
        Crear Cliente
      </Button>
    </form>
  );
};

export default ClientCreateForm;