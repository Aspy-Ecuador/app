import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface ReceiptData {
  appointment_id: number;
  file_url: string;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const receiptAPI = {
  getAllReceipts: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/receipt`, config),

  getReceiptById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/receipt/${id}`, config),

  createReceipt: async (data: ReceiptData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/receipt`, data, config),

  updateReceipt: async (id: string, data: ReceiptData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/receipt/${id}`, data, config),

  deleteReceipt: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/receipt/${id}`, config),
};

export default receiptAPI;
