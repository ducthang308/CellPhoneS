import axiosClient from "./AxiosClient";
import type { StockOutRequest, StockOutResponse } from "./Interface";


class StockOutService {
  getStockOutAll(): Promise<StockOutResponse[]> {
    return axiosClient
        .get("/api/stockout")
        .then(res => {
        console.log("StockOut raw response:", res.data);
        return Array.isArray(res.data) ? res.data : [];
        });
    }


  getById(id: number): Promise<StockOutResponse> {
    return axiosClient
      .get(`/api/stockout/${id}`)
      .then(res => res.data);
  }

  create(payload: {
    batchID: number;
    quantity: number;
    date: string;
    note?: string;
  }) {
    return axiosClient.post("/api/stockout", payload);
  }

  update(id: number, payload: {
    batchId?: number;
    quantity?: number;
    note?: string;
    date?: string;
  }) {
    return axiosClient.put(`/api/stockout/${id}`, payload);
  }

  delete(id: number) {
    return axiosClient.delete(`/api/stockout/${id}`);
  }
}

export default new StockOutService();
