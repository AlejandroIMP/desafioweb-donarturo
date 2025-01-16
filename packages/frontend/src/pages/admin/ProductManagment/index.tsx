import AdminLayout from '@/layouts/AdminLayout';
import { DataProduct } from '@/interfaces/product.interface';
import { getProducts } from '@/services/products.service';

import ProductCreateForm from '@/components/ProductCreateForm';
import ProductUpdateForm from '@/components/ProductUpdateForm';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './index.css'
import TableProductsManagment from '@/components/TableProductsManagment';

const ProductManagment = () => {
  const [products, setProducts] = useState<DataProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openModalAddP, setopenModalAddP] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DataProduct>({
    idProductos: 0,
    nombre: '',
    precio: 0,
    stock: 0,
    estado:{
      nombre: '',
      idestados: 0
    },
    categoria: {
      nombre: '',
      idCategoriaProductos: 0,
    },
    usuario: {
      nombre_completo: '',
      idusuarios: 0
    },
    fecha_creacion: '',
    foto: '',
    marca: '',
    codigo: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  

  const handleOpenModalEdit = (product: DataProduct) => {
    setSelectedProduct(product);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setSelectedProduct({
      idProductos: 0,
      nombre: '',
      precio: 0,
      stock: 0,
      estado:{
        nombre: '',
        idestados: 0
      },
      categoria: {
        nombre: '',
        idCategoriaProductos: 0,
      },
      usuario: {
        nombre_completo: '',
        idusuarios: 0
      },
      fecha_creacion: '',
      foto: '',
      marca: '',
      codigo: ''
    });
    setOpenModalEdit(false);
  };

  const handleopenModalAddP = () => {
    setopenModalAddP(true);
  };

  const handleCloseModalAdd = () => {
    setopenModalAddP(false);
  };


  
  return (
    <AdminLayout>
      <div className="management-container">
        <div className="management-header">
          <h1 className="management-title">Manejo de productos</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={handleopenModalAddP}
          >
            Añadir Producto
          </Button>
        </div>

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : error ? (
          <div className="error-state">Error loading products</div>
        ) : (
        <TableProductsManagment products={products} handleOpenModalEdit={handleOpenModalEdit}/>
        )}
        <Dialog
          open={openModalEdit}
          onClose={handleCloseModalEdit}
          maxWidth="md"
          fullWidth
        >
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px'
          }}>
            <IconButton
              onClick={handleCloseModalEdit}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            <ProductUpdateForm product={selectedProduct} /> 
          </div>
        </Dialog>
        <Dialog
          open={openModalAddP}
          onClose={handleCloseModalAdd}
          maxWidth="md"
          fullWidth
        >
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px'
          }}>
            <IconButton
              onClick={handleCloseModalAdd}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            <ProductCreateForm />
          </div>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ProductManagment;
