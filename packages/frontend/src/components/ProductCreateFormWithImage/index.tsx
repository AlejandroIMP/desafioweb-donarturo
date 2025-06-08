import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Select, MenuItem, Box, Alert, CircularProgress } from '@mui/material';
import { createProductSchema, CreateProductForm } from '@/schemas/product.schemas';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { createProductWithImage } from '@/services/products.service';
import { getCategories } from '@/services/categories.service';
import { useState, useEffect, useCallback } from 'react';
import ImageUpload from '@/components/ImageUpload';

interface ProductCreateFormWithImageProps {
  onProductCreated?: () => Promise<void>;
}

const ProductCreateFormWithImage = ({ onProductCreated }: ProductCreateFormWithImageProps) => {
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
        throw new Error("Usuario no encontrado. Por favor, inicia sesión nuevamente.");
      }

      // Convert string values to numbers
      const productData = {
        ...data,
        category_id: Number(data.category_id),
        state_id: Number(data.state_id),
        stock_quantity: Number(data.stock_quantity),
        unit_price: Number(data.unit_price),
        user_id: String(idUsuario), // Asegurar consistencia, usar string
      };

      // Validación adicional antes de enviar al backend
      if (productData.unit_price <= 0) {
        throw new Error('El precio debe ser mayor que cero');
      }
      
      if (productData.stock_quantity < 0) {
        throw new Error('El stock no puede ser negativo');
      }

      // Validar que haya una imagen o URL de imagen
      if (!productData.image_url && !selectedImage) {
        throw new Error('Se requiere una imagen o URL de imagen');
      }

      await createProductWithImage(productData, selectedImage || undefined);
      
      setSubmitSuccess(true);
      reset();
      setSelectedImage(null);
      setValueState('');
      setValueCategory('');
      
      // Usar el callback para actualizar los datos en lugar de recargar la página
      if (onProductCreated) {
        setTimeout(async () => {
          await onProductCreated();
        }, 2000);
      }
      
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Error al crear el producto. Inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [idUsuario, reset, onProductCreated, selectedImage]);

  const handleImageSelect = useCallback((file: File | null) => {
    setSelectedImage(file);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Producto creado correctamente!
        </Alert>
      )}
      
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            value={valueCategory}
            onChange={(e) => setValueCategory(e.target.value)}
          >
            <MenuItem value="" disabled>Selecciona una categoría</MenuItem>
            {formattedCategories}
          </Select>
          
          <Select
            label='Estado'
            variant="outlined"
            {...register('state_id')}
            error={!!errors.state_id}
            fullWidth
            displayEmpty={true}
            value={valueState}
            onChange={(e) => setValueState(e.target.value)}
          >
            <MenuItem value="" disabled>Selecciona un estado</MenuItem>
            <MenuItem value={'1'}>Activo</MenuItem>
            <MenuItem value={'2'}>Inactivo</MenuItem>
          </Select>

          {/* Campo de foto tradicional (opcional, por compatibilidad) */}
          <TextField
            label="URL de Imagen (opcional)"
            variant="outlined"
            {...register('image_url')}
            error={!!errors.image_url}
            helperText={errors.image_url?.message || "Puedes usar este campo o subir una imagen abajo"}
            fullWidth
          />

          {/* Componente de subida de imagen */}
          <ImageUpload
            onImageSelect={handleImageSelect}
            label="Imagen del Producto"
            disabled={isSubmitting}
          />

          <Button
            type='submit'
            variant='contained'
            disabled={isSubmitting}
            sx={{ mt: 2 }}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Creando Producto...' : 'Crear Producto'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProductCreateFormWithImage;
