import AdminLayout from '@/layouts/AdminLayout'
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders, updateOrderState } from '@/services/orders.service';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

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

  const acceptOrder = (orderId: number) => {
    updateOrderState(orderId, 1);
    location.reload();
  }

  const rejectOrder = (orderId: number) => {
    updateOrderState(orderId, 4);
    location.reload();
  }

  return (
    <AdminLayout>
      OrderApproval
      {
        loading ? (
          <div className="loading-state">Loading products...</div>
        ) : error ? (
          <div className="error-state">Error loading products</div>
        ) : (
          <table className="management-table">
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
                    <td data-label="Estado">
                      <span className={`product-status ${order.estados_idestados === 1 ? 'status-active' : 'status-inactive'}`}>
                        {formattedState(order.estados_idestados)}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant='text'
                        color='success'
                        onClick={() => acceptOrder(order.idOrden)}>Aprobar</Button>
                      <Button
                        variant='text'
                        color='error'
                        onClick={() => rejectOrder(order.idOrden)}>Rechazar</Button>
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
