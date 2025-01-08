import ClientLayout from '@/layouts/ClientLayout';
import { useClientContext } from '@/hooks';
import OrderCard from '@/components/OrderCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';

const Orders = () => {
  const { userOrders } = useClientContext();
  const Navigate = useNavigate();
  if (!userOrders.length) {
    return (
      <ClientLayout>
        <h1>Orders</h1>
        <p>No orders found</p>
        <Button
variant='contained' color='secondary' onClick={() => Navigate('/home')}
        >
          Ir atras
        </Button>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ArrowBackIcon style={{ cursor:'pointer'}} onClick={() => Navigate('/home')} />
        <h1>Orders</h1>
      </div>
      <section className="orders--container">
        {
          userOrders.map(order => (
            <OrderCard key={order.idOrden} {...order} />
          ))
        }
      </section>
    </ClientLayout>
  );
};

export default Orders;
