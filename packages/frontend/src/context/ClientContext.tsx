import { createContext, useState, useEffect, ReactNode } from 'react';
import { getProducts } from '../services/products.service';
import { IProduct, ProductResponse } from '../interfaces/product.interface';
import { ClientContextType } from '@/interfaces/clientrol.interface';


export const ClientContext = createContext<ClientContextType>({} as ClientContextType);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      console.log(data.success);
      setProducts(data.data);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to fetch products'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  return (
    <ClientContext.Provider value={{ 
      products, 
      getProducts: fetchProducts,
      isLoading, 
      error 
    }}>
      {children}
    </ClientContext.Provider>
  );
};