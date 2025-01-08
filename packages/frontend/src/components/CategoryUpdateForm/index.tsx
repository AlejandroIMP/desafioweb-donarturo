import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { updateCategory } from '@/services/categories.service';
import { categoryUpdateSchema, CategoryUpdateFormSchema } from '@/schemas/categories.schemas';
import { ICategory } from '@/interfaces/productcategory.interface';

interface CategoryUpdateFormProps {
  category: ICategory;
  onClose: () => void;
}

const CategoryUpdateForm = ({ category, onClose }: CategoryUpdateFormProps) => {
  const [valueState, setValueState] = useState(category.estados_idestados);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryUpdateFormSchema>({
    resolver: zodResolver(categoryUpdateSchema),
    mode: 'onChange',
    defaultValues: {
      usuarios_idusuarios: category.usuarios_idusuarios,
      nombre: category.nombre,
      estados_idestados: category.estados_idestados
    }
  });

  const onSubmit = async (data: CategoryUpdateFormSchema) => {
    try {
      const formattedData = {
        ...data,
        estados_idestados: Number(data.estados_idestados)
      };
      
      await updateCategory(category.idCategoriaProductos, formattedData);
      onClose();
      location.reload();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Usuario ID"
        type="number"
        fullWidth
        disabled
        defaultValue={category.usuarios_idusuarios}
      />
      <TextField
        {...register('nombre')}
        label="Nombre Categoría"
        fullWidth
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
      />
      <Select
        {...register('estados_idestados')}
        label="Estado"
        fullWidth
        error={!!errors.estados_idestados}
        value={valueState}
        onChange={(e) => setValueState(Number(e.target.value))}
      >
        <MenuItem value={"1"}>Activo</MenuItem>
        <MenuItem value={"2"}>Inactivo</MenuItem>
      </Select>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
      >
        Actualizar Categoría
      </Button>
    </form>
  );
};

export default CategoryUpdateForm;