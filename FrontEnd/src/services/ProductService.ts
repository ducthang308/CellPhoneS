import axiosClient from './AxiosClient';
import type { IProduct } from './Interface';
import { normalizeProduct } from "../adapter/normalizeProduct";

const productService = {
  getAllProducts: async (): Promise<IProduct[]> => {
    try {
      const response = await axiosClient.get("/api/products");

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

  getProductById: async (id: number): Promise<IProduct | null> => {
    try {
      const response = await axiosClient.get(`/api/products/${id}`);
      return normalizeProduct(response.data);
    } catch (error) {
      console.error(`getProductById ${id} failed`, error);
      return null;
    }
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