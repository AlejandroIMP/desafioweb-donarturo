import { DataProduct } from "@/interfaces/product.interface";
import { Box, Button, Grid, Typography, styled } from '@mui/material';
import { useClientContext } from "@/hooks";

interface ProductInfoModalProps {
  product: DataProduct;
}

const ProductImage = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '8px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const ProductInfoModal = ({ product }: ProductInfoModalProps) => {
  const { cartProducts, count, setCount, openCheckoutSideMenuHandler, addProduct } = useClientContext();

  const isProductInCart = cartProducts.find(
    (cartProduct) => cartProduct.idProductos === product.idProductos
  );

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isProductInCart && product.stock > 0) {
      addProduct(product);
      setCount(count + 1);
      openCheckoutSideMenuHandler();
    }
  };

  const buttonDisabled = () => {
    if (product.stock === 0 || isProductInCart) {
      return true;
    }
    return false;
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, margin: 'auto' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <ProductImage src={product.foto} alt={product.nombre} />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h4" component="h3" sx={{
              fontWeight: 'bold',
              color: 'primary.main'
            }}>
              {product.nombre}
            </Typography>

            <Typography variant="h5" sx={{
              color: 'text.secondary',
              fontWeight: 500
            }}>
              Q {product.precio}
            </Typography>

            <Typography variant="body1" sx={{
              bgcolor: 'background.paper',
              p: 1,
              borderRadius: 1
            }}>
              {product.categoria.nombre}
            </Typography>

            <Typography variant="body1" sx={{
              color: product.stock === 0 ? 'error.main' : 'success.main',
              fontWeight: 500
            }}>
              {product.stock === 0 ? 'Agotado' : 'Disponible'}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={buttonDisabled()}
              onClick={handleAddToCart}
              sx={{
                mt: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  transform: product.stock === 0 || isProductInCart ? 'none' : 'translateY(-2px)',
                  transition: 'transform 0.2s'
                },
                bgcolor: isProductInCart ? 'success.main' : 'primary.main',
                '&:disabled': {
                  bgcolor: 'grey.400',
                  color: 'grey.700'
                }
              }}
            >
              {product.stock === 0
                ? 'Producto agotado'
                : isProductInCart
                  ? 'Item ya en el carrito'
                  : 'Agregar al carrito'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductInfoModal;
