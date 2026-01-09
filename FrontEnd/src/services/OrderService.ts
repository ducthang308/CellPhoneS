import axiosClient from "./AxiosClient";
import type {
    OrderRequest,
    OrderResponse,
    OrderFullResponse,
    CreateOrderRequest,
} from "../services/Interface";

const orderService = {
    // USER tạo order (gộp order + details)
    create(data: CreateOrderRequest) {
        return axiosClient
            .post<OrderResponse>("/api/order", data)
            .then(res => res.data);
    },

    // USER xem chi tiết order (FULL)
    getById(orderId: number) {
        return axiosClient
            .get<OrderFullResponse>(`/api/order/${orderId}`)
            .then(res => res.data);
    },

    // USER xem danh sách order của mình
    getByUser(userId: number) {
        return axiosClient
            .get<OrderFullResponse[]>(`/api/order/user/${userId}`)
            .then(res => res.data); 
    },

    // ADMIN xem danh sách order (summary)
    getAll() {
        return axiosClient
            .get<OrderResponse[]>("/api/order")
            .then(res => res.data);
    },

    applyDiscount(orderId: number, code: string) {
        return axiosClient
            .post<OrderFullResponse>(`/api/order/${orderId}/apply-discount`, null, {
                params: { code }
            })
            .then(res => res.data);
    },

    // ADMIN update trạng thái
    update(orderId: number, data: Partial<OrderRequest>) {
        return axiosClient
            .put<OrderResponse>(`/api/order/${orderId}`, data)
            .then(res => res.data);
    },

    // ADMIN xoá order
    delete(orderId: number) {
        return axiosClient
            .delete<string>(`/api/order/${orderId}`)
            .then(res => res.data);
    }
};

export default orderService;
