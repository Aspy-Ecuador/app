import axios, { AxiosResponse } from "axios";
import apiURL from "./apiConfig";
import { getConfig } from "./config";

interface AppointmentReportData {
  appointment_id: number;
  professional_id: number;
  notes: string;
  diagnosis: string;
  recommendations: string;
}

const appointmentReportAPI = {
  getAllReports: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/appointment-report`, getConfig()),

  getReportById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/appointment-report/${id}`, getConfig()),

  createReport: async (data: AppointmentReportData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/appointment-report`, data, getConfig()),

  updateReport: async (
    id: string,
    data: AppointmentReportData
  ): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/appointment-report/${id}`, data, getConfig()),

  deleteReport: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/appointment-report/${id}`, getConfig()),
};

export default appointmentReportAPI;
