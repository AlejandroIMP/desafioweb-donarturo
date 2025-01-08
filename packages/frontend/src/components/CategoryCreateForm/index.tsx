import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { createCategory } from '@/services/categories.service';
import { categoryUpdateSchema, CategoryUpdateFormSchema } from '@/schemas/categories.schemas';

const CategoryCreateForm = () => {
  const [valueState, setValueState] = useState(1);
  const usuarioID = localStorage.getItem('idusuario');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryUpdateFormSchema>({
    resolver: zodResolver(categoryUpdateSchema),
    mode: 'onChange',
    defaultValues: {
      usuarios_idusuarios: Number(usuarioID),
      nombre: '',
      estados_idestados: valueState
    }
  });

  const onSubmit = async (data: CategoryUpdateFormSchema) => {
    try {
      const formattedData = {
        ...data,
        estados_idestados: Number(data.estados_idestados)
      };
      
      await createCategory(formattedData);

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
        value={usuarioID}
        {...register('usuarios_idusuarios')}
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
        Crear Categoría
      </Button>
    </form>
  );
};

export default CategoryCreateForm;