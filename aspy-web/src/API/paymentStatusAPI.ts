import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface PaymentStatusData {
  name: string;            // Name of the payment status (e.g., 'Paid', 'Pending')
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const paymentStatusAPI = {
  getAllStatuses: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/payment-status`, config),

  getStatusById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/payment-status/${id}`, config),

  createStatus: async (data: PaymentStatusData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/payment-status`, data, config),

  updateStatus: async (id: string, data: PaymentStatusData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/payment-status/${id}`, data, config),

  deleteStatus: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/payment-status/${id}`, config),
};

export default paymentStatusAPI;
