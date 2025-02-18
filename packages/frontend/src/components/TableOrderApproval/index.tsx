import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, Typography, Box, TablePagination
} from '@mui/material';
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { formattedDate } from '@/utils/orderUtils';
import { updateOrderState } from '@/services/orders.service';
import LabelState from '../LabelState';
import { useState } from 'react';

interface TableOrdersApprovalProps {
  orders: IOrder[];
}
const TableOrdersApproval = ({ orders }: TableOrdersApprovalProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const acceptOrder = (orderId: number) => {
    updateOrderState(orderId, 7);
    location.reload();
  }

  const rejectOrder = (orderId: number) => {
    updateOrderState(orderId, 6);
    location.reload();
  }

  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Box>
        {orders.map((order, index) => (
          <Box key={index} p={2} border={1} borderColor='grey.300' borderRadius={1} mb={2}>
            <Typography variant='h5'>Pedido: {order.idOrden}</Typography>
            <Typography variant='h6'>Nombre: {order.nombre_completo}</Typography>
            <Typography variant='h6'>Fecha de entrega: {formattedDate(order.fecha_entrega)}</Typography>
            <Typography variant='h6'>Estado: <LabelState estados={order.estados_idestados} /></Typography>
            <Typography variant='h6'>Total: Q {order.total_orden}</Typography>
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
              variant='contained'
              color='success'
              onClick={() => acceptOrder(order.idOrden)}>Aprobar</Button>
            <Button
              variant='contained'
              color='error'
              onClick={() => rejectOrder(order.idOrden)}>Rechazar</Button>
            </div>
          </Box>
        ))}
      </Box>
    )
  }

  const paginatedOrders = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha de entrega</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.idOrden}</TableCell>
                <TableCell>{order.nombre_completo}</TableCell>
                <TableCell>{formattedDate(order.fecha_entrega)}</TableCell>
                <TableCell>
                  <LabelState estados={order.estados_idestados} />
                </TableCell>
                <TableCell>Q {order.total_orden}</TableCell>
                <TableCell>
                  <Button
                    variant='text'
                    color='success'
                    onClick={() => acceptOrder(order.idOrden)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant='text'
                    color='error'
                    onClick={() => rejectOrder(order.idOrden)}
                  >
                    Rechazar
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
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableOrdersApproval;