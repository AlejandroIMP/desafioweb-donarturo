import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Select, MenuItem, Alert, CircularProgress } from '@mui/material';
import { createProductSchema, CreateProductForm } from '@/schemas/product.schemas';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { createProduct } from '@/services/products.service';
import { getCategories } from '@/services/categories.service';
import { useState, useEffect, useCallback } from 'react';

interface ProductCreateFormProps {
  onProductCreated?: () => Promise<void>;
}

const ProductCreateForm = ({ onProductCreated }: ProductCreateFormProps) => {
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        setSubmitError(
          error instanceof Error 
            ? `Error al cargar categorías: ${error.message}`
            : 'Error al cargar categorías. Por favor, recarga la página.'
        );
      }
    };
    fetchCategories();
  }, []);

  const formattedCategories = categories.map((category) => (
    <MenuItem key={category.category_id} value={category.category_id}>
      {category.category_name}
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
      category_id: 1,
      state_id: undefined,
      product_name: '',
      brand: '',
      product_code: '',
      stock_quantity: '',
      unit_price: '',
      image_url: '',
    }
  });

  const onSubmit = useCallback(async (data: CreateProductForm) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      if (!idUsuario) {
        setSubmitError("Usuario no encontrado. Por favor, inicia sesión nuevamente.");
        return;
      }
      
      const formattedData = {
        ...data,
        category_id: Number(data.category_id),
        state_id: Number(data.state_id),
        stock_quantity: Number(data.stock_quantity),
        unit_price: Number(data.unit_price),
        user_id: String(idUsuario), // Asegurarse de que sea string según la interfaz IProductCreate
      };

      // Validación adicional de datos antes de enviar al backend
      if (formattedData.unit_price <= 0) {
        throw new Error('El precio debe ser mayor que cero');
      }
      
      if (formattedData.stock_quantity < 0) {
        throw new Error('El stock no puede ser negativo');
      }
      
      await createProduct(formattedData);
      setSubmitSuccess(true);
      reset();
      
      // Mejor UX: mostrar mensaje de éxito y refrescar datos
      if (onProductCreated) {
        setTimeout(async () => {
          await onProductCreated();
        }, 2000);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Error al crear el producto. Inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [idUsuario, reset, onProductCreated]);

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Producto creado correctamente! La página se recargará en unos segundos.
        </Alert>
      )}
      
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <TextField
        label="Usuario"
        variant="outlined"
        {...register('user_id')}
        error={!!errors.user_id}
        helperText={errors.user_id?.message}
        defaultValue={idUsuario}
        disabled={true}
        fullWidth
      />
      <TextField
        label="Nombre del Producto"
        variant="outlined"
        {...register('product_name')}
        error={!!errors.product_name}
        helperText={errors.product_name?.message}
        fullWidth
      />
      <TextField
        label="Marca"
        variant="outlined"
        {...register('brand')}
        error={!!errors.brand}
        helperText={errors.brand?.message}
        fullWidth
      />
      <TextField
        label="Código"
        variant="outlined"
        {...register('product_code')}
        error={!!errors.product_code}
        helperText={errors.product_code?.message}
        fullWidth
      />
      <TextField
        label="Stock"
        variant="outlined"
        type="number"
        {...register('stock_quantity')}
        error={!!errors.stock_quantity}
        helperText={errors.stock_quantity?.message}
        fullWidth
      />
      <TextField
        label="Precio"
        variant="outlined"
        type="number"
        {...register('unit_price')}
        error={!!errors.unit_price}
        helperText={errors.unit_price?.message}
        fullWidth
      />
      <Select
        label='Categoría'
        variant="outlined"
        {...register('category_id')}
        error={!!errors.category_id}
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
        {...register('state_id')}
        error={!!errors.state_id}
        fullWidth
        displayEmpty={true}
        defaultValue={valueState}
        onChange={(e) => setValueState(e.target.value)}
      >
        <MenuItem value={'1'}>Activo</MenuItem>
        <MenuItem value={'2'}>Inactivo</MenuItem>
      </Select>
      <TextField
        label="URL de Imagen"
        variant="outlined"
        {...register('image_url')}
        error={!!errors.image_url}
        helperText={errors.image_url?.message}
        fullWidth
      />
      <Button
        type='submit'
        variant='contained'
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isSubmitting ? 'Creando...' : 'Crear Producto'}
      </Button>
    </form>
  );
}

export default ProductCreateForm;