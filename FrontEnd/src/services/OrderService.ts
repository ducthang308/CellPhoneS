import axiosClient from "./AxiosClient";
import type { CreateOrderRequest, OrderResponse } from "../services/Interface";

const orderService = {
    create(data: CreateOrderRequest) {
        return axiosClient
            .post<OrderResponse>("/api/order", data)
            .then(res => res.data);
    }
};

export default orderService;