import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, Typography, Box, TablePagination
} from '@mui/material';
import { DataProduct } from '@/interfaces/product.interface';
import { formattedDate } from '@/utils/orderUtils';
import { updateProductState } from '@/services/products.service';
import LabelState from '../LabelState';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

interface TableProductsProps {
  products: DataProduct[];
  handleOpenModalEdit: (product: DataProduct) => void;
}
const TableProductsManagment = ({ products, handleOpenModalEdit }: TableProductsProps) => {
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
  const paginatedProducts = products.slice(startIndex, endIndex);

  const desactivarProducto = async (id: number) => {
    try {
      await updateProductState(id, 2);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const activarProducto = async (id: number) => {
    try {
      await updateProductState(id, 1);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }
  const isProductActive = (product: DataProduct) => product.estado.idestados === 1;



  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Box>
        {products.map((product, index) => (
          <Box key={index} p={2} border={1} borderColor='grey.300' borderRadius={1} mb={2}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
            >
              <Typography variant="h6">ID: {product.idProductos}</Typography>
              <Typography variant="h6">{product.nombre}</Typography>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
            >
              <Typography variant="body1">Precio: Q{product.precio}</Typography>
              <Typography variant="body1">Stock: {product.stock}</Typography>
              <LabelState estados={product.estado.idestados} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Creado:</span> <span>{formattedDate(product.fecha_creacion)}</span>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Marca:</span> <span>{product.marca}</span> </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Codigo:</span> <span>{product.codigo}</span> </Typography>

              <img src={product.foto} alt={product.nombre} width="100" height="100" />
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
                  handleOpenModalEdit(product)
                }
              >
                <EditIcon />
              </Button>
              <Button
                variant="text"
                color="success"
                disabled={isProductActive(product)}
                onClick={() => activarProducto(product.idProductos)}
              >
                Activar
              </Button>
              <Button
                variant="text"
                color="error"
                disabled={!isProductActive(product)}
                onClick={() => desactivarProducto(product.idProductos)}
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
              <TableCell>Usuario</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.idProductos}</TableCell>
                <TableCell>{product.usuario.nombre_completo}</TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.categoria.nombre}</TableCell>
                <TableCell>Q{product.precio}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <LabelState estados={product.estado.idestados} />
                </TableCell>

                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() =>
                      handleOpenModalEdit(product)
                    }
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="text"
                    color="success"
                    disabled={isProductActive(product)}
                    onClick={() => activarProducto(product.idProductos)}
                  >
                    Activar
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    disabled={!isProductActive(product)}
                    onClick={() => desactivarProducto(product.idProductos)}
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
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableProductsManagment;