import AdminLayout from '@/layouts/AdminLayout'
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders, updateOrderState } from '@/services/orders.service';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';

const OrderApproval = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getAllOrders();
        setOrders(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const OrdersNeedsApproval = orders.filter(order => order.estados_idestados !== 1);
  console.log(OrdersNeedsApproval);

  return (
    <AdminLayout>
      OrderApproval
      {
        loading ? 'Loading...' : error ? 'Error' : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client</th>
                <th>Order Date</th>
                <th>Total</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                OrdersNeedsApproval.map(order => (
                  <tr key={order.idOrden}>
                    <td>{order.idOrden}</td>
                    <td>{order.Clientes_idClientes}</td>
                    <td>{formattedDate(order.fecha_entrega)}</td>
                    <td>{order.total_orden}</td>
                    <td>{formattedState(order.estados_idestados)}</td>
                    <td>
                      <button onClick={() => updateOrderState(order.idOrden, 1)}>Approve</button>
                      <button onClick={() => updateOrderState(order.idOrden, 2)}>Reject</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )
      }
    </AdminLayout>
  )
};

export default OrderApproval;
