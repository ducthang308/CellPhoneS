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
  }

};

export default productService;