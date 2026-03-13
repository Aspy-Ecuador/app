import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";
import { StatusRequest } from "@/typesRequest/StatusRequest";

interface PaymentData {
  person_id: number;
  service_id: number;
  discount_id?: number;
  payment_data_id: number;
  service_price: number;
  discount_percentage?: number;
  total_amount: number;
  status: number;
  created_by: string;
}

const paymentAPI = {
  // Get all payments
  getAllPayments: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/payment`, getConfig());
  },

  // Get payment by ID
  getPaymentById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/payment/${id}`, getConfig());
  },

  // Create a new payment
  createPayment: async (paymentData: PaymentData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/payment`, paymentData, getConfig());
  },

  // Update payment by ID
  updatePayment: async (
    id: string,
    paymentData: PaymentData,
  ): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/payment/${id}`, paymentData, getConfig());
  },

  updateStatus: async (
    id: number,
    status: StatusRequest,
  ): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/paymentstatus/${id}`, status, getConfig());
  },

  // Delete payment by ID
  deletePayment: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/payment/${id}`, getConfig());
  },
};

export default paymentAPI;
