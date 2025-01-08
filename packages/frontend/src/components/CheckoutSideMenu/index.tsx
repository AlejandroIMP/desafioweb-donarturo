import { Link } from "react-router"
import { useClientContext } from "@/hooks"
import CheckoutCard from "@/components/CheckoutCard"
import CloseIcon from '@mui/icons-material/Close';
import './index.css';
import { Button } from "@mui/material";

const CheckoutSideMenu = () => {
  const { cartProducts, openCheckoutSideMenu, closeCheckoutSideMenuHandler, totalPrice } = useClientContext();


  return (
    <aside className={`checkout--side--menu ${openCheckoutSideMenu ? 'open' : ''}`}>
      <div className="checkout--header">
        <h2 className="checkout--header-title">Mi Carrito</h2>
        <span onClick={closeCheckoutSideMenuHandler}>
          <CloseIcon />
        </span>
      </div>
      
      <div className="checkout--products">
        {cartProducts.map((product) => (
          <CheckoutCard
            key={product.idProductos}
            product={product}
          />
        ))}
      </div>
      
      <div className="checkout--footer">
        <div className="checkout--total">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <Button
          component={Link} 
          to="/cart" 
          variant="contained" 
          color="primary"
          onClick={closeCheckoutSideMenuHandler} 
          fullWidth
        >
          Ir al Carrito
        </Button>
      </div>
    </aside>
  )
}

export default CheckoutSideMenu;