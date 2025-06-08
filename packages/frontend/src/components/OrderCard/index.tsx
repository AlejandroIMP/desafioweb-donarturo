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
    <div className="order--card" onClick={() => navigate(`/orders/${order.order_id}`)}>
      <h2>Orden: #{order.order_id}</h2>
      <p>
        <span>Fecha de entrega:</span>
        <span>{formattedDate(order.delivery_date)}</span>
      </p>
      <p>
        <span>Fecha de creación:</span>
        <span>{formattedDate(order.created_at)}</span>
      </p>
      <p>
        <span>Estado:</span>
        <span className={`order--status ${getStatusClass(order.state_id)}`}>
          {formattedState(order.state_id)}
        </span>
      </p>
      <p>
        <span>Total:</span>
        <span>Q {formattedPrice(order.order_total)}</span>
      </p>
    </div>
  )
}

export default OrderCard;