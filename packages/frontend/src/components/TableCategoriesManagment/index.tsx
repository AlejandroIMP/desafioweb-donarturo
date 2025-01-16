import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, useMediaQuery, Typography, Box, TablePagination
} from '@mui/material';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { formattedDate } from '@/utils/orderUtils';
import { updateCategoryState } from '@/services/categories.service';
import LabelState from '../LabelState';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

interface TableCategoriesProps {
  categories: IProductCategory[];
  handleOpenModalEdit: (categorie: IProductCategory) => void;
}
const TableProductsManagment = ({ categories, handleOpenModalEdit }: TableCategoriesProps) => {
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
  const paginatedCategories = categories.slice(startIndex, endIndex);

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


  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Box>
        {categories.map((category, index) => (
          <Box key={index} p={2} border={1} borderColor='grey.300' borderRadius={1} mb={2}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center'
              }}
            >
              <Typography variant="body1">{category.nombre}</Typography>
              <LabelState estados={category.estados_idestados} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Usuario:</span> <span>{category.usuarios_idusuarios}</span>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Fecha de creacion:</span> <span>{formattedDate(category.fecha_creacion)}</span>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Nombre:</span> <span>{category.nombre}</span>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Creacion:</span> <span>{formattedDate(category.fecha_creacion)}</span>
              </Typography>
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
                  handleOpenModalEdit(category)
                }
              >
                <EditIcon />
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
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de creacion</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category, index) => (
              <TableRow key={index}>
                <TableCell>{category.idCategoriaProductos}</TableCell>
                <TableCell>{category.usuarios_idusuarios}</TableCell>
                <TableCell>{category.nombre}</TableCell>
                <TableCell><LabelState estados={category.estados_idestados} /></TableCell>
                <TableCell>{formattedDate(category.fecha_creacion)}</TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() =>
                      handleOpenModalEdit(category)
                    }
                  >
                    <EditIcon />
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableProductsManagment;