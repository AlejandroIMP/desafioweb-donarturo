import axios from 'axios';
import { OrderResponse, OrderResponseGet } from '@/interfaces/orderAndDetails.interface';
import { OrderSchemaForm } from '@/schemas/order.schemas';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
});


export const postOrder = async (data: OrderSchemaForm): Promise<OrderResponse> => {
  try {
    const response = await axios.post<OrderResponse>(`${apiBaseUrl}order`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const getOrderById = async (id: number): Promise<OrderResponseGet> => {
  try {
    const response = await axios.get<OrderResponseGet>(`${apiBaseUrl}order/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const getOrdersByUser = async (id: number): Promise<OrderResponseGet> => {
  try {
    const response = await axios.get<OrderResponseGet>(`${apiBaseUrl}order/user/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const getAllOrders = async (): Promise<OrderResponseGet> => {
  try {
    const response = await axios.get<OrderResponseGet>(`${apiBaseUrl}order`, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const updateOrder = async (id: number, data: OrderSchemaForm): Promise<OrderResponse> => {
  try {
    const response = await axios.put<OrderResponse>(`${apiBaseUrl}order/${id}`, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

export const updateOrderState = async (id: number, estados_idestados: number): Promise<OrderResponse> => {
  try {
    if (!id || !estados_idestados) {
      throw new Error('ID and state are required');
    }

    const response = await axios.patch<OrderResponse>(
      `${apiBaseUrl}order/${id}`, 
      { estados_idestados }, 
      { 
        headers: getHeaders(),
        validateStatus: (status) => status < 500
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update order state');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error updating order state');
    }
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

