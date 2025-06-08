import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { createCategory } from '@/services/categories.service';
import { categoryCreateSchema, CategoryCreateFormSchema } from '@/schemas/categories.schemas';

const CategoryCreateForm = () => {
  const [valueState, setValueState] = useState(1);
  const usuarioID = localStorage.getItem('idusuario');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryCreateFormSchema>({
    resolver: zodResolver(categoryCreateSchema),
    mode: 'onChange',
    defaultValues: {
      user_id: Number(usuarioID),
      category_name: '',
      state_id: valueState
    }
  });

  const onSubmit = async (data: CategoryCreateFormSchema) => {
    try {
      const formattedData = {
        ...data,
        state_id: Number(data.state_id)
      };
      
      await createCategory(formattedData);

      location.reload();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Usuario ID"
        type="number"
        fullWidth
        disabled
        value={usuarioID}
        {...register('user_id')}
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
        Crear Categoría
      </Button>
    </form>
  );
};

export default CategoryCreateForm;