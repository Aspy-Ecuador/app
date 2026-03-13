import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";
import { AppointmentReportRequest } from "@/typesRequest/AppointmentReportRequest";

const appointmentReportAPI = {
  getAllReports: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/appointment-reports`, getConfig()),

  getReportById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/appointment-reports/${id}`, getConfig()),

  createReport: async (data: any): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/appointment-reports`, data, getConfig()),

  updateReport: async (
    id: string,
    data: AppointmentReportRequest,
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/appointment-reports/${id}`, data, getConfig()),

  deleteReport: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/appointment-reports/${id}`, getConfig()),
};

export default appointmentReportAPI;
