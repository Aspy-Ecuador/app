import { AxiosResponse } from "axios";
import api from "@API/api";
import { AppointmentReportRequest } from "@/typesRequest/AppointmentReportRequest";

const appointmentReportAPI = {
  getAllReports: async (): Promise<AxiosResponse> =>
    api.get(`/appointment-report`),

  getReportById: async (id: string): Promise<AxiosResponse> =>
    api.get(`/appointment-report/${id}`),

  createReport: async (data: any): Promise<AxiosResponse> =>
    api.post(`/appointment-report`, data),

  updateReport: async (
    id: string,
    data: AppointmentReportRequest,
  ): Promise<AxiosResponse> => api.put(`/appointment-report/${id}`, data),

  deleteReport: async (id: string): Promise<AxiosResponse> =>
    api.delete(`/appointment-report/${id}`),
};

export default appointmentReportAPI;
