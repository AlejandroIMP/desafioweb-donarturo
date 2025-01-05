import axios from 'axios';
import { IProduct, ProductResponse } from '@/interfaces/product.interface'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
});

export const getProducts = async (): Promise<ProductResponse> => {
  try {
    const timestamp = new Date().getTime();
    const response = await axios.get<ProductResponse>(`${apiBaseUrl}productos`, { 
      headers: getHeaders(),
      params: { _t: timestamp }
    });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const getProduct = async (id: string): Promise<IProduct> => {
  try{
    const response = await axios.get<IProduct>(`${apiBaseUrl}products/${id}`);
    return response.data;
  } catch (error){
    throw error;
  }
}

export const createProduct = async (product: IProduct): Promise<IProduct> => {
  try{
    const response = await axios.post<IProduct>(`${apiBaseUrl}products`, product);
    return response.data;
  } catch (error){
    throw error;
  }
}

export const updateProduct = async (product: IProduct): Promise<IProduct> => {
  try{
    const response = await axios.put<IProduct>(`${apiBaseUrl}products/${product.idProductos}`, product);
    return response.data;
  } catch (error){
    throw error;
  }
}

export const updateProductState = async (id: string, state: number): Promise<IProduct> => {
  try{
    const response = await axios.patch<IProduct>(`${apiBaseUrl}products/${id}`, {state});
    return response.data;
  } catch (error){
    throw error;
  }
}