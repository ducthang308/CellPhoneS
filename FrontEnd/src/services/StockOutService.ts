import axiosClient from "./AxiosClient";
import type { StockOutResponse } from "./Interface";

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
}

export default new StockOutService();
