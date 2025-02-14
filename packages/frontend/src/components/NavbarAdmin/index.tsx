import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useClientContext } from '@/hooks';
import { useEffect, useState } from 'react';
import './index.css';
import { Menu, IconButton, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';

const NavbarAdmin = () => {
  const { setCount, setCartProducts, closeCheckoutSideMenuHandler, setTotalPrice, setUserOrders } = useClientContext();
  const [theme, setTheme] = useState(localStorage.getItem('theme-mode') || 'dark');
  const [mainMenuAnchor, setMainMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const Navigate = useNavigate();

  const handleMainMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMainMenuAnchor(event.currentTarget);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };


  useEffect(() => {
    const updateTheme = () => {
      const themeMode = localStorage.getItem('theme-mode') || 'dark';
      const isDark = themeMode === 'dark' ||
        (themeMode === 'dark' && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
    setTheme('dark');
  }

  return (
    <nav className="navbar">
      <div className="desktop-menu">
        <ul className="nav-list">
          <li className='nav-item'>
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Inicio
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Productos
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Usuarios
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Ordenes
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/admin/clients' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Clientes
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/admin/categories' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Categorias
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to="/admin/orders/approval" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Aprobacion de Ordenes
            </NavLink>
          </li>
        </ul>
        <ul className="nav-list">
          <li className='nav-item'>
            <NavLink to="/admin/account" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {email}
            </NavLink>
          </li >
          <li className='nav-item' >
            <NavLink to='/home' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Tienda
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/auth/login' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
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
          onClick={handleMainMenuOpen}
          className="menu-button"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={mainMenuAnchor}
          open={Boolean(mainMenuAnchor)}
          onClose={() => setMainMenuAnchor(null)}
        >
          <MenuItem onClick={() => {
            setMainMenuAnchor(null);
            Navigate('/admin');
          }}>
            <p>Inicio</p>
          </MenuItem>
          <MenuItem onClick={() => {
              setMainMenuAnchor(null);
              Navigate('/admin/products')
            }}>
            <p>Productos</p>
          </MenuItem>
          <MenuItem onClick={() => {setMainMenuAnchor(null); Navigate('/admin/users')}}>
            <PeopleIcon className="menu-icon" />
            <p>Usuarios</p>
          </MenuItem>
          <MenuItem onClick={() =>{ setMainMenuAnchor(null); Navigate('/admin/orders')}}>
            <ShoppingCartIcon className="menu-icon" />
            <p>Ordenes</p>
          </MenuItem>
          <MenuItem onClick={() => {setMainMenuAnchor(null); Navigate('/admin/clients')}}>
            <GroupIcon className="menu-icon" />
            <p>Clientes</p>
          </MenuItem>
          <MenuItem onClick={() => {setMainMenuAnchor(null); Navigate('/admin/categories')}}>
            <CategoryIcon className="menu-icon" />
            <p>Categorias</p>
          </MenuItem>
          <MenuItem onClick={() => {setMainMenuAnchor(null); Navigate('/admin/orders/approval')}}>
            <CheckCircleIcon className="menu-icon" />
            <p>Aprobacion de Ordenes</p>
          </MenuItem>

        </Menu>

        <IconButton
          onClick={handleUserMenuOpen}
          className="menu-button"
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
        >
          <MenuItem onClick={() => {setUserMenuAnchor(null); Navigate('/admin/account')}}>
            <AccountCircleIcon className="menu-icon" />
            <p>{email}</p>
          </MenuItem>
          <MenuItem onClick={() => {setUserMenuAnchor(null); Navigate('/home')}}>
            <StoreIcon className="menu-icon" />
            <p>Tienda</p>
          </MenuItem>
          <MenuItem onClick={() => {
            setUserMenuAnchor(null);
            Logout();
            Navigate('/auth/login');
          }}>
            <LogoutIcon className="menu-icon" />
            <p>Cerrar sesion</p>
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
