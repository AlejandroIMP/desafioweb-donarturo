import AdminLayout from '@/layouts/AdminLayout';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { getCategories, updateCategoryState } from '@/services/categories.service';
import { formattedDate, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CategoryUpdateForm from '@/components/CategoryUpdateForm';
import CategoryCreateForm from '@/components/CategoryCreateForm';

const CategoryManagment = () => {
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IProductCategory>({
    idCategoriaProductos: 0,
    usuarios_idusuarios: 0,
    nombre: '',
    estados_idestados: 0,
    fecha_creacion: ''
  });
  
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

  const handleOpenModalEdit = (category: IProductCategory) => {
    setSelectedCategory(category);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setSelectedCategory({
      idCategoriaProductos: 0,
      usuarios_idusuarios: 0,
      nombre: '',
      estados_idestados: 0,
      fecha_creacion: ''
    });
    setOpenModalEdit(false);
  };

  const handleOpenModalAdd = () => {
    setOpenModalAdd(true);
  };

  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
  };

  const desactivarCategoria = async (id: number) => {
    try {
      await updateCategoryState(id, 2);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const activarCategoria = async (id: number) => {
    try {
      await updateCategoryState(id, 1);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const isCategoryActive = (category: IProductCategory) => {
    return category.estados_idestados === 1;
  }



  return (
    <AdminLayout>
      <div className='management-container'>
        <div className='management-header'>
          <h1 className="management-title">Manejo de categorias</h1>
          <Button
            variant='contained'
            color='primary'
            onClick={handleOpenModalAdd}
          >
            Agregar categoria
          </Button>
        </div>
        {
          loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error occurred</div>
          ) : (
            <div>
              <table className='management-table'>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Usuario</th>
                    <th>nombre</th>
                    <th>estado</th>
                    <th>fecha de creacion</th>
                    <th>Acciones</th>
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
                      <td>
                        <Button
                          variant='text'
                          color='primary'
                          onClick={() => handleOpenModalEdit(category)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="text"
                          color="success"
                          disabled={isCategoryActive(category)}
                          onClick={() => activarCategoria(category.idCategoriaProductos)}
                        >
                          Activar
                        </Button>
                        <Button
                          variant="text"
                          color="error"
                          disabled={!isCategoryActive(category)}
                          onClick={() => desactivarCategoria(category.idCategoriaProductos)}
                        >
                          Desactivar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
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
            <CategoryUpdateForm category={selectedCategory} onClose={handleCloseModalEdit}/>
          </div>
        </Dialog>
        <Dialog
          open={openModalAdd}
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
            <CategoryCreateForm />
          </div>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

export default CategoryManagment;