import ClientLayout from '@/layouts/ClientLayout';
import CheckoutCard from '@/components/CheckoutCard';
import { useClientContext } from '@/hooks';
import { Button } from '@mui/material';
import { Link } from 'react-router';

const Cart = () => {
  const { cartProducts, setCartProducts, totalPrice, setCount } = useClientContext();

  const handleCancelPurchase = () => {
    setCartProducts([]);
    setCount(0)
  };

if (cartProducts.length === 0) {
    return (
      <ClientLayout>
        <h1>Cart</h1>
        <p>No products in cart</p>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <h1>Cart</h1>
      <section className='main-products--container'>
        {
          cartProducts.length === 0 ? (
            <p>No products in cart</p>
          ) :
          cartProducts.map((product) => (
            <CheckoutCard
              key={product.idProductos}
              product={product}
            />
          ))
        }
      </section>
      <div>
        <h2>Total: ${totalPrice}</h2>
        <div>
          <Button variant='contained' color='primary'>
            <Link to='/checkout'>Checkout</Link>
          </Button>
          <Button variant='contained' color='secondary'
            onClick={handleCancelPurchase}
          >
            Cancelar compra
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Cart;
