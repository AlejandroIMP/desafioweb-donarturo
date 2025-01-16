import AdminLayout from "@/layouts/AdminLayout";
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders } from '@/services/orders.service';
import { useState, useEffect } from 'react';
import TableOrdersDeliver from "@/components/TableOrdersDeliver";

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
          <TableOrdersDeliver orders={ordersNeedsDelivered} />
        )
      }
    </AdminLayout>
  )
};

export default AdminHome;
