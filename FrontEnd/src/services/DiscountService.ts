import axiosClient from "./AxiosClient";
import type { Discount } from "./Interface";

const DiscountService = {
  async getAll(): Promise<Discount[]> {
    const res = await axiosClient.get("/api/discounts");
    return res.data; // 🔥 CÁI QUAN TRỌNG
  },

  async getById(id: number): Promise<Discount> {
    const res = await axiosClient.get(`/api/discounts/${id}`);
    return res.data;
  },

  async create(data: Discount): Promise<Discount> {
    const res = await axiosClient.post("/api/discounts", data);
    return res.data;
  },

  async update(id: number, data: Discount): Promise<Discount> {
    const res = await axiosClient.put(`/api/discounts/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/api/discounts/${id}`);
  }
};

export default DiscountService;
