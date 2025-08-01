import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { PaymentRequest } from "@/types/PaymentRequest";
import { getConfig } from "./config";

const appointmentAPI = {
  // Get all appointments
  getAllAppointments: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/appointment`, getConfig());
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/appointment/${id}`, getConfig());
  },

  // Create a new appointment
  createAppointment: async (
    appointmentData: PaymentRequest
  ): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/appointment`, appointmentData, getConfig());
  },

  // Update appointment by ID
  updateAppointment: async (
    id: string,
    appointmentData: { status: number }
  ): Promise<AxiosResponse> => {
    return axios.put(
      `${apiURL}/appointment/${id}`,
      appointmentData,
      getConfig()
    );
  },

  // Delete appointment by ID
  deleteAppointment: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/appointment/${id}`, getConfig());
  },
};

export default appointmentAPI;
