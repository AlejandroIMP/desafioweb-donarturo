import AdminLayout from '@/layouts/AdminLayout';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { getCategories } from '@/services/categories.service';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CategoryUpdateForm from '@/components/CategoryUpdateForm';
import CategoryCreateForm from '@/components/CategoryCreateForm';
import TableCategoriesManagment from '@/components/TableCategoriesManagment';

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
        throw error;
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
            <TableCategoriesManagment
              categories={categories}
              handleOpenModalEdit={handleOpenModalEdit}
            />
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