import { CartProduct, DataProduct } from './product.interface';
import { IOrder } from './orderAndDetails.interface';

export interface ClientContextType {
  cartProducts: CartProduct[];
  setCartProducts: (products: CartProduct[] | ((prevState: CartProduct[]) => CartProduct[])) => void;
  count: number;
  setCount: (count: number) => void;
  addProduct: (product: CartProduct) => void;

  totalPrice: number;
  setTotalPrice: (totalprice: number) => void;

  setUserOrders: (orders: IOrder[]) => void;
  userOrders: IOrder[];
  getUserOrders: () => Promise<void>;

  openCheckoutSideMenu: boolean;
  setOpenCheckoutSideMenu: (open: boolean) => void;
  openCheckoutSideMenuHandler: () => void;
  closeCheckoutSideMenuHandler: () => void;

  products: DataProduct[];
  getProducts: () => Promise<void>; 
  isLoading: boolean;
  error: Error | null;  
}

