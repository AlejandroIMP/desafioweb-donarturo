import { NavLink } from "react-router";


const NavbarHome = () => {

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
          <NavLink to='/Cart'>Cart</NavLink>
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