import { AxiosResponse } from "axios";
import api from "@API/api";
import { AppointmentRequest } from "@/typesRequest/AppointmentRequest";
import { Appointment } from "@/typesResponse/Appointment";

const appointmentAPI = {
  // Get all appointments
  getAllAppointments: async (): Promise<Appointment[]> =>
    (await api.get(`/appointment`)).data,

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<AxiosResponse> => {
    return api.get(`/appointment/${id}`);
  },

  // Create a new appointment
  createAppointment: async (
    appointmentData: AppointmentRequest,
  ): Promise<AxiosResponse> => {
    return api.post(`/appointment`, appointmentData);
  },

  // Update appointment by ID
  updateAppointment: async (
    id: number,
    appointmentData: { status: number },
  ): Promise<AxiosResponse> => {
    return api.put(`/appointment/${id}`, appointmentData);
  },

  // Delete appointment by ID
  deleteAppointment: async (id: string): Promise<AxiosResponse> => {
    return api.delete(`/appointment/${id}`);
  },
};

export default appointmentAPI;
