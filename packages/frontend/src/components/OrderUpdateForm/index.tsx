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
  const [valueState, setValueState] = useState(order.estados_idestados);
  const [clientValue, setClientValue] = useState(order.Clientes_idClientes.toString());

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderSchemaUpdateForm>({
    resolver: zodResolver(OrderSchemaUpdate),
    mode: 'onChange',
    defaultValues: {
      idusuario: order.idusuarios,
      estados_idestados: valueState,
      nombre_completo: order.nombre_completo,
      direccion: order.direccion,
      telefono: order.telefono,
      correo_electronico: order.correo_electronico,
      fecha_entrega: order.fecha_entrega,
      Clientes_idClientes: order.Clientes_idClientes.toString()
    }
  });

  const onSubmit = async (data: OrderSchemaUpdateForm) => {
    Number(data.Clientes_idClientes) === 0 ? data.Clientes_idClientes = null : data.Clientes_idClientes;
    Number(data.estados_idestados);
    console.log(data);
    try {
      await updateOrder(order.idOrden, data);
      reset();
      location.reload();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="IdOrden"
        type="number"
        fullWidth
        disabled={true}
        defaultValue={order.idOrden}
      />
      <TextField
        label="Fecha de creacion"
        fullWidth
        disabled={true}
        defaultValue={order.fecha_creacion}
      />
      <TextField
        label="Usuario ID"
        type="number"
        fullWidth
        disabled={true}
        defaultValue={order.idusuarios}
      />
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={valueState}
        label="Estado"
        {...register('estados_idestados')}
        onChange={(e) => setValueState(Number(e.target.value))}
      >
        <MenuItem value={'1'}>Activo</MenuItem>
        <MenuItem value={'2'}>Inactivo</MenuItem>
        <MenuItem value={'3'}>En proceso</MenuItem>
        <MenuItem value={'4'}>Rechazado</MenuItem>
      </Select>
      <TextField
        label="Nombre completo"
        type="text"
        fullWidth
        error={!!errors.nombre_completo}
        helperText={errors.nombre_completo?.message}
        {...register('nombre_completo')}
      />
      <TextField
        label="Dirección"
        type="text"
        fullWidth
        error={!!errors.direccion}
        helperText={errors.direccion?.message}
        {...register('direccion')}
      />
      <TextField
        label="Teléfono"
        type="number"
        fullWidth
        error={!!errors.telefono}
        helperText={errors.telefono?.message}
        {...register('telefono')}
      />
      <TextField
        label="Correo electrónico"
        type="email"
        fullWidth
        error={!!errors.correo_electronico}
        helperText={errors.correo_electronico?.message}
        {...register('correo_electronico')}
      />
      <TextField
        label="Fecha de entrega"
        type="text"
        fullWidth
        error={!!errors.fecha_entrega}
        helperText={errors.fecha_entrega?.message}
        {...register('fecha_entrega')}
      />
      <TextField
        label="Cliente ID"
        type="number"
        fullWidth
        error={!!errors.Clientes_idClientes}
        helperText={errors.Clientes_idClientes?.message}
        defaultValue={clientValue}
        {...register('Clientes_idClientes')}
        onChange={(e) => setClientValue(e.target.value)}
      />
      <Button variant='contained' color='primary' type='submit'>Actualizar</Button>
    </form>
  )

}

export default OrderFormUpdate;