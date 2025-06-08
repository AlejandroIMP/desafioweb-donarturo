import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, Typography, Box, TablePagination
} from '@mui/material';
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { formattedDate } from '@/utils/orderUtils';
import LabelState from '../LabelState';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

interface TableOrdersProps {
  orders: IOrder[];
  handleOpenModalEdit: (product: IOrder) => void;
}
const TableProductsManagment = ({ orders, handleOpenModalEdit }: TableOrdersProps) => {
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
  const paginatedOrders = orders.slice(startIndex, endIndex);

  const isMobile = useMediaQuery('(max-width: 1024px)');

  if (isMobile) {
    return (
      <>
        <Box width={'100%'} display='grid' gridTemplateColumns='repeat(auto-fill, minmax(300px, 1fr))' gap={2}>
          {paginatedOrders.map((order, index) => (
            <Box key={index} p={2} border={1} borderColor='grey.300' borderRadius={1} mb={2} minWidth={300}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h6">
                  {`Orden #${order.order_id}`}
                </Typography>
                
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center'
                }}
              >
                <Typography variant="body1">
                  {`Usuario: ${order.user_id}`}
                </Typography>
                <Typography variant="body1">
                  {`Cliente: ${order.customer_name}`}
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
                    Creado:
                  </span> 
                  <span>
                    {formattedDate(order.created_at)}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>
                    Estado:
                  </span>
                  <span>
                    <LabelState estados={order.state_id} />
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>
                    Total:
                  </span>
                  <span>
                    Q{order.order_total}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>
                    Dirección:
                  </span>
                  <span>
                    {order.delivery_address}
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
                    handleOpenModalEdit(order)
                  }
                >
                  <EditIcon />
                </Button>
                
              </div>
            </Box>
          ))}
        </Box>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    )
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.user_id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.delivery_address}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{formattedDate(order.created_at)}</TableCell>
                <TableCell>
                  <LabelState estados={order.state_id} />
                </TableCell>
                <TableCell>Q{order.order_total}</TableCell>
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
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableProductsManagment;