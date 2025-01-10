import AdminLayout from '@/layouts/AdminLayout'
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders, updateOrderState } from '@/services/orders.service';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import LabelState from '@/components/LabelState';

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

  const OrdersNeedsApproval = orders.filter(order => order.estados_idestados === 3);

  const acceptOrder = (orderId: number) => {
    updateOrderState(orderId, 7);
    location.reload();
  }

  const rejectOrder = (orderId: number) => {
    updateOrderState(orderId, 6);
    location.reload();
  }

  if (OrdersNeedsApproval.length === 0) {
    return (
      <AdminLayout>
        <div className="empty-state">No hay pedidos pendientes de aprobación</div>
      </AdminLayout>
    )
  }



  return (
    <AdminLayout>
      <h1>
        Pedidos pendientes de aprobación
      </h1>
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
                <th>Usser</th>
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
                    <td data-label='ID'>{order.idOrden}</td>
                    <td data-label='Usuario'>{order.idusuarios}</td>
                    <td data-label='Fecha Entrega'>{formattedDate(order.fecha_entrega)}</td>
                    <td data-label='Total'>{order.total_orden}</td>
                    <LabelState estados={order.estados_idestados} />
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
