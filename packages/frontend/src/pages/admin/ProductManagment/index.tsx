import AdminLayout from '@/layouts/AdminLayout';
import { IProduct } from '@/interfaces/product.interface';
import { getProducts } from '@/services/products.service';
import { useState, useEffect } from 'react';

const ProductManagment = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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


  return (
    <AdminLayout>
      Products
      {
        loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>There was an error</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>estado</th>
                <th>Category</th>
                <th>Usuario</th>
                <th>Fecha de creacion</th>
                <th>foto</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.idProductos}>
                  <td>{product.nombre}</td>
                  <td>{product.precio}</td>
                  <td>{product.stock}</td>
                  <td>{product.estados_idestados}</td>
                  <td>{product.CategoriaProductos_idCategoriaProductos}</td>
                  <td>{product.usuarios_idusuarios}</td>
                  <td>{product.fecha_creacion}</td>
                  <td>{product.foto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </AdminLayout>
  );
};

export default ProductManagment;
