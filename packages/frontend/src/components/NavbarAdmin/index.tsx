import { NavLink } from 'react-router-dom';
import { useClientContext } from '@/hooks';

const NavbarAdmin = () => {
  const { setCount, setCartProducts, closeCheckoutSideMenuHandler } = useClientContext();

  const email = localStorage.getItem('email');

  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    setCount(0);
    setCartProducts([]);
    closeCheckoutSideMenuHandler();
  }
  
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/admin">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products">
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users">
            Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/orders">
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink to='/admin/clients'>
            Clients
          </NavLink>
        </li>
        <li>
          <NavLink to='/admin/categories'>
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/order/approval">
            Order Approval
          </NavLink>
        </li>
      </ul>
      <ul>
        <li>
          <NavLink to="/admin/account">
            {email}
          </NavLink>
        </li>
        <li>
          <NavLink to='/home'>
            Store
          </NavLink>
        </li>
        <li>
        <NavLink to='/auth/login'
          onClick={() => {
            Logout();
          }}
        >
          Cerrar sesion
        </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavbarAdmin;
