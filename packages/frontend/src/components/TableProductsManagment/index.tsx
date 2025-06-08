import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, 
  Typography, Box, TablePagination, Snackbar, Alert
} from '@mui/material';
import { DataProduct } from '@/interfaces/product.interface';
import { formattedDate } from '@/utils/orderUtils';
import { updateProductState } from '@/services/products.service';
import LabelState from '../LabelState';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useCallback, memo } from 'react';

interface TableProductsProps {
  products: DataProduct[];
  handleOpenModalEdit: (product: DataProduct) => void;
  handleEditMenuClick?: (event: React.MouseEvent<HTMLElement>, product: DataProduct) => void;
  refreshProducts?: () => Promise<void>;
}
const TableProductsManagment = ({ products, handleOpenModalEdit, handleEditMenuClick, refreshProducts }: TableProductsProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alertInfo, setAlertInfo] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });

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

  const desactivarProducto = useCallback(async (id: number) => {
    try {
      await updateProductState(id, 2);
      // Mejorar UX: mostrar feedback con Snackbar y actualizar datos sin recargar página
      setAlertInfo({
        open: true,
        message: 'Producto desactivado con éxito',
        severity: 'success'
      });
      if (refreshProducts) {
        await refreshProducts();
      }
    } catch (error) {
      console.error('Error al desactivar producto:', error);
      setAlertInfo({
        open: true,
        message: error instanceof Error ? error.message : 'Error al desactivar producto',
        severity: 'error'
      });
    }
  }, [refreshProducts]);

  const activarProducto = useCallback(async (id: number) => {
    try {
      await updateProductState(id, 1);
      // Mejorar UX: mostrar feedback con Snackbar y actualizar datos sin recargar página
      setAlertInfo({
        open: true,
        message: 'Producto activado con éxito',
        severity: 'success'
      });
      if (refreshProducts) {
        await refreshProducts();
      }
    } catch (error) {
      console.error('Error al activar producto:', error);
      setAlertInfo({
        open: true,
        message: error instanceof Error ? error.message : 'Error al activar producto',
        severity: 'error'
      });
    }
  }, [refreshProducts]);

  // Utilizamos memo para evitar recálculos innecesarios
  const isProductActive = useCallback((product: DataProduct) => 
    product.state.state_id === 1
  , []);
  
  // Manejador para cerrar la alerta
  const handleCloseAlert = useCallback(() => {
    setAlertInfo(prev => ({ ...prev, open: false }));
  }, []);



  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Box>
        {/* Snackbar para mostrar mensajes al usuario en vista móvil */}
        <Snackbar 
          open={alertInfo.open} 
          autoHideDuration={4000} 
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity={alertInfo.severity}
            variant="filled" 
            sx={{ width: '100%' }}
          >
            {alertInfo.message}
          </Alert>
        </Snackbar>
        {products.map((product, index) => (
          <Box key={index} p={2} border={1} borderColor='grey.300' borderRadius={1} mb={2}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
            >
              <Typography variant="h6">ID: {product.product_id}</Typography>
              <Typography variant="h6">{product.product_name}</Typography>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
            >
              <Typography variant="body1">Precio: Q{product.unit_price}</Typography>
              <Typography variant="body1">Stock: {product.stock_quantity}</Typography>
              <LabelState estados={product.state.state_id} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Creado:</span> <span>{formattedDate(product.created_at)}</span>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Marca:</span> <span>{product.brand}</span> </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Codigo:</span> <span>{product.product_code}</span> </Typography>

              <img src={product.image_url} alt={product.product_name} width="100" height="100" />
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
                onClick={(e) => {
                  e.stopPropagation();
                  if (handleEditMenuClick) {
                    handleEditMenuClick(e, product);
                  } else {
                    handleOpenModalEdit(product);
                  }
                }}
                aria-label={`Editar producto ${product.product_name}`}
                tabIndex={0}
              >
                <EditIcon />
              </Button>
              <Button
                variant="text"
                color="success"
                disabled={isProductActive(product)}
                onClick={() => activarProducto(product.product_id)}
                aria-label={`Activar producto ${product.product_name}`}
                tabIndex={0}
              >
                Activar
              </Button>
              <Button
                variant="text"
                color="error"
                disabled={!isProductActive(product)}
                onClick={() => desactivarProducto(product.product_id)}
                aria-label={`Desactivar producto ${product.product_name}`}
                tabIndex={0}
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
      {/* Snackbar para mostrar mensajes al usuario */}
      <Snackbar 
        open={alertInfo.open} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertInfo.severity}
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
      
      <TableContainer>
        <Table aria-label="Tabla de productos" role="grid">
          <TableHead>
            <TableRow>
              <TableCell scope="col">ID</TableCell>
              <TableCell scope="col">Usuario</TableCell>
              <TableCell scope="col">Producto</TableCell>
              <TableCell scope="col">Categoria</TableCell>
              <TableCell scope="col">Precio</TableCell>
              <TableCell scope="col">Stock</TableCell>
              <TableCell scope="col">Estado</TableCell>
              <TableCell scope="col">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product, index) => (
              <TableRow 
                key={index} 
                hover 
                tabIndex={0}
                aria-label={`Producto: ${product.product_name}`}
                role="row"
              >
                <TableCell role="cell">{product.product_id}</TableCell>
                <TableCell role="cell">{product.user.full_name}</TableCell>
                <TableCell role="cell">{product.product_name}</TableCell>
                <TableCell role="cell">{product.category.category_name}</TableCell>
                <TableCell role="cell">Q{product.unit_price}</TableCell>
                <TableCell role="cell">{product.stock_quantity}</TableCell>
                <TableCell role="cell">
                  <LabelState estados={product.state.state_id} />
                </TableCell>

                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (handleEditMenuClick) {
                        handleEditMenuClick(e, product);
                      } else {
                        handleOpenModalEdit(product);
                      }
                    }}
                    aria-label={`Editar producto ${product.product_name}`}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="text"
                    color="success"
                    disabled={isProductActive(product)}
                    onClick={() => activarProducto(product.product_id)}
                    aria-label={`Activar producto ${product.product_name}`}
                  >
                    Activar
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    disabled={!isProductActive(product)}
                    onClick={() => desactivarProducto(product.product_id)}
                    aria-label={`Desactivar producto ${product.product_name}`}
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
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        getItemAriaLabel={(type) => {
          return type === 'first' ? 'Ir a la primera página' :
                 type === 'last' ? 'Ir a la última página' :
                 type === 'next' ? 'Ir a la página siguiente' :
                 'Ir a la página anterior';
        }}
      />
    </Paper>
  );
};

// Exportamos un componente memoizado para evitar rerenderizados innecesarios
export default memo(TableProductsManagment);