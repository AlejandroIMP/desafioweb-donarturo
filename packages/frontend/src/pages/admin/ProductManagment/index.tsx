import AdminLayout from '@/layouts/AdminLayout';
import { IProduct } from '@/interfaces/product.interface';
import { getProducts, updateProductState } from '@/services/products.service';
import { formattedState, formattedDate } from '@/utils/orderUtils';
import ProductCreateForm from '@/components/ProductCreateForm';
import ProductUpdateForm from '@/components/ProductUpdateForm';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './index.css'

const ProductManagment = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openModalAddP, setopenModalAddP] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>({
    idProductos: 0,
    nombre: '',
    precio: 0,
    stock: 0,
    estados_idestados: 0,
    CategoriaProductos_idCategoriaProductos: 0,
    usuarios_idusuarios: 0,
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

  

  const handleOpenModalEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setSelectedProduct({
      idProductos: 0,
      nombre: '',
      precio: 0,
      stock: 0,
      estados_idestados: 0,
      CategoriaProductos_idCategoriaProductos: 0,
      usuarios_idusuarios: 0,
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

  const isProductActive = (product: IProduct) => product.estados_idestados === 1;

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
          <table className="product-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Category</th>
                <th>User</th>
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
                  <td data-label="Estado">
                    <span className={`product-status ${product.estados_idestados === 1 ? 'status-active' : 'status-inactive'}`}>
                      {formattedState(product.estados_idestados)}
                    </span>
                  </td>
                  <td data-label="Categoría">{product.CategoriaProductos_idCategoriaProductos}</td>
                  <td data-label="Usuario">{product.usuarios_idusuarios}</td>
                  <td data-label="Fecha">{formattedDate(product.fecha_creacion)}</td>
                  <td className="product-actions">
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => 
                        handleOpenModalEdit(product)
                      }
                    >
                      Editar
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
