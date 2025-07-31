import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { PaymentRequest } from "@/types/PaymentRequest";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

const appointmentAPI = {
  create: async (): Promise<AxiosResponse> => {
    return axios.post(
      `${apiURL}/professional-service`,
      { service_id: 2, person_id: 6 },
      config
    );
  },
  create2: async (): Promise<AxiosResponse> => {
    return axios.post(
      `${apiURL}/worker-schedule`,
      {
        date: "2025-07-10",
        start_time: "9:00:00",
        end_time: "10:00:00",
        name: "Turno Mañana",
        person_id: 6,
      },
      config
    );
  },
  // Get all appointments
  getAllAppointments: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/appointment`, config);
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/appointment/${id}`, config);
  },

  // Create a new appointment
  createAppointment: async (
    appointmentData: PaymentRequest
  ): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/appointment`, appointmentData, config);
  },

  // Update appointment by ID
  updateAppointment: async (
    id: string,
    appointmentData: { status: number }
  ): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/appointment/${id}`, appointmentData, config);
  },

  // Delete appointment by ID
  deleteAppointment: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/appointment/${id}`, config);
  },
};

export default appointmentAPI;
