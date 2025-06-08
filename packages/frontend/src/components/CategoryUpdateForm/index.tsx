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
  const [valueState, setValueState] = useState(category.state_id);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryUpdateFormSchema>({
    resolver: zodResolver(categoryUpdateSchema),
    mode: 'onChange',
    defaultValues: {
      user_id: category.user_id,
      category_name: category.category_name,
      state_id: category.state_id
    }
  });

  const onSubmit = async (data: CategoryUpdateFormSchema) => {
    try {
      const formattedData = {
        ...data,
        state_id: Number(data.state_id)
      };
      
      await updateCategory(category.category_id, formattedData);
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
        defaultValue={category.user_id}
      />
      <TextField
        {...register('category_name')}
        label="Nombre Categoría"
        fullWidth
        error={!!errors.category_name}
        helperText={errors.category_name?.message}
      />
      <TextField
        {...register('category_description')}
        label="Descripción de Categoría (Opcional)"
        fullWidth
        error={!!errors.category_description}
        helperText={errors.category_description?.message}
        multiline
        rows={3}
      />
      <Select
        {...register('state_id')}
        label="Estado"
        fullWidth
        error={!!errors.state_id}
        value={valueState}
        onChange={(e) => setValueState(Number(e.target.value))}
      >
        <MenuItem value={1}>Activo</MenuItem>
        <MenuItem value={2}>Inactivo</MenuItem>
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