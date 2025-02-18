import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Select, MenuItem } from '@mui/material';
import { createProductSchema, CreateProductForm } from '@/schemas/product.schemas';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { createProduct } from '@/services/products.service';
import { getCategories } from '@/services/categories.service';
import { useState, useEffect } from 'react';

const ProductCreateForm = () => {
  const [categories, setCategories] = useState<IProductCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const formattedCategories = categories.map((category) => (
    <MenuItem key={category.idCategoriaProductos} value={category.idCategoriaProductos}>
      {category.nombre}
    </MenuItem>
  ));

  const idUsuario = localStorage.getItem('idusuario');

  const [valueState, setValueState] = useState('');

  const [valueCategory, setValueCategory] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
    mode: 'onChange',
    defaultValues: {

      CategoriaProductos_idCategoriaProductos: 1,
      estados_idestados: '',
      nombre: '',
      marca: '',
      codigo: '',
      stock: '',
      precio: '',
      foto: '',
    }
  });

  const onSubmit = async (data: CreateProductForm) => {


    Number(data.CategoriaProductos_idCategoriaProductos);
    Number(data.estados_idestados);
    Number(data.stock);
    Number(data.precio);
    Number(data.usuarios_idusuarios);

    try {

      await createProduct(data);
      reset();
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Usuario"
        variant="outlined"
        {...register('usuarios_idusuarios')}
        error={!!errors.usuarios_idusuarios}
        helperText={errors.usuarios_idusuarios?.message}
        defaultValue={idUsuario}
        disabled={true}
        fullWidth
      />
      <TextField
        label="Nombre"
        variant="outlined"
        {...register('nombre')}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
        fullWidth
      />
      <TextField
        label="Marca"
        variant="outlined"
        {...register('marca')}
        error={!!errors.marca}
        helperText={errors.marca?.message}
        fullWidth
      />
      <TextField
        label="Código"
        variant="outlined"
        {...register('codigo')}
        error={!!errors.codigo}
        helperText={errors.codigo?.message}
        fullWidth
      />
      <TextField
        label="Stock"
        variant="outlined"
        type="number"
        {...register('stock')}
        error={!!errors.stock}
        helperText={errors.stock?.message}
        fullWidth
      />
      <TextField
        label="Precio"
        variant="outlined"
        type="number"
        {...register('precio')}
        error={!!errors.precio}
        helperText={errors.precio?.message}
        fullWidth
      />
      <Select
        label='Categoría'
        variant="outlined"
        {...register('CategoriaProductos_idCategoriaProductos')}
        error={!!errors.CategoriaProductos_idCategoriaProductos}
        fullWidth
        displayEmpty={true}
        defaultValue={valueCategory}
        onChange={(e) => setValueCategory(e.target.value)}
      >
        {formattedCategories}
      </Select>
      <Select
        label='Estado'
        variant="outlined"
        {...register('estados_idestados')}
        error={!!errors.estados_idestados}
        fullWidth
        displayEmpty={true}
        defaultValue={valueState}
        onChange={(e) => setValueState(e.target.value)}
      >
        <MenuItem value={'1'}>Activo</MenuItem>
        <MenuItem value={'2'}>Inactivo</MenuItem>
      </Select>
      <TextField
        label="Foto"
        variant="outlined"
        {...register('foto')}
        error={!!errors.foto}
        helperText={errors.foto?.message}
        fullWidth
      />
      <Button
        type='submit'
        variant='contained'
      >
        Crear Producto
      </Button>
    </form>
  );
}

export default ProductCreateForm;