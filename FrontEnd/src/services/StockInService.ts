import axiosClient from "./AxiosClient";
import type { StockInRequest, StockInResponse } from "./Interface";

class StockInService {
    getAll(): Promise<StockInResponse[]> {
        return axiosClient
            .get("/api/stockin")
            .then(res => res.data);
        }


  getById(id: number): Promise<StockInResponse> {
    return axiosClient.get(`/api/stockin/${id}`).then(res => res.data);
  }

  create(payload: StockInRequest): Promise<StockInResponse> {
    return axiosClient.post("/api/stockin", payload).then(res => res.data);
  }

  update(id: number, payload: StockInRequest): Promise<StockInResponse> {
    return axiosClient.put(`/api/stockin/${id}`, payload).then(res => res.data);
  }

  delete(id: number): Promise<void> {
    return axiosClient.delete(`/api/stockin/${id}`).then(res => res.data);
  }
}

export default new StockInService();
