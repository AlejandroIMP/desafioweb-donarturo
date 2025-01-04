import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

const NavbarAdmin = () => {

  const { email } = useAuth();

  console.log(email);
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
          <NavLink to="/login">
            Logout
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
      </ul>
      <ul>
        <li>
          <NavLink to='/home'>
            Store
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavbarAdmin;