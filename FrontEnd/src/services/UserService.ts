import axios, { isAxiosError } from 'axios';
import type { LoginResponse } from './Interface';
import axiosClient from './AxiosClient';
import type { IRegisterRequest } from './Interface';

export const login = async (sdt: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post<LoginResponse>('/api/user/login', {
      sdt: sdt.trim(),
      passWord: password 
    });
    return response.data;
  } catch (error: any) {
  
    const message = 
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
      'Lỗi kết nối đến server';

    console.error('Chi tiết lỗi login:', error.response?.data);
    throw new Error(message);
  }
};
export const register = async (userData: IRegisterRequest): Promise<IRegisterRequest> => {
    try {
        const response = await axiosClient.post<IRegisterRequest>('/api/user/register', userData);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Đăng ký thất bại');
        }
        throw new Error('Đăng ký thất bại');
    }
};