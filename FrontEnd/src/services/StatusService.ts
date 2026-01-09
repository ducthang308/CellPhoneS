import axiosClient from "./AxiosClient";
import type { OrderResponse, OrderWithUserResponse } from "./Interface";

const OrderService = {
  getById: (id: number): Promise<OrderResponse> =>
    axiosClient.get(`/api/order/${id}`),

  async getOrdersWithUser(): Promise<OrderWithUserResponse[]> {
    const res = await axiosClient.get("/api/order/list/with-user");
    return res.data;
  },
  updateStatus: (id: number, status: "APPROVED" | "REJECTED") =>
    axiosClient.put(`/api/order/${id}`, { status }),
};

export default OrderService;
