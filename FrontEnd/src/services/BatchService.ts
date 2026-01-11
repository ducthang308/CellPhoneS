import axiosClient from "./AxiosClient";
import type { BatchResponse } from "./Interface";
import type { BatchRequest } from "./Interface";

const BatchService = {
  getAll(): Promise<BatchResponse[]> {
    return axiosClient.get("/api/batch").then(res => res.data);
  },

  getById(id: number): Promise<BatchResponse> {
    return axiosClient.get(`/api/batch/${id}`).then(res => res.data);
  },

  create(data: BatchRequest): Promise<BatchResponse> {
    return axiosClient.post("/api/batch", data).then(res => res.data);
  },

  update(id: number, data: BatchRequest): Promise<BatchResponse> {
    return axiosClient.put(`/api/batch/${id}`, data).then(res => res.data);
  },

  delete(id: number): Promise<void> {
    return axiosClient.delete(`/api/batch/${id}`);
  }
};

export default BatchService;
