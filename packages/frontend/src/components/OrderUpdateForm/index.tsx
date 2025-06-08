import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderSchemaUpdate, OrderSchemaUpdateForm } from "@/schemas/order.schemas";
import { updateOrder } from "@/services/orders.service";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { IOrder } from "@/interfaces/orderAndDetails.interface";
import { useState } from "react";

interface OrderFormUpdateProps {
  order: IOrder;
}

const OrderFormUpdate = ({ order }: OrderFormUpdateProps) => {
  const [valueState, setValueState] = useState(order.state_id);
  const [clientValue, setClientValue] = useState(order.client_id.toString());

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderSchemaUpdateForm>({
    resolver: zodResolver(OrderSchemaUpdate),
    mode: 'onChange',
    defaultValues: {
      user_id: order.user_id,
      state_id: valueState,
      customer_name: order.customer_name,
      delivery_address: order.delivery_address,
      phone: order.phone,
      email: order.email,
      delivery_date: order.delivery_date,
      client_id: order.client_id.toString()
    }
  });

  const onSubmit = async (data: OrderSchemaUpdateForm) => {
    Number(data.client_id) === 0 ? data.client_id = null : data.client_id;
    Number(data.state_id);
    console.log(data);
    try {
      await updateOrder(order.order_id, data);
      reset();
      location.reload();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="ID Orden"
        type="number"
        fullWidth
        disabled={true}
        defaultValue={order.order_id}
      />
      <TextField
        label="Fecha de creación"
        fullWidth
        disabled={true}
        defaultValue={order.created_at}
      />
      <TextField
        label="Usuario ID"
        type="number"
        fullWidth
        disabled={true}
        defaultValue={order.user_id}
      />
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={valueState}
        label="Estado"
        {...register('state_id')}
        onChange={(e) => setValueState(Number(e.target.value))}
      >
        <MenuItem value={'1'}>Activo</MenuItem>
        <MenuItem value={'2'}>Inactivo</MenuItem>
        <MenuItem value={'3'}>En proceso</MenuItem>
      </Select>
      <TextField
        label="Nombre del cliente"
        type="text"
        fullWidth
        error={!!errors.customer_name}
        helperText={errors.customer_name?.message}
        {...register('customer_name')}
      />
      <TextField
        label="Dirección de entrega"
        type="text"
        fullWidth
        error={!!errors.delivery_address}
        helperText={errors.delivery_address?.message}
        {...register('delivery_address')}
      />
      <TextField
        label="Teléfono"
        type="text"
        fullWidth
        error={!!errors.phone}
        helperText={errors.phone?.message}
        {...register('phone')}
      />
      <TextField
        label="Correo electrónico"
        type="email"
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
      />
      <TextField
        label="Fecha de entrega"
        type="text"
        fullWidth
        error={!!errors.delivery_date}
        helperText={errors.delivery_date?.message}
        {...register('delivery_date')}
      />
      <TextField
        label="Cliente ID"
        type="number"
        fullWidth
        error={!!errors.client_id}
        helperText={errors.client_id?.message}
        defaultValue={clientValue}
        {...register('client_id')}
        onChange={(e) => setClientValue(e.target.value)}
      />
      <Button variant='contained' color='primary' type='submit'>Actualizar</Button>
    </form>
  )

}

export default OrderFormUpdate;