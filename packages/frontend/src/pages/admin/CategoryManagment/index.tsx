import AdminLayout from '@/layouts/AdminLayout';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { getCategories } from '@/services/categories.service';
import { formattedDate, formattedRole, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';


const CategoryManagment = () => {
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }
  , []);


  return (
    <AdminLayout>
      CategoryManagment
      {
        loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error occurred</div>
        ) : (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Usuario</th>
                  <th>nombre</th>
                  <th>estado</th>
                  <th>fecha de creacion</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.idCategoriaProductos}>
                    <td>{category.idCategoriaProductos}</td>
                    <td>{category.usuarios_idusuarios}</td>
                    <td>{category.nombre}</td>
                    <td>{formattedState(category.estados_idestados)}</td>
                    <td>{formattedDate(category.fecha_creacion)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </AdminLayout>
  );
}

export default CategoryManagment;