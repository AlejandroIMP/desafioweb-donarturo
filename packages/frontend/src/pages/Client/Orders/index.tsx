import ClientLayout from '@/layouts/ClientLayout';
import { useClientContext } from '@/hooks';
import { useNavigate } from 'react-router';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';

const Orders = () => {
  const { userOrders } = useClientContext();
  const navigate = useNavigate();

  if (!userOrders.length) {
    return (
      <ClientLayout>
        <h1>Orders</h1>
        <p>No orders found</p>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <h1>Orders</h1>
      <section className="orders--container">
        {
          userOrders.map(order => (
            <div key={order.idOrden} className="order--card"
              onClick={() => {
                navigate(`/orders/${order.idOrden}`);
              }}
            >
              <h2>Order: {order.idOrden}</h2>
              <p>Fecha de entrega: {formattedDate(order.fecha_entrega)}</p>
              <p>Fecha de creacion: {formattedDate(order.fecha_creacion)}</p>
              <p>Order state: {formattedState(order.estados_idestados)}</p>
              <p>Total: Q {formattedPrice(order.total_orden)}</p>
            </div>
          ))
        }
      </section>
    </ClientLayout>
  );
};

export default Orders;
