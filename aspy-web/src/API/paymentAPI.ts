import { AxiosResponse } from "axios";
import api from "@API/api";
import { StatusRequest } from "@/typesRequest/StatusRequest";
import { Payment } from "@/typesResponse/Payment";

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
  getAllPayments: async (): Promise<Payment[]> =>
    (await api.get(`/payment`)).data,

  // Get payment by ID
  getPaymentById: async (id: string): Promise<Payment> =>
    (await api.get(`/payment/${id}`)).data,

  // Create a new payment
  createPayment: async (paymentData: PaymentData): Promise<AxiosResponse> => {
    return api.post(`/payment`, paymentData);
  },

  // Update payment by ID
  updatePayment: async (
    id: string,
    paymentData: PaymentData,
  ): Promise<AxiosResponse> => {
    return api.put(`/payment/${id}`, paymentData);
  },

  updateStatus: async (
    id: number,
    status: StatusRequest,
  ): Promise<AxiosResponse> => {
    return api.put(`/paymentstatus/${id}`, status);
  },

  // Delete payment by ID
  deletePayment: async (id: string): Promise<AxiosResponse> => {
    return api.delete(`/payment/${id}`);
  },
};

export default paymentAPI;
