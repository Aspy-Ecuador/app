import axios, { AxiosResponse } from 'axios';
import apiURL from './apiConfig';

interface PaymentDataStructure {
  type: string;              // Type of payment (e.g., 'Credit Card', 'Transfer')
  number: number;            // Payment reference number
  file: string;              // Payment receipt or reference file
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const paymentDataAPI = {
  // Get all payment data
  getAllPaymentData: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/payment-data`, config);
  },

  // Get payment data by ID
  getPaymentDataById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/payment-data/${id}`, config);
  },

  // Create new payment data
  createPaymentData: async (paymentData: PaymentDataStructure): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/payment-data`, paymentData, config);
  },

  // Update payment data by ID
  updatePaymentData: async (id: string, paymentData: PaymentDataStructure): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/payment-data/${id}`, paymentData, config);
  },

  // Delete payment data by ID
  deletePaymentData: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/payment-data/${id}`, config);
  },
};

export default paymentDataAPI;
