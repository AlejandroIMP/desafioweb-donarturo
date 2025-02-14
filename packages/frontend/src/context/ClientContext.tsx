import { useState, useEffect, ReactNode, useCallback } from 'react';
import { getProducts } from '../services/products.service';
import { getOrdersByUser } from '@/services/orders.service';
import { CartProduct, DataProduct } from '../interfaces/product.interface';
import { IOrder } from '@/interfaces/orderAndDetails.interface';
import { ClientContext } from './ClientContextDefinition';


export const ClientProvider = ({ children }: { children: ReactNode }) => {

  
  const [products, setProducts] = useState<DataProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);


  const fetchProducts = async () => {
    setIsLoading(true);
    if (localStorage.getItem('idusuario') === null) return;
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

  const [userOrders, setUserOrders] = useState<IOrder[]>([]);

  const idUsuario = localStorage.getItem('idUsuario');

  const getUserOrders = useCallback(async () => {
    if (localStorage.getItem('idusuario') === null) return;
    try {
      const response = await getOrdersByUser(Number(idUsuario));

      const userOrdersConfirmedAndDelivered = response.data.filter((order: IOrder) => order.estados_idestados === 7 || order.estados_idestados === 8);
      setUserOrders(userOrdersConfirmedAndDelivered);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to fetch orders'));
    }
  }, [idUsuario]);

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  return (
    <ClientContext.Provider value={{ 
      cartProducts,
      setCartProducts,
      count,
      setCount,
      addProduct,

      totalPrice,
      setTotalPrice,

      setUserOrders,
      userOrders,
      getUserOrders,

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