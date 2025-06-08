import AdminLayout from '@/layouts/AdminLayout';
import { DataProduct } from '@/interfaces/product.interface';
import { getProducts } from '@/services/products.service';

import ProductCreateForm from '@/components/ProductCreateForm';
import ProductUpdateForm from '@/components/ProductUpdateForm';
import ProductCreateFormWithImage from '@/components/ProductCreateFormWithImage';
import ProductUpdateFormWithImage from '@/components/ProductUpdateFormWithImage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, IconButton, Button, Menu, MenuItem, Alert, Box, CircularProgress, Typography, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './index.css'
import TableProductsManagment from '@/components/TableProductsManagment';

const ProductManagment = () => {
  const [products, setProducts] = useState<DataProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    type: 'success'
  });
  const [openModalAddP, setopenModalAddP] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [useImageUpload, setUseImageUpload] = useState(false);
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const [editMenuAnchor, setEditMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<DataProduct>({
    product_id: 0,
    product_name: '',
    unit_price: 0,
    stock_quantity: 0,
    state: {
      state_name: '',
      state_id: 0
    },
    category: {
      category_name: '',
      category_id: 0,
    },
    user: {
      full_name: '',
      user_id: 0
    },
    created_at: '',
    image_url: '',
    brand: '',
    product_code: ''
  });

  // Extraemos la función fetchProducts para poder llamarla después cuando se necesite refrescar
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModalEdit = useCallback((product: DataProduct) => {
    setSelectedProduct(product);
    setOpenModalEdit(true);
  }, []);

  // Usar useMemo para mantener un objeto de producto vacío constante
  const emptyProduct = useMemo(() => ({
    product_id: 0,
    product_name: '',
    unit_price: 0,
    stock_quantity: 0,
    state: {
      state_name: '',
      state_id: 0
    },
    category: {
      category_name: '',
      category_id: 0,
    },
    user: {
      full_name: '',
      user_id: 0
    },
    created_at: '',
    image_url: '',
    brand: '',
    product_code: ''
  }), []);

  const handleCloseModalEdit = useCallback(() => {
    setSelectedProduct(emptyProduct);
    setOpenModalEdit(false);
    setEditMenuAnchor(null);
    setUseImageUpload(false);
  }, [emptyProduct]);

  const handleopenModalAddP = useCallback(() => {
    setopenModalAddP(true);
  }, []);

  const handleCloseModalAdd = useCallback(() => {
    setopenModalAddP(false);
    setAddMenuAnchor(null);
    setUseImageUpload(false);
  }, []);

  // Add menu handlers - optimizados con useCallback
  const handleAddMenuClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAddMenuAnchor(event.currentTarget);
  }, []);

  const handleAddMenuClose = useCallback(() => {
    setAddMenuAnchor(null);
  }, []);

  const handleAddWithoutImage = useCallback(() => {
    setUseImageUpload(false);
    setAddMenuAnchor(null);
    handleopenModalAddP();
  }, [setUseImageUpload, setAddMenuAnchor, handleopenModalAddP]);

  const handleAddWithImage = useCallback(() => {
    setUseImageUpload(true);
    setAddMenuAnchor(null);
    handleopenModalAddP();
  }, [setUseImageUpload, setAddMenuAnchor, handleopenModalAddP]);

  // Edit menu handlers
  const handleEditMenuClick = useCallback((event: React.MouseEvent<HTMLElement>, product: DataProduct) => {
    event.stopPropagation();
    setSelectedProduct(product);
    setEditMenuAnchor(event.currentTarget);
  }, [setSelectedProduct, setEditMenuAnchor]);

  const handleEditMenuClose = useCallback(() => {
    setEditMenuAnchor(null);
  }, [setEditMenuAnchor]);

  const handleEditWithoutImage = useCallback(() => {
    setUseImageUpload(false);
    setEditMenuAnchor(null);
    setOpenModalEdit(true);
  }, [setUseImageUpload, setEditMenuAnchor, setOpenModalEdit]);

  const handleEditWithImage = useCallback(() => {
    setUseImageUpload(true);
    setEditMenuAnchor(null);
    setOpenModalEdit(true);
  }, [setUseImageUpload, setEditMenuAnchor, setOpenModalEdit]);

  // Manejadores para notificaciones
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({
      open: true,
      message,
      type
    });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // Callbacks para acciones exitosas desde componentes hijos
  const handleProductCreated = useCallback(async () => {
    showNotification('Producto creado exitosamente');
    await fetchProducts();
  }, [fetchProducts, showNotification]);

  const handleProductUpdated = useCallback(async () => {
    showNotification('Producto actualizado exitosamente');
    await fetchProducts();
  }, [fetchProducts, showNotification]);
  
  return (
    <AdminLayout>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          variant="filled"
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
          }}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      <div className="management-container">
        <div className="management-header">
          <h1 className="management-title">Manejo de productos</h1>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddMenuClick}
              endIcon={<ArrowDropDownIcon />}
              aria-controls={Boolean(addMenuAnchor) ? 'add-product-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(addMenuAnchor) ? 'true' : undefined}
            >
              Añadir Producto
            </Button>
            <Menu
              id="add-product-menu"
              anchorEl={addMenuAnchor}
              open={Boolean(addMenuAnchor)}
              onClose={handleAddMenuClose}
              MenuListProps={{
                'aria-labelledby': 'add-product-button',
                role: 'menu'
              }}
            >
              <MenuItem 
                onClick={handleAddWithoutImage}
                role="menuitem"
                tabIndex={0}
                aria-label="Crear producto básico"
              >
                Producto básico
              </MenuItem>
              <MenuItem 
                onClick={handleAddWithImage}
                role="menuitem"
                tabIndex={0}
                aria-label="Crear producto con imagen"
              >
                Producto con imagen
              </MenuItem>
            </Menu>
          </div>
        </div>

        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            padding: 4 
          }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando productos...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={fetchProducts}
                aria-label="Reintentar cargar productos"
              >
                Reintentar
              </Button>
            }
          >
            Error al cargar los productos. Por favor intente nuevamente.
          </Alert>
        ) : (
          <TableProductsManagment 
            products={products} 
            handleOpenModalEdit={handleOpenModalEdit}
            handleEditMenuClick={handleEditMenuClick}
            refreshProducts={fetchProducts}
          />
        )}

        {/* Edit Menu */}
        <Menu
          id="edit-product-menu"
          anchorEl={editMenuAnchor}
          open={Boolean(editMenuAnchor)}
          onClose={handleEditMenuClose}
          MenuListProps={{
            'aria-labelledby': 'edit-product-button',
            role: 'menu'
          }}
        >
          <MenuItem 
            onClick={handleEditWithoutImage}
            role="menuitem"
            tabIndex={0}
            aria-label="Editar producto sin cambiar imagen"
          >
            Editar sin imagen
          </MenuItem>
          <MenuItem 
            onClick={handleEditWithImage}
            role="menuitem"
            tabIndex={0}
            aria-label="Editar producto incluyendo la imagen"
          >
            Editar con imagen
          </MenuItem>
        </Menu>
        <Dialog
          open={openModalEdit}
          onClose={handleCloseModalEdit}
          maxWidth="md"
          fullWidth
          aria-labelledby="edit-product-dialog-title"
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px'
          }}>
            <Typography id="edit-product-dialog-title" variant="h6" component="h2">
              Editar Producto
            </Typography>
            <IconButton
              onClick={handleCloseModalEdit}
              size="small"
              aria-label="Cerrar diálogo de edición"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            {useImageUpload ? (
              <ProductUpdateFormWithImage 
                product={selectedProduct} 
                onProductUpdated={handleProductUpdated} 
              />
            ) : (
              <ProductUpdateForm 
                product={selectedProduct} 
                onProductUpdated={handleProductUpdated} 
              />
            )}
          </div>
        </Dialog>
        <Dialog
          open={openModalAddP}
          onClose={handleCloseModalAdd}
          maxWidth="md"
          fullWidth
          aria-labelledby="add-product-dialog-title"
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px'
          }}>
            <Typography id="add-product-dialog-title" variant="h6" component="h2">
              Añadir Nuevo Producto
            </Typography>
            <IconButton
              onClick={handleCloseModalAdd}
              size="small"
              aria-label="Cerrar diálogo de creación"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            {useImageUpload ? (
              <ProductCreateFormWithImage onProductCreated={handleProductCreated} />
            ) : (
              <ProductCreateForm onProductCreated={handleProductCreated} />
            )}
          </div>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ProductManagment;
