import axios, { AxiosResponse } from 'axios';
import apiURL from "./apiConfig";


interface DiscountData {
  name: string;           // Name of the discount
  discount: number;       // Discount percentage
  created_by: string;     // Creator of the discount
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const discountAPI = {
  // Get all discounts
  getAllDiscounts: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/discount`, config);
  },

  // Get discount by ID
  getDiscountById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/discount/${id}`, config);
  },

  // Create a new discount
  createDiscount: async (discountData: DiscountData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/discount`, discountData, config);
  },

  // Update discount by ID
  updateDiscount: async (id: string, discountData: DiscountData): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/discount/${id}`, discountData, config);
  },

  // Delete discount by ID
  deleteDiscount: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/discount/${id}`, config);
  },
};

export default discountAPI;
