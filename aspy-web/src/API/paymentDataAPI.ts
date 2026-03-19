import { AxiosResponse } from "axios";
import api from "@API/api";

interface PaymentDataStructure {
  type: string; // Type of payment (e.g., 'Credit Card', 'Transfer')
  number: number; // Payment reference number
  file: string; // Payment receipt or reference file
}

const paymentDataAPI = {
  // Get all payment data
  getAllPaymentData: async (): Promise<AxiosResponse> => {
    return api.get(`/payment-data`);
  },

  // Get payment data by ID
  getPaymentDataById: async (id: string): Promise<AxiosResponse> => {
    return api.get(`/payment-data/${id}`);
  },

  // Create new payment data
  createPaymentData: async (
    paymentData: PaymentDataStructure,
  ): Promise<AxiosResponse> => {
    return api.post(`/payment-data`, paymentData);
  },

  // Update payment data by ID
  updatePaymentData: async (
    id: string,
    paymentData: PaymentDataStructure,
  ): Promise<AxiosResponse> => {
    return api.put(`/payment-data/${id}`, paymentData);
  },

  // Delete payment data by ID
  deletePaymentData: async (id: string): Promise<AxiosResponse> => {
    return api.delete(`/payment-data/${id}`);
  },
};

export default paymentDataAPI;
