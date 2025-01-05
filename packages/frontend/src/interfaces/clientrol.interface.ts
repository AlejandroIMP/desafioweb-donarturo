import { IProduct } from './product.interface';

export interface ClientContextType {
  products: IProduct[];
  getProducts: () => Promise<void>;  // Update return type
  isLoading: boolean;
  error: Error | null;  // More specific error type
}

