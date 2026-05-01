// FINAL
import type { AxiosResponse } from "axios";
import api from "@API/api";
import type { AppointmentReport } from "@/typesResponse/AppointmentReport";
import type { ReportRequest } from "@/typesRequest/ReportRequest";

const appointmentReportAPI = {
  getAllReports: async (): Promise<AppointmentReport[]> =>
    (await api.get(`/appointment-report`)).data,

  createReport: async (data: ReportRequest): Promise<AxiosResponse> => {
    return api.post(`/appointment/create-report`, data);
  },
};

export default appointmentReportAPI;
