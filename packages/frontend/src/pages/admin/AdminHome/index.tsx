import AdminLayout from "@/layouts/AdminLayout";
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders, updateOrderState } from '@/services/orders.service';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import LabelState from '@/components/LabelState';

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
                <th>ID</th>
                <th>usuario</th>
                <th>Entrega de orden</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                ordersNeedsDelivered.map(order => (
                  <tr key={order.idOrden}>
                    <td data-label='ID'>{order.idOrden}</td>
                    <td data-label='Usuario'>{order.idusuarios}</td>
                    <td data-label='Fecha Entrega'>{formattedDate(order.fecha_entrega)}</td>
                    <td data-label='Total'>Q{order.total_orden}</td>
                    <LabelState estados={order.estados_idestados} />
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
