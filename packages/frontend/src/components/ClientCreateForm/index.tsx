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
        {...register('business_name')}
        label="Nombre del Negocio"
        fullWidth
        error={!!errors.business_name}
        helperText={errors.business_name?.message}
      />
      <TextField
        {...register('commercial_name')}
        label="Nombre Comercial"
        fullWidth
        error={!!errors.commercial_name}
        helperText={errors.commercial_name?.message}
      />
      <TextField
        {...register('delivery_address')}
        label="Dirección de Entrega"
        fullWidth
        error={!!errors.delivery_address}
        helperText={errors.delivery_address?.message}
      />
      <TextField
        {...register('phone')}
        label="Teléfono"
        fullWidth
        placeholder="+502 1234-5678"
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />
      <TextField
        {...register('email')}
        label="Email"
        type="email"
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        {...register('tax_id')}
        label="NIT (Opcional)"
        fullWidth
        error={!!errors.tax_id}
        helperText={errors.tax_id?.message}
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