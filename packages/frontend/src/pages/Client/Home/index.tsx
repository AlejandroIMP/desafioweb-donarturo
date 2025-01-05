import ClientLayout from '@/layouts/ClientLayout';
import { useClientContext } from '@/hooks';
import Card from '@/components/Card';
import './index.css';


const Home = () => {
  const { products, isLoading, error } = useClientContext();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <ClientLayout>
      <h2>Home</h2>
      <section className='main-products--container'>
        {
          products.map((product) => (
            <Card 
              key={product.idProductos}
              product={product}
            />
          ))
        }
      </section>
    </ClientLayout>
  );
};

export default Home;