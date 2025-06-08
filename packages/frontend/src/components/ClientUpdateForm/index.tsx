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
      business_name: client.business_name,
      commercial_name: client.commercial_name,
      delivery_address: client.delivery_address,
      phone: client.phone,
      email: client.email,
      tax_id: client.tax_id || ''
    }
  });

  const onSubmit = async (data: ClientCreateFormSchema) => {
    try {
      await updateClient(client.client_id, data);
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
        Actualizar Cliente
      </Button>
    </form>
  );
};

export default ClientUpdateForm;