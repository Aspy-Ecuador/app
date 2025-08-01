import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";

interface PaymentData {
  person_id: number; // Person ID associated with the payment
  service_id: number; // Service ID related to the payment
  discount_id?: number; // Optional, discount ID applied
  payment_data_id: number; // Payment data ID (e.g., credit card or bank transfer)
  service_price: number; // Service price
  discount_percentage?: number; // Optional, discount percentage
  total_amount: number; // Total amount to be paid
  status: number; // Payment status (e.g., 'completed', 'pending')
  created_by: string; // Creator of the payment
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
    paymentData: PaymentData
  ): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/payment/${id}`, paymentData, getConfig());
  },

  // Delete payment by ID
  deletePayment: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/payment/${id}`, getConfig());
  },
};

export default paymentAPI;
