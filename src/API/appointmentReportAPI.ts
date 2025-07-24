import axios, { AxiosResponse } from 'axios';
import apiURL from './apiConfig';

interface AppointmentReportData {
  appointment_id: number;
  professional_id: number;
  notes: string;
  diagnosis: string;
  recommendations: string;
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const appointmentReportAPI = {
  getAllReports: async (): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/appointment-report`, config),

  getReportById: async (id: string): Promise<AxiosResponse> =>
    axios.get(`${apiURL}/appointment-report/${id}`, config),

  createReport: async (data: AppointmentReportData): Promise<AxiosResponse> =>
    axios.post(`${apiURL}/appointment-report`, data, config),

  updateReport: async (id: string, data: AppointmentReportData): Promise<AxiosResponse> =>
    axios.put(`${apiURL}/appointment-report/${id}`, data, config),

  deleteReport: async (id: string): Promise<AxiosResponse> =>
    axios.delete(`${apiURL}/appointment-report/${id}`, config),
};

export default appointmentReportAPI;
