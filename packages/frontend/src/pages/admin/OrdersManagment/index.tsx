import AdminLayout from '@/layouts/AdminLayout';
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { getAllOrders } from '@/services/orders.service';
import { useState, useEffect } from 'react';
import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OrderFormUpdate from '@/components/OrderUpdateForm';
import TableOrdersManagment from '@/components/TableOrdersManagment';

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
          <h1 className="management-title">Manejo de ordenes</h1>
        {
          loading ? (
            <div className='loading-state'>Cargando Ordenes...</div>
          ) : error ? (
            <div className='error-state'>Ha habido un error al cargar ordenes</div>
          ) : (
            <TableOrdersManagment orders={orders} handleOpenModalEdit={handleOpenModalEdit} />
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
        
    </AdminLayout>
  );
};

export default OrdersManagment;