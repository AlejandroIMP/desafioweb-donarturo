import AdminLayout from '@/layouts/AdminLayout';
import { DataProduct } from '@/interfaces/product.interface';
import { getProducts, updateProductState } from '@/services/products.service';
import LabelState from '@/components/LabelState';
import { formattedDate } from '@/utils/orderUtils';
import ProductCreateForm from '@/components/ProductCreateForm';
import ProductUpdateForm from '@/components/ProductUpdateForm';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import './index.css'

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

  const desactivarProducto = async(id: number) => {
    try{
      await updateProductState(id, 2);
      location.reload();
    } catch (error)
    {
      console.log(error);
    }
  };

  const activarProducto = async(id: number) => {
    try{
      await updateProductState(id, 1);
      location.reload();
    } catch (error)
    {
      console.log(error);
    }
  }

  const isProductActive = (product: DataProduct) => product.estado.idestados === 1;

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
          <table className="management-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Categoria</th>
                <th>Usuario</th>
                <th>Fecha Creacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
              products.map((product) => (
                <tr key={product.idProductos}>
                  <td data-label="Id">{product.idProductos}</td>
                  <td data-label="Nombre">{product.nombre}</td>
                  <td data-label="Precio">{product.precio}</td>
                  <td data-label="Stock">{product.stock}</td>
                  <LabelState estados={product.estado.idestados} />
                  <td data-label="Categoría">{product.categoria.nombre}</td>
                  <td data-label="Usuario">{product.usuario.nombre_completo}</td>
                  <td data-label="Fecha">{formattedDate(product.fecha_creacion)}</td>
                  <td className="product-actions">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
