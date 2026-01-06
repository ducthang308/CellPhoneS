import axios from "axios";
import type { ICategory } from "./Interface";
import axiosClient from "./AxiosClient";

const CategoryService = {
  // ================= GET ALL =================
  async getAllCategories(): Promise<ICategory[]> {
    try {
      const response = await axiosClient.get<ICategory[]>("/api/categories");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy danh sách danh mục";
        throw new Error(message);
      }
      throw new Error("Không thể lấy danh sách danh mục");
    }
  },

  // ================= GET BY ID =================
  async getCategoryById(id: number): Promise<ICategory> {
    try {
      const response = await axiosClient.get<ICategory>(`/api/categories/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Không thể lấy thông tin danh mục";
        throw new Error(message);
      }
      throw new Error("Không thể lấy thông tin danh mục");
    }
  },

  // ================= CREATE =================
  async createCategory(
    category: Omit<ICategory, "categoryId">
  ): Promise<ICategory> {
    try {
      const response = await axiosClient.post<ICategory>(
        "/api/categories",
        category
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Không thể tạo danh mục";
        throw new Error(message);
      }
      throw new Error("Không thể tạo danh mục");
    }
  },

  // ================= UPDATE =================
  async updateCategory(
    id: number,
    category: Omit<ICategory, "categoryId">
  ): Promise<ICategory> {
    try {
      const response = await axiosClient.put<ICategory>(
        `/api/categories/${id}`,
        category
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Không thể cập nhật danh mục";
        throw new Error(message);
      }
      throw new Error("Không thể cập nhật danh mục");
    }
  },

  // ================= DELETE =================
  async deleteCategory(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/categories/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Không thể xóa danh mục";
        throw new Error(message);
      }
      throw new Error("Không thể xóa danh mục");
    }
  }
};

export default CategoryService;
