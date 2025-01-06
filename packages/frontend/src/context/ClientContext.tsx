import { createContext, useState, useEffect, ReactNode } from 'react';
import { getProducts } from '../services/products.service';
import { IProduct, CartProduct } from '../interfaces/product.interface';
import { ClientContextType } from '@/interfaces/clientrol.interface';
import { OrderRequest } from '@/interfaces/orderAndDetails.interface';


export const ClientContext = createContext<ClientContextType>({} as ClientContextType);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
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

  // Contador de productos en el carrito

  const [ count, setCount ] = useState<number>(0);

  // Productos en el carrito
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  // Abrir y cerrar el menu del carrito
  const [openCheckoutSideMenu, setOpenCheckoutSideMenu] = useState<boolean>(false);
  const openCheckoutSideMenuHandler = () => setOpenCheckoutSideMenu(true);
  const closeCheckoutSideMenuHandler = () => setOpenCheckoutSideMenu(false);

  // Calcular el total de la compra

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const newTotal = cartProducts.reduce((sum, product) => {
      // Add validation and default values
      const price = Number(product.precio) || 0;
      const quantity = Number(product.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    // Round to 2 decimal places
    setTotalPrice(Number(newTotal.toFixed(2)));
  }, [cartProducts]);

  const addProduct = (product: CartProduct) => {
    setCartProducts(prev => [
      ...prev,
      {
        ...product,
        precio: Number(product.precio),
        quantity: Number(product.quantity) || 1
      }
    ]);
  };


  return (
    <ClientContext.Provider value={{ 
      cartProducts,
      setCartProducts,
      count,
      setCount,
      addProduct,

      totalPrice,
      setTotalPrice,

      openCheckoutSideMenu,
      setOpenCheckoutSideMenu,
      openCheckoutSideMenuHandler,
      closeCheckoutSideMenuHandler,
  
      products, 
      getProducts: fetchProducts,
      isLoading, 
      error 
    }}>
      {children}
    </ClientContext.Provider>
  );
};