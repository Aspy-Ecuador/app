import axios, { AxiosResponse } from 'axios';
import apiURL from './apiConfig';

interface AppointmentData {
  payment_data: {
    type: string;         // Payment type (e.g., 'Transferencia')
    number: number;       // Payment number
    file: string;         // Payment file reference
  };
  payment: {
    person_id: number;    // ID of the person (client)
    service_id: number;   // Service ID (e.g., 3 for "Consulta General")
    service_price: number; // Service price
    total_amount: number; // Total amount to be paid
  };
  scheduled_by: number;    // ID of the person scheduling the appointment
  worker_schedule_id: number; // ID of the worker schedule
}

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const appointmentAPI = {
  // Get all appointments
  getAllAppointments: async (): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/appointment`, config);
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<AxiosResponse> => {
    return axios.get(`${apiURL}/appointment/${id}`, config);
  },

  // Create a new appointment
  createAppointment: async (appointmentData: AppointmentData): Promise<AxiosResponse> => {
    return axios.post(`${apiURL}/appointment`, appointmentData, config);
  },

  // Update appointment by ID
  updateAppointment: async (id: string, appointmentData: { status: number }): Promise<AxiosResponse> => {
    return axios.put(`${apiURL}/appointment/${id}`, appointmentData, config);
  },

  // Delete appointment by ID
  deleteAppointment: async (id: string): Promise<AxiosResponse> => {
    return axios.delete(`${apiURL}/appointment/${id}`, config);
  },
};

export default appointmentAPI;
