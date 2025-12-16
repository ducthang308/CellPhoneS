import axiosClient from './AxiosClient';
import type { IProduct } from './Interface';
import { normalizeProduct } from "../adapter/normalizeProduct";

const productService = {
  getAllProducts: async (
    keyword?: string,
    categoryId?: string
  ): Promise<IProduct[]> => {
    try {
      const params = new URLSearchParams();

      if (keyword) params.set("keyword", keyword);
      if (categoryId) params.set("categoryId", categoryId);

      const response = await axiosClient.get(
        `/api/products?${params.toString()}`
      );

      if (!Array.isArray(response.data)) {
        console.warn("API không trả array, fallback []");
        return [];
      }

      return response.data.map(normalizeProduct);
    } catch (error) {
      console.error("getAllProducts failed", error);
      return [];
    }
  },


  async getProductById(id: number): Promise<IProduct> {
    const res = await axiosClient.get<IProduct>(`/api/products/${id}`);
    return res.data;
  },

  async addToCart(productId: number) {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Chưa đăng nhập");
    }

    const cartRes = await axiosClient.post(
      "/api/carts",
      {
        userId: Number(userId),
        status: "ACTIVE",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const cartId = cartRes.data.id;

    await axiosClient.post(
      "/api/cart-details",
      {
        cartId,
        productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  },
};

export default productService;