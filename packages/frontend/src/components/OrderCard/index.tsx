import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { formattedDate, formattedPrice, formattedState } from '@/utils/orderUtils';
import { useNavigate } from 'react-router';
import './index.css'

const OrderCard = (order: IOrder) => {

  const navigate = useNavigate();

  const getStatusClass = (status: number) => {
    switch(status) {
      case 7: return 'approved';
      case 8: return 'delivered';
      default: return 'pending';
    }
  };
  return (
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
  )
}

export default OrderCard;