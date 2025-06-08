import axios from 'axios';
import { LoginResponse, RegisterResponse } from '@/interfaces/auth.interface';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  birth_date?: string;
  role_id?: number;
  state_id?: number;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${apiBaseUrl}auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${apiBaseUrl}auth/register`, {
      ...userData,
      role_id: userData.role_id || 2, // Default to customer role
      state_id: userData.state_id || 1 // Default to active state
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  localStorage.removeItem('idusuario');
  localStorage.removeItem('username');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getUserData = () => {
  return {
    token: localStorage.getItem('token'),
    role: Number(localStorage.getItem('role')),
    email: localStorage.getItem('email'),
    userId: Number(localStorage.getItem('idusuario')),
    username: localStorage.getItem('username')
  };
};

export const saveUserData = (loginResponse: LoginResponse): void => {
  localStorage.setItem('token', loginResponse.token);
  localStorage.setItem('role', String(loginResponse.user.role_id));
  localStorage.setItem('email', loginResponse.user.email);
  localStorage.setItem('idusuario', String(loginResponse.user.user_id));
  localStorage.setItem('username', loginResponse.user.full_name);
};
