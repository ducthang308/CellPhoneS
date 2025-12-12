import axiosClient from './AxiosClient';
import type { IProduct } from './Interface';

const productService = {
  getAllProducts: async () => {
    try {
      const response = await axiosClient.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id: number): Promise<IProduct> => {
    try {
      const response = await axiosClient.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
};

export default productService;