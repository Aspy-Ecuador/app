import type { AxiosResponse } from "axios";
import api from "@API/api";
import { AppointmentReportRequest } from "@/typesRequest/AppointmentReportRequest";
import type { AppointmentReport } from "@/typesResponse/AppointmentReport";

const appointmentReportAPI = {
  getAllReports: async (): Promise<AppointmentReport[]> =>
    (await api.get(`/appointment-report`)).data,

  getReportById: async (id: string): Promise<AppointmentReport> =>
    (await api.get(`/appointment-report/${id}`)).data,

  createReport: async (
    data: AppointmentReportRequest,
  ): Promise<AxiosResponse> => api.post(`/appointment-report`, data),

  updateReport: async (
    id: string,
    data: AppointmentReportRequest,
  ): Promise<AxiosResponse> => api.put(`/appointment-report/${id}`, data),

  deleteReport: async (id: string): Promise<AxiosResponse> =>
    api.delete(`/appointment-report/${id}`),
};

export default appointmentReportAPI;
