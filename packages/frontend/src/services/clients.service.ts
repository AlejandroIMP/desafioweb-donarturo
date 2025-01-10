import axios from 'axios';
import { IClient, ClientResponseGet, IClientCreate } from '@/interfaces/clients.interface';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
});

export const getClients = async (): Promise<ClientResponseGet> => {
  try{
    const response = await axios.get(`${apiBaseUrl}client`, {
      headers: getHeaders()
    });
    return response.data;
  } catch(error){
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

export const createClient = async (clientData: IClientCreate): Promise<ClientResponseGet> => {
  try{
    const response = await axios.post(`${apiBaseUrl}client`, clientData, {
      headers: getHeaders()
    });
    return response.data;
  } catch(error){
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

export const updateClient = async (id:number, clientData: IClientCreate): Promise<ClientResponseGet> => {
  try{
    const response = await axios.put(`${apiBaseUrl}client/${id}`, clientData, {
      headers: getHeaders()
    });
    return response.data;
  } catch(error){
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};


