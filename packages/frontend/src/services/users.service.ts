import axios from 'axios';
import { IUser } from '@/interfaces/auth.interface'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const getUsers = async (): Promise<IUser[]> => {
  try{
    const response = await axios.get<IUser[]>(`${apiBaseUrl}products`);
    return response.data;
  } catch (error){
    throw error;
  }
}

export const getUser = async (id: string): Promise<IUser> => {
  try{
    const response = await axios.get<IUser>(`${apiBaseUrl}products/${id}`);
    return response.data;
  } catch (error){
    throw error;
  }
}

export const createUser = async (product: IUser): Promise<IUser> => {
  try{
    const response = await axios.post<IUser>(`${apiBaseUrl}products`, product);
    return response.data;
  } catch (error){
    throw error;
  }
}

export const updateUsers = async (product: IUser): Promise<IUser> => {
  try{
    const response = await axios.put<IUser>(`${apiBaseUrl}products/${product.idusuarios}`, product);
    return response.data;
  } catch (error){
    throw error;
  }
}

export const updateUsersState = async (id: string, state: number): Promise<IUser> => {
  try{
    const response = await axios.patch<IUser>(`${apiBaseUrl}products/${id}`, {state});
    return response.data;
  } catch (error){
    throw error;
  }
}