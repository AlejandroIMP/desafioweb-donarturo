import { IOrder, IOrderDetails } from '@/interfaces/orderAndDetails.interface';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import './index.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useClientContext } from '@/hooks';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
});

const OrderWIthDetails = (order: IOrder) => {
  const { products } = useClientContext();

  const [orderDetails, setOrderDetails] = useState<IOrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getStatusClass = (status: number) => {
    switch (status) {
      case 7: return 'approved';
      case 8: return 'delivered';
      default: return 'pending';
    }
  };

  const getDetails = async (orderId: number) => {
    try {
      const response = await axios.get(`${apiBaseUrl}order/details/${orderId}`, { headers: getHeaders() });
      setOrderDetails(response.data.data);
      return response.data;
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDetails(order.idOrden);
  }, [])

  const renderProductName = (idProducto: number) => {
    const product = products.find(product => product.idProductos === idProducto);
    return <h2>{product?.nombre}</h2>
  }

  return (
    <section
      style={{
        width: '100%',
      }}>

      {
        loading ? (
          <div className="loading-state">Loading order...</div>
        ) : error ? (
          <div className="error-state">Error loading order</div>
        ) : (
          <article          
            style={{
              margin: '1rem',
             }} >
            <div 
              className="order--card" 
            >
              <h2>Orden: #{order.idOrden}</h2>
              <p>
                <span>Fecha de entrega:</span>
                <span>{formattedDate(order.fecha_entrega)}</span>
              </p>
              <p>
                <span>Fecha de creación:</span>
                <span>{formattedDate(order.fecha_creacion)}</span>
              </p>
              <p>
                <span>Estado:</span>
                <span className={`order--status ${getStatusClass(order.estados_idestados)}`}>
                  {formattedState(order.estados_idestados)}
                </span>
              </p>
              <p>
                <span>Total:</span>
                <span>Q {formattedPrice(order.total_orden)}</span>
              </p>
            </div>
            <h3 style={{ textAlign:'center'}}>Detalles</h3>
            <section style={
              { display:'grid', marginTop: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', width: '100%', gap: '1rem' }  
            }>

            {
              orderDetails.map(detail => (
                <div className="order--card" key={detail.idOrdenDetalles}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <h2>Product: #{detail.idProductos}</h2>
                  {
                    renderProductName(detail.idProductos)
                  }
                  </div>
                  <p>
                    <span>Price:</span>
                    <span>Q {formattedPrice(detail.precio)}</span>
                  </p>
                  <p>
                    <span>Quantity:</span>
                    <span>{detail.cantidad}</span>
                  </p>
                  <p>
                    <span>Total Price:</span>
                    <span>Q {formattedPrice(detail.precio * detail.cantidad)}</span>
                  </p>
                </div>

              ))
            }
            </section>
          </article>
        )
      }
    </section>
  )
}

export default OrderWIthDetails;