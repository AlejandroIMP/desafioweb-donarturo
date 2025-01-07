import { useState } from 'react';
import {  CartProduct } from '@/interfaces/product.interface';
import { useClientContext } from '@/hooks';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './index.css';

interface CardProps {
  product: CartProduct;
}

const CheckoutCard = ({ product }: CardProps) => {
  const { setCartProducts } = useClientContext();
  const [quantity, setQuantity] = useState(product.quantity?? 1);

  const removeProductHandler = () => {
    setCartProducts((prev: CartProduct[]) => 
      prev.filter((item: CartProduct) => item.idProductos !== product.idProductos)
    );
  };


  const updateQuantity = (newQuantity: number) => {
    setCartProducts(prev => 
      prev.map(item => 
        item.idProductos === product.idProductos 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateQuantity(newQuantity);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(newQuantity);
    }
  };

  return (
    <div className='checkout--card'>
      <div>
        <figure>
          <img src={product.foto} alt={product.nombre} />
        </figure>
        <p>{product.nombre}</p>
      </div>
      <div className='quantity-controls'>
        <button onClick={decreaseQuantity} disabled={quantity <= 1}>
          <RemoveIcon />
        </button>
        <span>{quantity}</span>
        <button onClick={increaseQuantity} disabled={quantity >= product.stock}>
          <AddIcon />
        </button>
      </div>
      <div>
        <p>${product.precio * quantity}</p>
        <button onClick={removeProductHandler}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default CheckoutCard;