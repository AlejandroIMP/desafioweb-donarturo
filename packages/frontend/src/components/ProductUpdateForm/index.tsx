import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Select, MenuItem } from '@mui/material';
import { createProductSchema, CreateProductForm } from '@/schemas/product.schemas';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { updateProduct } from '@/services/products.service';
import { getCategories } from '@/services/categories.service';
import { useState, useEffect } from 'react';
import { DataProduct } from '@/interfaces/product.interface';

interface ProductUpdateFormProps {
  product: DataProduct;
}

const ProductUpdateForm = ({ product }: ProductUpdateFormProps) => {
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [valueState, setValueState] = useState(product.estado.idestados.toString());
  const [valueCategory, setValueCategory] = useState(product.categoria.idCategoriaProductos);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
    mode: 'onChange',
    defaultValues: {
      CategoriaProductos_idCategoriaProductos: product.categoria.idCategoriaProductos,
      estados_idestados: product.estado.idestados.toString()
    }
  });

  const onSubmit = async (data: CreateProductForm) => {

    Number(data.CategoriaProductos_idCategoriaProductos);
    Number(data.estados_idestados);
    Number(data.stock);
    Number(data.precio);
    Number(data.usuarios_idusuarios);

    try {
      await updateProduct(product.idProductos,data);
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
        defaultValue={product.usuario.idusuarios}
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
        defaultValue={product.nombre}
      />
      <TextField
        label="Marca"
        variant="outlined"
        {...register('marca')}
        error={!!errors.marca}
        helperText={errors.marca?.message}
        fullWidth
        defaultValue={product.marca}
      />
      <TextField
        label="Código"
        variant="outlined"
        {...register('codigo')}
        error={!!errors.codigo}
        helperText={errors.codigo?.message}
        fullWidth
        defaultValue={product.codigo}
      />
      <TextField
        label="Stock"
        variant="outlined"
        type="number"
        {...register('stock')}
        error={!!errors.stock}
        helperText={errors.stock?.message}
        fullWidth
        defaultValue={product.stock}
      />
      <TextField
        label="Precio"
        variant="outlined"
        type="number"
        {...register('precio')}
        error={!!errors.precio}
        helperText={errors.precio?.message}
        fullWidth
        defaultValue={product.precio}
      />
      <Select
        label='Categoría'
        variant="outlined"
        {...register('CategoriaProductos_idCategoriaProductos')}
        error={!!errors.CategoriaProductos_idCategoriaProductos}
        fullWidth
        displayEmpty={true}
        defaultValue={valueCategory}
        onChange={(e) => setValueCategory(Number(e.target.value))}
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
        defaultValue={product.foto}
      />
      <Button
        type='submit'
        variant='contained'
        fullWidth
      >
        Actualizar Producto
      </Button>
    </form>
  );
}

export default ProductUpdateForm;