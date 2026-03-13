import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { AppointmentRequest } from "@/typesRequest/AppointmentRequest";
import { getConfig } from "./config";

const appointmentAPI = {
  // Get all appointments
  getAllAppointments: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/appointments`, getConfig());
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/appointments/${id}`, getConfig());
  },

  // Create a new appointment
  createAppointment: async (
    appointmentData: AppointmentRequest,
  ): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/appointments`, appointmentData, getConfig());
  },

  // Update appointment by ID
  updateAppointment: async (
    id: number,
    appointmentData: { status: number },
  ): Promise<AxiosResponse> => {
    return axios.put(
      `${apiURL}/appointments/${id}`,
      appointmentData,
      getConfig(),
    );
  },

  // Delete appointment by ID
  deleteAppointment: async (id: number): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/appointments/${id}`, getConfig());
  },
};

export default appointmentAPI;
