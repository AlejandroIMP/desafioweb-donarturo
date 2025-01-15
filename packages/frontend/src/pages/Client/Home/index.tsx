import ClientLayout from '@/layouts/ClientLayout';
import { useClientContext } from '@/hooks';
import Card from '@/components/Card';
import './index.css';

const Home = () => {
  const { products, isLoading, error } = useClientContext();

  const activeProducts = products.filter((product) => product.estado.idestados === 1);

  return (
    <ClientLayout>
      <h2>Home</h2>
      <section className='main-products--container'>
        {
          isLoading ? <div>Loading...</div> :
          error ? <div>Error al cargar los productos</div> :
            activeProducts.length === 0 ? (
              <div>No products available</div>
            ) :
              (
                activeProducts.map((product) => (
                  <Card
                    key={product.idProductos}
                    product={product}
                  />
                  
                ))
                
              )
        }
        
      </section>
    </ClientLayout>
  );
};

export default Home;