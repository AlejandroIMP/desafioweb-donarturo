import { Link } from "react-router"
import { useClientContext } from "@/hooks"
import CheckoutCard from "@/components/CheckoutCard"
import CloseIcon from '@mui/icons-material/Close';
import './index.css';

const CheckoutSideMenu = () => {
  const { cartProducts, openCheckoutSideMenu, closeCheckoutSideMenuHandler, totalPrice } = useClientContext();


  return (
    <aside
      className={`checkout--side--menu ${openCheckoutSideMenu ? 'open' : ''}`}
    >
      <div>
        <h2>Mis Ordenes</h2>
        <span onClick={closeCheckoutSideMenuHandler}>
          <CloseIcon />
        </span>
      </div>
      <div>
        {
          cartProducts.map((product) => (
            <CheckoutCard
              key={product.idProductos}
              product={product}
            />
          ))
        }
      </div>
      <div>
        <p>
          Total: ${totalPrice}
        </p>
        <Link to='/cart'>
          Go to Cart
        </Link>
      </div>
    </aside>
  )
}

export default CheckoutSideMenu;