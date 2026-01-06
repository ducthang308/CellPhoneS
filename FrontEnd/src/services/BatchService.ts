import axiosClient from "./AxiosClient";
import type { BatchResponse } from "./Interface";

class BatchService {
  getAll(): Promise<BatchResponse[]> {
    
    return axiosClient.get("/api/batch").then(res => res.data);
    
  }
}

export default new BatchService();
