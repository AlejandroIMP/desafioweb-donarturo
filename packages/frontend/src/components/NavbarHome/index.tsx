import { NavLink } from "react-router";
import { useClientContext } from "@/hooks";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const NavbarHome = () => {
  const { count } = useClientContext();

  const email = localStorage.getItem('email');
  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/home'>Home</NavLink>
        </li>
      </ul>
      <ul>
        <li>
          <NavLink to="/my-account">
            {email}
          </NavLink>
        </li>
        <li>
          <NavLink to='/Cart'>
            <AddShoppingCartIcon />
            {count}
          </NavLink>
        </li>
        <li>
          <NavLink to='/Orders'>Orders</NavLink>
        </li>
        <li>
          <NavLink to='/auth/login'
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('email');
            }}
          >
            Cerrar sesion
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavbarHome;