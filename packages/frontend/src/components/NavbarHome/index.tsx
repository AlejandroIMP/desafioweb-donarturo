import { NavLink } from "react-router";

const NavbarHome = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/home'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/Cart'>Cart</NavLink>
        </li>
        <li>
          <NavLink to='/Orders'>Orders</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavbarHome;