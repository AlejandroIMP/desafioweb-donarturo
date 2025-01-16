import AdminLayout from '@/layouts/AdminLayout'
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders } from '@/services/orders.service';
import { useState, useEffect } from 'react';
import TableOrdersApproval from '@/components/TableOrderApproval';

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
          <TableOrdersApproval orders={OrdersNeedsApproval} />
        )
      }
    </AdminLayout>
  )
};

export default OrderApproval;
