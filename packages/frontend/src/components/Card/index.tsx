import { IProduct, CartProduct } from "@/interfaces/product.interface"
import { useClientContext } from "@/hooks";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import './index.css';

interface CardProps {
  product: CartProduct;
}

const Card = ({ product }: CardProps) => {
  const { cartProducts, count, setCount, openCheckoutSideMenuHandler, addProduct } = useClientContext();

  interface AddProductToCartEvent extends React.MouseEvent<HTMLElement> { }

  const addProductToCart = (event: AddProductToCartEvent, product: IProduct): void => {
    event.preventDefault();
    addProduct(product);
    setCount(count + 1);
    openCheckoutSideMenuHandler();
  }

  const renderIcon = () => {
    const isProductInCart = cartProducts.find((cartProduct) => cartProduct.idProductos === product.idProductos);

    const productWithoutStock = product.stock === 0;

    if (productWithoutStock) {
      return (
        <span className="card--icon stock-disabled">
          Agotado
        </span>
      )
    }

    if (isProductInCart) {
      return (
        <span className="card--icon">
          <CheckIcon />
        </span>
      )
    }
    if (!isProductInCart) {
      return (
        <span className="card--icon" onClick={(event) => addProductToCart(event, product)}>
          <AddIcon />
        </span>
      )
    }

  }

  return (
    <div className="card--container">
      <figure>
        {renderIcon()}
        <img src={product.foto} alt={product.nombre} />
        <figcaption>
          <h3>{product.nombre}</h3>
        </figcaption>
      </figure>
      <div>
        <p>${product.precio.toFixed(2)}</p>
        <p>{product.marca}</p>
      </div>
    </div>
  )
}

export default Card;