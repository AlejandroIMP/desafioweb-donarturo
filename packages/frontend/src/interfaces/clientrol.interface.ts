import { IProduct, CartProduct } from './product.interface';

export interface ClientContextType {
  cartProducts: CartProduct[];
  setCartProducts: (products: CartProduct[] | ((prevState: CartProduct[]) => CartProduct[])) => void;
  count: number;
  setCount: (count: number) => void;
  addProduct: (product: CartProduct) => void;

  totalPrice: number;
  setTotalPrice: (totalprice: number) => void;

  openCheckoutSideMenu: boolean;
  setOpenCheckoutSideMenu: (open: boolean) => void;
  openCheckoutSideMenuHandler: () => void;
  closeCheckoutSideMenuHandler: () => void;

  products: IProduct[];
  getProducts: () => Promise<void>;  // Update return type
  isLoading: boolean;
  error: Error | null;  // More specific error type
}

