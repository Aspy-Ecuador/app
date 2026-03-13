import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";
import { ReceiptRequest } from "@/typesRequest/ReceiptRequest";

interface ReceiptData {
  appointment_id: number;
  file_url: string;
}

const receiptAPI = {
  getAllReceipts: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/receipt`, getConfig()),

  getReceiptById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/receipt/${id}`, getConfig()),

  createReceipt: async (data: ReceiptRequest): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/receipt`, data, getConfig()),

  updateReceipt: async (
    id: string,
    data: ReceiptData
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/receipt/${id}`, data, getConfig()),

  deleteReceipt: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/receipt/${id}`, getConfig()),
};

export default receiptAPI;
