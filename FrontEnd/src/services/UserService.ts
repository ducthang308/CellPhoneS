import axios, { isAxiosError } from 'axios';
import type { LoginResponse } from './Interface';
import axiosClient from './AxiosClient';
import type { IRegisterRequest } from './Interface';

export const login = async (
    sdt: string,
    passWord: string
): Promise<LoginResponse> => {
    try {
        const response = await axiosClient.post<LoginResponse>(
            '/api/user/login',
            {
                sdt,
                passWord,
            }
        );

        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Đăng nhập thất bại');
        }
        throw new Error('Đăng nhập thất bại');
    }
};

export const register = async (
    userData: IRegisterRequest
): Promise<void> => {
    try {
        await axiosClient.post("/api/user/register", userData);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Đăng ký thất bại");
        }
        throw new Error("Đăng ký thất bại");
    }
};
