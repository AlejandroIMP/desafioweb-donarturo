import axios from 'axios';
import { IProductCategory, ProductCategoryResponseGet } from '@/interfaces/productcategory.interface';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
});

export const getCategories = async (): Promise<ProductCategoryResponseGet> => {
  try {
    const response = await axios.get(`${apiBaseUrl}/productcategory`, {
      headers: getHeaders()
    });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}

export const updateCategoryState = async (id: number, state: number): Promise<void> => {
  try {
    await axios.put(`${apiBaseUrl}/productcategory/${id}`, { estados_idestados: state }, {
      headers: getHeaders()
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error');
  }
}