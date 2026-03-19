import { AxiosResponse } from "axios";
import api from "@API/api";

interface ReceiptData {
  appointment_id: number;
  file_url: string;
}

const receiptAPI = {
  getAllReceipts: async (): Promise<AxiosResponse> => api.get(`/receipt`),

  getReceiptById: async (id: string): Promise<AxiosResponse> =>
    api.get(`/receipt/${id}`),

  createReceipt: async (data: any): Promise<AxiosResponse> =>
    api.post(`/receipt`, data),

  updateReceipt: async (
    id: string,
    data: ReceiptData,
  ): Promise<AxiosResponse> => api.put(`/receipt/${id}`, data),

  deleteReceipt: async (id: string): Promise<AxiosResponse> =>
    api.delete(`/receipt/${id}`),
};

export default receiptAPI;
