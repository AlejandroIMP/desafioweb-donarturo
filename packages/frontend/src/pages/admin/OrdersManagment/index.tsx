import AdminLayout from '@/layouts/AdminLayout';
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders, updateOrderState } from '@/services/orders.service';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OrderFormUpdate from '@/components/OrderUpdateForm';

const OrdersManagment = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [SelectedOrder, setSelectedOrder] = useState<IOrder>({
    idOrden: 0,
    fecha_creacion: '',
    fecha_entrega: '',
    total_orden: 0,
    estados_idestados: 0,
    idusuarios: 0,
    nombre_completo: '',
    direccion: '',
    telefono: '',
    correo_electronico: '',
    Clientes_idClientes: 0
  });

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

  const handleOpenModalEdit = (order: IOrder) => {
    setSelectedOrder(order);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setSelectedOrder({
      idOrden: 0,
      fecha_creacion: '',
      fecha_entrega: '',
      total_orden: 0,
      estados_idestados: 0,
      idusuarios: 0,
      nombre_completo: '',
      direccion: '',
      telefono: '',
      correo_electronico: '',
      Clientes_idClientes: 0
    });
    setOpenModalEdit(false);
  };

  if (orders.length === 0) {
    return (
      <AdminLayout>
        <div className='empty-state'>No hay ordenes</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='management-container'>
        <div className='management-header'>
          <h1 className="management-title">Manejo de ordenes</h1>

        </div>
        {
          loading ? (
            <div className='loading-state'>Cargando Ordenes...</div>
          ) : error ? (
            <div className='error-state'>Ha habido un error al cargar ordenes</div>
          ) : (
            <table className='management-table'>
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.idOrden}>
                    <td aria-label='id'>{order.idOrden}</td>
                    <td data-label="Estado">
                      <span className={`product-status ${order.estados_idestados === 1 || order.estados_idestados === 7 || order.estados_idestados === 8 ? 'status-active' : order.estados_idestados === 3 ? 'status-pending' : 'status-inactive'}`}>
                        {formattedState(order.estados_idestados)}
                      </span>
                    </td>
                    <td aria-label='creacion'>{formattedDate(order.fecha_creacion)}</td>
                    <td aria-label='entrega'>{formattedDate(order.fecha_entrega)}</td>
                    <td aria-label='usuario'>{order.idusuarios}</td>
                    <td aria-label='nombre'>{order.nombre_completo}</td>
                    <td aria-label='direccion'>{order.direccion}</td>
                    <td aria-label='Telefono'>{order.telefono}</td>
                    <td aria-label='Corre'>{order.correo_electronico}</td>
                    <td aria-label='Total'>{formattedPrice(Number(order.total_orden))}</td>
                    <td className='product-actions'>
                      <Button
                        variant='text'
                        color='primary'
                        onClick={() => handleOpenModalEdit(order)}
                      >
                        Editar
                      </Button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
        <Dialog
          open={openModalEdit}
          onClose={handleCloseModalEdit}
          maxWidth="md"
          fullWidth
        >
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px'
          }}>
            <IconButton
              onClick={handleCloseModalEdit}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            <OrderFormUpdate order={SelectedOrder} />
          </div>
        </Dialog>
        
      </div>
    </AdminLayout>
  );
};

export default OrdersManagment;