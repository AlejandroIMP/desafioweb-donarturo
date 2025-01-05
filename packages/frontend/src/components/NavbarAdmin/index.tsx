import { NavLink } from 'react-router-dom';

const NavbarAdmin = () => {

  const email = localStorage.getItem('email');

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
        <li>
          <NavLink to='/home'>
            Store
          </NavLink>
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

export default NavbarAdmin;