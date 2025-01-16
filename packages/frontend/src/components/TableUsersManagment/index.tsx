import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, Typography, Box, TablePagination
} from '@mui/material';
import { IUser } from '@/interfaces/auth.interface';
import { formattedDate } from '@/utils/orderUtils';
import { updateUsersState } from '@/services/users.service';
import LabelState from '../LabelState';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

interface TableUserProps {
  users: IUser[];
  handleOpenModalEdit: (user: IUser) => void;
}
const TableProductsManagment = ({ users, handleOpenModalEdit }: TableUserProps ) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const desactivarUsuario = async (id: number) => {
    try {
      await updateUsersState(id, 2);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const activarUsuario = async (id: number) => {
    try {
      await updateUsersState(id, 1);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const isUserActive = (user: IUser) => {
    return user.estados_idestados === 1;
  }


  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Box>
        {users.map((user, index) => (
          <Box key={index} p={2} border={1} borderColor='grey.300' borderRadius={1} mb={2}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
            >
              <Typography variant="h6">ID: {user.idusuarios}</Typography>
              <Typography variant="h6">{user.nombre_completo}</Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">Correo: {user.correo_electronico}</Typography>
              <Typography variant="body1">Fecha de registro: {formattedDate(user.fecha_creacion)}</Typography>
              <Typography variant="body1">Estado: <LabelState estados={user.estados_idestados} /></Typography>
              <Typography variant="body1">Fecha de Nacimiento: {formattedDate(user.fecha_nacimiento)}</Typography>
            </div>
            <div
              style={
                {
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  marginTop: '10px'
                }
              }
            >
              <Button
                variant="text"
                color="primary"
                onClick={() =>
                  handleOpenModalEdit(user)
                }
              >
                <EditIcon />
              </Button>
              <Button
                variant="text"
                color="success"
                disabled={isUserActive(user)}
                onClick={() => activarUsuario(user.idusuarios)}
              >
                Activar
              </Button>
              <Button
                variant="text"
                color="error"
                disabled={!isUserActive(user)}
                onClick={() => desactivarUsuario(user.idusuarios)}
              >
                Desactivar
              </Button>
            </div>
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Fecha de registro</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Nacimiento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.idusuarios}</TableCell>
                <TableCell>{user.nombre_completo}</TableCell>
                <TableCell>{user.correo_electronico}</TableCell>
                <TableCell>{formattedDate(user.fecha_creacion)}</TableCell>
                <TableCell>
                  <LabelState estados={user.estados_idestados} />
                </TableCell>
                <TableCell>{formattedDate(user.fecha_nacimiento)}</TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() =>
                      handleOpenModalEdit(user)
                    }
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="text"
                    color="success"
                    disabled={isUserActive(user)}
                    onClick={() => activarUsuario(user.idusuarios)}
                  >
                    Activar
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    disabled={!isUserActive(user)}
                    onClick={() => desactivarUsuario(user.idusuarios)}
                  >
                    Desactivar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableProductsManagment;