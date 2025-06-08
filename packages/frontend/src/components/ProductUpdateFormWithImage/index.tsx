import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField, Select, MenuItem, Box, Alert, CircularProgress } from '@mui/material';
import { createProductSchema, CreateProductForm } from '@/schemas/product.schemas';
import { IProductCategory } from '@/interfaces/productcategory.interface';
import { updateProductWithImage } from '@/services/products.service';
import { getCategories } from '@/services/categories.service';
import { useState, useEffect, useCallback } from 'react';
import { DataProduct } from '@/interfaces/product.interface';
import ImageUpload from '@/components/ImageUpload';

interface ProductUpdateFormWithImageProps {
  product: DataProduct;
  onProductUpdated?: () => Promise<void>;
}

const ProductUpdateFormWithImage = ({ product, onProductUpdated }: ProductUpdateFormWithImageProps) => {
  const [categories, setCategories] = useState<IProductCategory[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [valueState, setValueState] = useState(product.state.state_id.toString());
  const [valueCategory, setValueCategory] = useState(product.category.category_id);

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
      state_id: product.state.state_id.toString() as "1" | "2",
      product_name: product.product_name,
      brand: product.brand,
      product_code: product.product_code,
      stock_quantity: product.stock_quantity.toString(),
      unit_price: product.unit_price.toString(),
      image_url: product.image_url,
      user_id: product.user.user_id.toString()
    }
  });

  const onSubmit = useCallback(async (data: CreateProductForm) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Convert string values to numbers where needed
      const productData = {
        ...data,
        category_id: Number(data.category_id),
        state_id: Number(data.state_id),
        stock_quantity: Number(data.stock_quantity),
        unit_price: Number(data.unit_price),
        user_id: data.user_id, // Mantener como string según la interfaz IProductCreate
      };

      // Validación adicional de datos antes de enviar al backend
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

      await updateProductWithImage(product.product_id, productData, selectedImage || undefined);
      
      setSubmitSuccess(true);
      reset();
      setSelectedImage(null);
      
      // Usar el callback para actualizar los datos en lugar de recargar la página
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
  }, [product.product_id, selectedImage, reset, onProductUpdated]);

  const handleImageSelect = useCallback((file: File | null) => {
    setSelectedImage(file);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Producto actualizado correctamente! La página se recargará en unos segundos.
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
            value={valueState}
            onChange={(e) => setValueState(e.target.value)}
          >
            <MenuItem value={'1'}>Activo</MenuItem>
            <MenuItem value={'2'}>Inactivo</MenuItem>
          </Select>

          {/* Campo de foto tradicional (opcional, por compatibilidad) */}
          <TextField
            label="URL de Imagen (opcional)"
            variant="outlined"
            {...register('image_url')}
            error={!!errors.image_url}
            helperText={errors.image_url?.message || "Puedes usar este campo o subir una nueva imagen abajo"}
            fullWidth
          />

          {/* Componente de subida de imagen */}
          <ImageUpload
            onImageSelect={handleImageSelect}
            currentImageUrl={product.image_url}
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
            {isSubmitting ? 'Actualizando Producto...' : 'Actualizar Producto'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProductUpdateFormWithImage;
