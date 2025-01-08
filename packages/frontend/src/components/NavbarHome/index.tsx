import { NavLink } from "react-router";
import { useClientContext } from "@/hooks";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useState, useEffect } from "react";
import { Menu, IconButton, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './index.css';

const NavbarHome = () => {
  const { count, setCount, setCartProducts, closeCheckoutSideMenuHandler, setTotalPrice, setUserOrders } = useClientContext();
  const [theme, setTheme] = useState(localStorage.getItem('theme-mode') || 'system');
  const [mainMenuAnchor, setMainMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMainMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMainMenuAnchor(event.currentTarget);
  };

  useEffect(() => {
    const updateTheme = () => {
      const themeMode = localStorage.getItem('theme-mode') || 'system';
      const isDark = themeMode === 'dark' ||
        (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    updateTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateTheme);
    };
  }, [theme]);

  const email = localStorage.getItem('email');

  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('idusuario');
    setCount(0);
    setCartProducts([]);
    closeCheckoutSideMenuHandler();
    setTotalPrice(0);
    setUserOrders([]);
  }

  return (
    <nav className="navbar ">
      <div className="desktop-menu">
        <ul className="nav-list navbar--client-list">
          <li className='nav-item'>
            <NavLink to='/home' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to="/my-account" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {email}
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/Cart' className={({ isActive }) => isActive ? 'nav-link active cart--link--container' : 'nav-link cart--link--container'}>   
              {count}
              <AddShoppingCartIcon />
              Carrito
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/Orders' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Orders</NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/auth/login' className='nav-link'
              onClick={() => {
                Logout();
              }}
            >
              Cerrar sesion
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mobile-menu">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMainMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="main-menu"
          anchorEl={mainMenuAnchor}
          keepMounted
          open={Boolean(mainMenuAnchor)}
          onClose={() => setMainMenuAnchor(null)}
        >
          <MenuItem>
            <NavLink to='/home' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to="/my-account" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {email}
            </NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to='/Cart' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {count}
              <AddShoppingCartIcon />
              Carrito
            </NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to='/Orders' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Orders</NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to='/auth/login' className='nav-link'
              onClick={() => {
                Logout();
              }}
            >
              Cerrar sesion
            </NavLink>
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
}

export default NavbarHome;
