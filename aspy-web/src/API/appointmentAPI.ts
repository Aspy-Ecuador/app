import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { AppointmentRequest } from "@/typesRequest/AppointmentRequest";
import type { Appointment } from "@/typesResponse/Appointment";

const appointmentAPI = {
  getAllAppointments: async (): Promise<Appointment[]> =>
    (await api.get(`/appointment`)).data,

  getAppointmentById: async (id: string): Promise<AxiosResponse> => {
    return api.get(`/appointment/${id}`);
  },

  createAppointment: async (
    data: AppointmentRequest,
  ): Promise<AxiosResponse> => {
    return api.post(`/appointment/appointment-create`, data);
  },

  updateAppointment: async (
    id: number,
    appointmentData: { status: number },
  ): Promise<AxiosResponse> => {
    return api.put(`/appointment/${id}`, appointmentData);
  },

  deleteAppointment: async (id: string): Promise<AxiosResponse> => {
    return api.delete(`/appointment/${id}`);
  },
};

export default appointmentAPI;
