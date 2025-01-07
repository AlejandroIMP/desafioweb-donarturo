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


const NavbarAdmin = () => {
  const { setCount, setCartProducts, closeCheckoutSideMenuHandler } = useClientContext();
  const [theme, setTheme] = useState(localStorage.getItem('theme-mode') || 'system');
  const [mainMenuAnchor, setMainMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMainMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMainMenuAnchor(event.currentTarget);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
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
  }

  return (
    <nav className="navbar">
      <div className="desktop-menu">
        <ul className="nav-list">
          <li className='nav-item'>
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Home
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Products
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Users
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Orders
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/admin/clients' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Clients
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to='/admin/categories' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Categories
            </NavLink>
          </li>
          <li className='nav-item'>
            <NavLink to="/admin/orders/approval" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Order Approval
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
              Store
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
          <MenuItem onClick={() => setMainMenuAnchor(null)}>
            <NavLink to="/admin" className='nav-link'>Home</NavLink>
          </MenuItem>
          <MenuItem onClick={() => setMainMenuAnchor(null)}>
            <NavLink to="/admin/products" className='nav-link'>Products</NavLink>
          </MenuItem>
          <MenuItem onClick={() => setMainMenuAnchor(null)}>
            <PeopleIcon className="menu-icon" />
            <NavLink to="/admin/users" className='nav-link'>Users</NavLink>
          </MenuItem>
          <MenuItem onClick={() => setMainMenuAnchor(null)}>
            <ShoppingCartIcon className="menu-icon" />
            <NavLink to="/admin/orders" className='nav-link'>Orders</NavLink>
          </MenuItem>
          <MenuItem onClick={() => setMainMenuAnchor(null)}>
            <GroupIcon className="menu-icon" />
            <NavLink to='/admin/clients' className='nav-link'>Clients</NavLink>
          </MenuItem>
          <MenuItem onClick={() => setMainMenuAnchor(null)}>
            <CategoryIcon className="menu-icon" />
            <NavLink to='/admin/categories' className='nav-link'>Categories</NavLink>
          </MenuItem>
          <MenuItem onClick={() => setMainMenuAnchor(null)}>
            <CheckCircleIcon className="menu-icon" />
            <NavLink to="/admin/orders/approval" className='nav-link'>Order Approval</NavLink>
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
          <MenuItem onClick={() => setUserMenuAnchor(null)}>
            <AccountCircleIcon className="menu-icon" />
            <NavLink to="/admin/account" className='nav-link'>{email}</NavLink>
          </MenuItem>
          <MenuItem onClick={() => setUserMenuAnchor(null)}>
            <NavLink to='/home' className='nav-link'>Store</NavLink>
          </MenuItem>
          <MenuItem onClick={() => {
            setUserMenuAnchor(null);
            Logout();
          }}>
            <NavLink to='/auth/login' className='nav-link'>Cerrar sesion</NavLink>
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
