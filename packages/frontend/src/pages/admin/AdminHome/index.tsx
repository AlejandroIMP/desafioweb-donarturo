import AdminLayout from "@/layouts/AdminLayout";
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders, updateOrderState } from '@/services/orders.service';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';

const AdminHome = () => {
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

  const ordersNeedsDelivered = orders.filter(order => order.estados_idestados === 7);

  const deliveredOrder = (orderId: number) => {
    updateOrderState(orderId, 8);
    location.reload();
  }


  if (ordersNeedsDelivered.length === 0) {
    return (
      <AdminLayout>
        <div className="empty-state">No hay pedidos pendientes de marcar entregado</div>
      </AdminLayout>
    )
  }


  return (
    <AdminLayout>
      
      <h1>Control de entrega de pedidos</h1>
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
                <th>user</th>
                <th>Order Date</th>
                <th>Total</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                ordersNeedsDelivered.map(order => (
                  <tr key={order.idOrden}>
                    <td>{order.idOrden}</td>
                    <td>{order.idusuarios}</td>
                    <td>{formattedDate(order.fecha_entrega)}</td>
                    <td>Q{order.total_orden}</td>
                    <td data-label="Estado">
                      <span className={`product-status ${order.estados_idestados === 7 ? 'status-active' : 'status-pending'}`}>
                        {formattedState(order.estados_idestados)}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant='contained'
                        color='success'
                        onClick={() => deliveredOrder(order.idOrden)}>Confirmar Entrega</Button>
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

export default AdminHome;
