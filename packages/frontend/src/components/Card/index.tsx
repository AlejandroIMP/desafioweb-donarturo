import { IProduct } from "@/interfaces/product.interface"
import AddIcon from '@mui/icons-material/Add';
import './index.css';

interface CardProps {
  product: IProduct;
}

const Card = ({ product }: CardProps) => {
  const renderIcon = () => {
    return (
      <AddIcon />
    )
  }

  return (
    <div className="card--container">
      <figure>
        <img src={product.foto} alt={product.nombre} />
        <figcaption>
          <h3>{product.nombre}</h3>
        </figcaption>
      </figure>
      <div>
        <p>{product.precio}</p>
        <p>{product.marca}</p>
      </div>
    </div>
  )
}

export default Card;