// FINAL
import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { AppointmentRequest } from "@/typesRequest/AppointmentRequest";
import type { Appointment } from "@/typesResponse/Appointment";

const appointmentAPI = {
  getAllAppointments: async (): Promise<Appointment[]> =>
    (await api.get(`/appointment`)).data,

  createAppointment: async (
    data: AppointmentRequest,
  ): Promise<AxiosResponse> => {
    return api.post(`/appointment/appointment-create`, data);
  },

  /** El motivo es obligatorio: queda registrado en el pago y el paciente lo lee. */
  rejectAppointment: async (appointmentId: number, motivo: string): Promise<AxiosResponse> => {
    return api.put(`/appointment/appointment-reject`, {
      appointmentId: appointmentId,
      motivo,
    });
  },

  approveAppointment: async (appointmentId: number): Promise<AxiosResponse> => {
    return api.put(`/appointment/appointment-approve`, {
      appointmentId: appointmentId,
    });
  },

  completeAppointment: async (
    appointmentId: number,
  ): Promise<AxiosResponse> => {
    return api.put(`/appointment/appointment-complete`, {
      appointmentId: appointmentId,
    });
  },

  missedAppointment: async (appointmentId: number): Promise<AxiosResponse> => {
    return api.put(`/appointment/appointment-missed`, {
      appointmentId: appointmentId,
    });
  },

  cancelAppointment: async (appointmentId: number): Promise<AxiosResponse> => {
    return api.put(`/appointment/appointment-cancel`, {
      appointmentId: appointmentId,
    });
  },
};

export default appointmentAPI;
