import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Select, MenuItem, Alert, Box, CircularProgress } from '@mui/material';
import { createProductSchema, CreateProductForm } from '@/schemas/product.schemas';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { updateProduct } from '@/services/products.service';
import { getCategories } from '@/services/categories.service';
import { useState, useEffect, useCallback } from 'react';
import { DataProduct } from '@/interfaces/product.interface';

interface ProductUpdateFormProps {
  product: DataProduct;
  onProductUpdated?: () => Promise<void>;
}

const ProductUpdateForm = ({ product, onProductUpdated }: ProductUpdateFormProps) => {
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [valueState, setValueState] = useState(product.state.state_id.toString());
  const [valueCategory, setValueCategory] = useState(product.category.category_id);

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
    <MenuItem key={category.category_id} value={category.category_id}>
      {category.category_name}
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
      category_id: product.category.category_id,
      state_id: product.state.state_id.toString() as "1" | "2"
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = useCallback(async (data: CreateProductForm) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const formattedData = {
        ...data,
        category_id: Number(data.category_id),
        state_id: Number(data.state_id),
        stock_quantity: Number(data.stock_quantity),
        unit_price: Number(data.unit_price),
        user_id: String(product.user.user_id), // Cambiado a string para consistencia
      };
      
      // Validación adicional de datos antes de enviar al backend
      if (formattedData.unit_price <= 0) {
        throw new Error('El precio debe ser mayor que cero');
      }
      
      if (formattedData.stock_quantity < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      await updateProduct(product.product_id, formattedData);
      setSubmitSuccess(true);
      reset();
      
      // Usar el callback para actualizar los datos
      if (onProductUpdated) {
        setTimeout(async () => {
          await onProductUpdated();
        }, 2000);
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Error al actualizar el producto. Inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [product.product_id, product.user.user_id, reset, onProductUpdated]);

  return (
    <Box sx={{ p: 3 }}>
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Producto actualizado correctamente! La página se actualizará en unos segundos.
        </Alert>
      )}
      
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Usuario"
        variant="outlined"
        {...register('user_id')}
        error={!!errors.user_id}
        helperText={errors.user_id?.message}
        defaultValue={product.user.user_id}
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
        defaultValue={product.product_name}
      />
      <TextField
        label="Marca"
        variant="outlined"
        {...register('brand')}
        error={!!errors.brand}
        helperText={errors.brand?.message}
        fullWidth
        defaultValue={product.brand}
      />
      <TextField
        label="Código"
        variant="outlined"
        {...register('product_code')}
        error={!!errors.product_code}
        helperText={errors.product_code?.message}
        fullWidth
        defaultValue={product.product_code}
      />
      <TextField
        label="Stock"
        variant="outlined"
        type="number"
        {...register('stock_quantity')}
        error={!!errors.stock_quantity}
        helperText={errors.stock_quantity?.message}
        fullWidth
        defaultValue={product.stock_quantity}
      />
      <TextField
        label="Precio"
        variant="outlined"
        type="number"
        {...register('unit_price')}
        error={!!errors.unit_price}
        helperText={errors.unit_price?.message}
        fullWidth
        defaultValue={product.unit_price}
      />
      <Select
        label='Categoría'
        variant="outlined"
        {...register('category_id')}
        error={!!errors.category_id}
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
        defaultValue={product.image_url}
      />
      <Button
        type='submit'
        variant='contained'
        disabled={isSubmitting}
        fullWidth
        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? 'Actualizando...' : 'Actualizar Producto'}
      </Button>
    </form>
    </Box>
  );
}

export default ProductUpdateForm;