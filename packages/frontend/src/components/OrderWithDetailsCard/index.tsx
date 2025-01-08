import { IOrder, IOrderDetails } from '@/interfaces/orderAndDetails.interface';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { useNavigate } from 'react-router';
import './index.css'
import axios from 'axios';
import { useEffect, useState } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
});

const OrderWIthDetails = (order: IOrder) => {
  const [orderDetails, setOrderDetails] = useState<IOrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const getStatusClass = (status: number) => {
    switch (status) {
      case 7: return 'approved';
      case 8: return 'delivered';
      default: return 'pending';
    }
  };

  const getDetails = async (orderId: number) => {
    try {
      const response = await axios.get(`${apiBaseUrl}order/details/${orderId}`,{headers: getHeaders()});
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

  console.log(orderDetails);

  return (
    <section>
      <div>
        <h1>Order</h1>
      </div>
      {
        loading ? (
          <div className="loading-state">Loading products...</div>
        ) : error ? (
          <div className="error-state">Error loading products</div>
        ) : (
          <article>
            <div className="order--card" onClick={() => navigate(`/orders/${order.idOrden}`)}>
              <h2>Order: #{order.idOrden}</h2>
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

            {
              orderDetails.map(detail => (
                <div className="order--card" key={detail.idOrdenDetalles}>
                  <h2>Product: #{detail.idProductos}</h2>
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
          </article>
        )
      }
    </section>
  )
}

export default OrderWIthDetails;