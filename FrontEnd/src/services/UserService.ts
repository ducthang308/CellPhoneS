import axios from "axios";
import axiosClient from "./AxiosClient";
import type { LoginResponse, IUser } from "./Interface";
import type { IRegisterRequest } from "./Interface";

/* ===================== AUTH ===================== */

export const login = async (
  sdt: string,
  passWord: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post<LoginResponse>(
      "/api/user/login",
      { sdt, passWord }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Đăng nhập thất bại");
    }
    throw new Error("Đăng nhập thất bại");
  }
};

export const loginWithGoogle = async (
  idToken: string
): Promise<LoginResponse> => {
  const res = await axiosClient.post<LoginResponse>(
    "/api/user/login/google",
    { idToken }
  );
  return res.data;
};

export const register = async (
  userData: IRegisterRequest
): Promise<void> => {
  try {
    await axiosClient.post("/api/user/register", userData);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || "Đăng ký thất bại");
    }
    throw new Error("Đăng ký thất bại");
  }
};

/* ===================== USER ===================== */

/** Update thông tin profile */
export interface UpdateUserProfileDTO {
  fullName?: string;
  email?: string;
  address?: string;
  sdt?: string;
}

/** Đổi mật khẩu */
export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

export const userService = {
  /**
   * Cập nhật thông tin người dùng (có hoặc không avatar)
   */
  updateUser: async (
    userId: number,
    data: UpdateUserProfileDTO,
    avatarFile?: File | null
  ): Promise<IUser> => {
    // Nếu có avatar → multipart/form-data
    if (avatarFile) {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("avatar", avatarFile);

      const res = await axiosClient.patch<IUser>(
        `/api/user/${userId}`,
        formData
      );
      return res.data;
    }

    // Không avatar → JSON
    const res = await axiosClient.patch<IUser>(
      `/api/user/${userId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  },

  /**
   * Đổi mật khẩu user thường (không áp dụng Google login)
   */
  changePassword: async (
    userId: number,
    data: ChangePasswordDTO
  ): Promise<void> => {
    await axiosClient.patch(
      `/api/user/${userId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  /**
   * Admin – lấy toàn bộ user
   */
  getAllUsers: async (): Promise<IUser[]> => {
    const res = await axiosClient.get<IUser[]>("/api/user");
    return res.data;
  },
};

export const getAllUsers = userService.getAllUsers;