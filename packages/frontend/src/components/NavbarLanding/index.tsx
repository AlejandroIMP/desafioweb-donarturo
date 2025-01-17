import { useNavigate } from "react-router";
import { Typography, List, ListItem, ListItemButton } from "@mui/material";

const NavbarLanding = () => {

  const Navigate = useNavigate();
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem'
      }}
    >
      <Typography variant='h4'>Mi tiendita Online</Typography>
      <List
        style={{
          display: 'flex',
          gap: '1rem'
        }}
      >
        <ListItem>
          <ListItemButton
            onClick={() => Navigate('/auth/login', { replace: true })}
            sx={{
              width: '150px'
            }}
          >
            Iniciar Sesion
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton
            onClick={() => Navigate('/auth/register', { replace: true })}
          >
            Registrarse
          </ListItemButton>
        </ListItem>
      </List>
    </nav>
  );
}

export default NavbarLanding;