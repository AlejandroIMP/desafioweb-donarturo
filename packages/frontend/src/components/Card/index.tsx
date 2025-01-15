import { DataProduct, CartProduct } from "@/interfaces/product.interface"
import ProductInfoModal from '@/components/ProductInfoModal';
import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useClientContext } from "@/hooks";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import './index.css';

interface CardProps {
  product: CartProduct;
}

const Card = ({ product }: CardProps) => {
  const { cartProducts, count, setCount, openCheckoutSideMenuHandler, addProduct } = useClientContext();

  const [openModalProd, setOpenModalProd] = useState(false);

  const handleCloseModalProd = () => {
    setOpenModalProd(false);
  };

  const handleOpenModalProd = () => {
    setOpenModalProd(true);
  };


  interface AddProductToCartEvent extends React.MouseEvent<HTMLElement> { }

  const addProductToCart = (event: AddProductToCartEvent, product: DataProduct): void => {
    event.stopPropagation();
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
    <>

      <div className="card--container" onClick={handleOpenModalProd}>
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
      <Dialog
        open={openModalProd}
        onClose={handleCloseModalProd}
        maxWidth="md"
        fullWidth
      >
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '8px'
        }}>
          <IconButton
            onClick={handleCloseModalProd}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div>
          <ProductInfoModal product={product} />
        </div>
      </Dialog>
    </>
  )
}

export default Card;