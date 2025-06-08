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

export const updateProductState = async (id: number, state_id: number): Promise<ProductResponse> => {
  try{
    const response = await axios.patch<ProductResponse>(`${apiBaseUrl}productos/${id}`, {state_id}, { headers: getHeaders() });
    return response.data;
  } catch (error){
    throw error;
  }
}

// Create product with image upload
export const createProductWithImage = async (productData: IProductCreate, imageFile?: File): Promise<ProductResponse> => {
  try {
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData).forEach(key => {
      const value = productData[key as keyof IProductCreate];
      formData.append(key, String(value));
    });
    
    // Append image if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const timestamp = new Date().getTime();
    const response = await axios.post<ProductResponse>(`${apiBaseUrl}productos/with-image`, formData, {
      headers: {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data'
      },
      params: { _t: timestamp }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update product with image upload
export const updateProductWithImage = async (id: number, productData: IProductCreate, imageFile?: File): Promise<ProductResponse> => {
  try {
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData).forEach(key => {
      const value = productData[key as keyof IProductCreate];
      formData.append(key, String(value));
    });
    
    // Append image if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await axios.put<ProductResponse>(`${apiBaseUrl}productos/${id}/with-image`, formData, {
      headers: {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload image only
export const uploadProductImage = async (id: number, imageFile: File): Promise<{ success: boolean; data: { image_url: string; public_id: string }; message: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axios.post(`${apiBaseUrl}productos/${id}/upload-image`, formData, {
      headers: {
        ...getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};