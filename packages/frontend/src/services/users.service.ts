import axios from 'axios';
import { userResponsePost } from '@/interfaces/users.interface'
import { IUser, userResponseGet } from '@/interfaces/auth.interface'
import { UpdateUserForm, CreateUserForm } from '@/schemas/user.schemas';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
});


export const getUsers = async (): Promise<userResponseGet> => {
  try{
    const response = await axios.get<userResponseGet>(`${apiBaseUrl}usuarios`, { headers: getHeaders() });
    return response.data;
  } catch (error){
    throw error;
  }
}

export const getUser = async (id: string): Promise<IUser> => {
  try{
    const response = await axios.get<IUser>(`${apiBaseUrl}usuarios/${id}`, { headers: getHeaders() });
    return response.data;
  } catch (error){
    throw error;
  }
}

export const createUser = async (product: CreateUserForm): Promise<userResponsePost> => {
  try{
    const response = await axios.post<userResponsePost>(`${apiBaseUrl}usuarios`, product, { headers: getHeaders() });
    return response.data;
  } catch (error){
    throw error;
  }
}

export const updateUsers = async (id:number, user: UpdateUserForm): Promise<userResponsePost> => {
  try{
    const response = await axios.put<userResponsePost>(`${apiBaseUrl}usuarios/${id}`, user, { headers: getHeaders() });
    return response.data;
  } catch (error){
    throw error;
  }
}

export const updateUsersState = async (id: number, estados_idestados: number): Promise<IUser> => {
  try{
    const response = await axios.patch<IUser>(`${apiBaseUrl}usuarios/${id}`, {estados_idestados}, { headers: getHeaders() });
    return response.data;
  } catch (error){
    throw error;
  }
}