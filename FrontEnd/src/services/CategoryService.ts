import axios from "axios";
import type { ICategory } from "./Interface";
import axiosClient from "./AxiosClient";

const CategoryService = {
    async getCategories(): Promise<ICategory[]> {
        try {
            const response = await axiosClient.get<ICategory[]>("/api/categories");
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy thông tin Category";
                throw new Error(message);
            }
            throw new Error("Không thể lấy thông tin Category");
        }
    },
};

export default CategoryService;
