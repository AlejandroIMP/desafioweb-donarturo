import { DataProduct } from "@/interfaces/product.interface";
import { Button } from "@mui/material";

interface ProductInfoModalProps {
  product: DataProduct;
}

const ProductInfoModal = ({ product }: ProductInfoModalProps) => { 
  return(
    <article>
      <figure>
        <img src={product.foto} alt={product.nombre} />
      </figure>
      <section>
        <div>
          <h3>{product.nombre}</h3>
          <p>Q  {product.precio}</p>
          <p>{product.categoria.nombre}</p>
          {
            product.stock === 0 ? <p>Agotado</p> : <p>Disponible</p>
          }
        </div>
        <div>
          <Button variant="contained" color="primary">Agregar al carrito</Button>
        </div>
      </section>
    </article>
  )
};

export default ProductInfoModal;