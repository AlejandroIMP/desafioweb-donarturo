import { NavLink } from "react-router";

const NavbarLanding = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/auth/login'>Iniciar Sesion</NavLink>
        </li>
        <li>
          <NavLink to='/auth/register'>Registrarse</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavbarLanding;