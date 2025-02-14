import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, Typography, Box, TablePagination
} from '@mui/material';
import { IClient } from '@/interfaces/clients.interface';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

interface TableClientsProps {
  clients: IClient[];
  handleOpenModalEdit: (client: IClient) => void;
}
const TableClientsManagment = ({ clients, handleOpenModalEdit }: TableClientsProps) => {
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
  const paginatedClients = clients.slice(startIndex, endIndex);

  const isMobile = useMediaQuery('(max-width: 1024px)');

  if (isMobile) {
    return (
      <Box width={'100%'} display='grid' gridTemplateColumns='repeat(auto-fill, minmax(300px, 1fr))' gap={2}>
        {clients.map((client, index) => (
          <Box key={index} p={2} border={1} borderColor='grey.300' borderRadius={1} mb={2} minWidth={300}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
            >
              
              <Typography variant="h6">
                {`Cliente #${client.idClientes}`}
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>
                  Razon Social:
                </span> 
                <span>
                  {client.razon_social}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>
                  Nombre Comercial:
                </span>
                <span>
                  {client.nombre_comercial}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>
                  Direccion de entrega:
                </span>
                <span>
                  {client.direccion_entrega}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>
                  Telefono:
                </span>
                <span>
                  {client.telefono}
                </span>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>
                  Correo:
                </span>
                <span>
                  {client.email}
                </span>
              </Typography>
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
                  handleOpenModalEdit(client)
                }
              >
                <EditIcon />
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
              <TableCell>Id</TableCell>
              <TableCell>Razon Social</TableCell>
              <TableCell>Nombre Comercial</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Direccion de entrega</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClients.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.idClientes}</TableCell>
                <TableCell>{order.razon_social}</TableCell>
                <TableCell>{order.nombre_comercial}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.telefono}</TableCell>
                <TableCell>{order.direccion_entrega}</TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() =>
                      handleOpenModalEdit(order)
                    }
                  >
                    <EditIcon />
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
        count={clients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableClientsManagment;