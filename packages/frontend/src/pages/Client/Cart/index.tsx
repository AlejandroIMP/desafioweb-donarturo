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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Button variant='contained' color='primary'>
            <Link to='/checkout' style={{
              textDecoration: 'none',
              color: 'white',
            }}>Confirmar Compra</Link>
          </Button>
          <Button variant='contained' color='error'
            onClick={handleCancelPurchase}
          >
            Rechazar
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Cart;
