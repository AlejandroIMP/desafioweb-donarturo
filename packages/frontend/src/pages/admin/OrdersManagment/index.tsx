import AdminLayout from '@/layouts/AdminLayout';
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders } from '@/services/orders.service';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';

const OrdersManagment = () => {
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

  return (
    <AdminLayout>
      Orders
      {
        loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>There was an error</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Estado</th>
                <th>Fecha de creación</th>
                <th>Fecha de entrega</th>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Direccion</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.idOrden}>
                  <td>{order.idOrden}</td>
                  <td>{formattedState(order.estados_idestados)}</td>
                  <td>{formattedDate(order.fecha_creacion)}</td>
                  <td>{formattedDate(order.fecha_entrega)}</td>
                  <td>{order.idusuarios}</td>
                  <td>{order.nombre_completo}</td>
                  <td>{order.direccion}</td>
                  <td>{order.telefono}</td>
                  <td>{order.correo_electronico}</td>
                  <td>{formattedPrice(Number(order.total_orden))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </AdminLayout>
  );
};

export default OrdersManagment;