import ClientLayout from '@/layouts/ClientLayout';
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { useClientContext } from '@/hooks';
import { updateOrderState } from '@/services/orders.service';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import OrderCard from '@/components/OrderCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

  const isOrderDeclined = (order: IOrder) => {
    return order.estados_idestados === 4;
  }

  return (
    <ClientLayout>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ArrowBackIcon style={{ cursor:'pointer'}} onClick={() => Navigate(-1)} />
        <h1>Order</h1>
      </div>
      {
        <OrderCard
          key={Order.idOrden}
          {...Order} />
      }
      <Button
        variant='contained'
        color='error'
        disabled={isOrderDeclined(Order)}
        onClick={() => {
          inactiveOrder(Order.idOrden), location.reload()
          }
        }
      >
        Cancelar Orden
      </Button>
    </ClientLayout>
  );
};

export default Order;
