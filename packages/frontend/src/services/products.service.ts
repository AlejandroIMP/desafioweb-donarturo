import axios from 'axios';
import { ProductResponse } from '@/interfaces/product.interface'
import { IProductCreate } from '@/interfaces/product.interface'

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

export const getProduct = async (id: number): Promise<ProductResponse> => {
  try{
    const timestamp = new Date().getTime();
    const response = await axios.get<ProductResponse>(`${apiBaseUrl}productos/${id}`, { 
      headers: getHeaders(),
      params: { _t: timestamp }
    });
    return response.data;
  } catch (error){
    throw error;
  }
}

export const createProduct = async (product: IProductCreate): Promise<ProductResponse> => {
  try{

    const timestamp = new Date().getTime();
    const response = await axios.post<ProductResponse>(`${apiBaseUrl}productos`, product, { 
      headers: getHeaders(),
      params: { _t: timestamp }
    });
    return response.data;
  } catch (error){
    throw error;
  }
}

export const updateProduct = async (id: number, product: IProductCreate): Promise<ProductResponse> => {
  try{
    const response = await axios.put<ProductResponse>(`${apiBaseUrl}productos/${id}`, product, { headers: getHeaders() });
    return response.data;
  } catch (error){
    throw error;
  }
}

export const updateProductState = async (id: number, estados_idestados: number): Promise<ProductResponse> => {
  try{
    const response = await axios.patch<ProductResponse>(`${apiBaseUrl}productos/${id}`, {estados_idestados}, { headers: getHeaders() });
    return response.data;
  } catch (error){
    throw error;
  }
}