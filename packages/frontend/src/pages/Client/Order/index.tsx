import ClientLayout from '@/layouts/ClientLayout';
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { useClientContext } from '@/hooks';
import { updateOrderState } from '@/services/orders.service';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Order = () => {
  const { userOrders } = useClientContext();

  const Navigate = useNavigate();
  interface findOrder {
    success: boolean;
    data: IOrder;
  }

  const path = window.location.pathname;

  const findOrderById = (): findOrder => {
    const id = path.split('/')[2];
    const data = userOrders.find(order => order.idOrden === parseInt(id));

    if (data) {

      return { success: true, data };
    }
    return { success: false, data: {} as IOrder };
  }

  const Order = findOrderById().data;

  const inactiveOrder = (id: number) => {
    const confirm = window.confirm('¿Está seguro que desea cancelar la orden? Esta operación no se puede deshacer');
    if (!confirm) {
      return;
    }
    const newState: number = 4;
    try {
      updateOrderState(id, newState);
      alert('Orden Cancelada');
    } catch (error) {
      alert('Error al cancelar orden');
    }
  }

  if (findOrderById().success === false) {


    return (
      <ClientLayout>
        <h1>Order</h1>
        <p>No orders found</p>
        <div>
          <Button variant='contained' color='primary' onClick={() => location.reload()}>Recarga la pagina aqui</Button>
          <Button variant='contained' color='secondary' onClick={() => Navigate(-1)}>Ir atras</Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <h1>Order</h1>
      {
        <div>
          <h2>Order: {Order.idOrden}</h2>
          <p>Fecha de entrega: {formattedDate(Order.fecha_entrega)}</p>
          <p>Fecha de creacion: {formattedDate(Order.fecha_creacion)}</p>
          <p>Order state: {formattedState(Order.estados_idestados)}</p>
          <p>Total: Q{formattedPrice(Order.total_orden)}</p>
          <Button
            variant='contained'
            color='error'
            disabled={Order.estados_idestados === 2}
            onClick={() => {
              inactiveOrder(Order.idOrden), location.reload()
            }
            }>Cancelar Orden</Button>
        </div>
      }
    </ClientLayout>
  );
};

export default Order;
