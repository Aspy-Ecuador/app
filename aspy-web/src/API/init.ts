//import paymentAPI from "./paymentAPI";
import paymentDataAPI from "./paymentDataAPI";
import professionalServiceAPI from "./professionalServiceAPI";
import receiptAPI from "./receiptAPI";
import scheduleAPI from "./scheduleAPI";
import serviceAPI from "./serviceAPI";
import workerScheduleAPI from "./workerScheduleAPI";
import appointmentAPI from "./appointmentAPI";
import appointmentReportAPI from "./appointmentReportAPI";
import userAccountAPI from "./userAccountAPI";
import personAPI from "./personAPI";
import roleAPI from "./roleAPI";
import professionalAPI from "./professionalAPI";
import paymentAPI from "./paymentAPI";

type Loader<T = unknown> = {
  name: string;
  fn: () => Promise<T>;
};

export const adminLoaders: Loader[] = [
  { name: "services", fn: serviceAPI.getAllServices },
  { name: "appointments", fn: appointmentAPI.getAllAppointments },
  { name: "persons", fn: personAPI.getAllPersons },
  { name: "payments", fn: paymentAPI.getAllPayments },
];

export const clientLoaders: Loader[] = [
  { name: "services", fn: serviceAPI.getAllServices },
  { name: "appointments", fn: appointmentAPI.getAllAppointments },
  { name: "persons", fn: personAPI.getAllPersons },
  { name: "payments", fn: paymentAPI.getAllPayments },
  { name: "appointmentReports", fn: appointmentReportAPI.getAllReports },
  {
    name: "proServices",
    fn: professionalServiceAPI.getAllProfessionalServices,
  },
  { name: "workerProfessional", fn: workerScheduleAPI.getAllWorkerSchedules },
];

export const staffLoaders: Loader[] = [
  { name: "payments", fn: paymentAPI.getAllPayments },
  {
    name: "proServices",
    fn: professionalServiceAPI.getAllProfessionalServices,
  },
  { name: "services", fn: serviceAPI.getAllServices },
  { name: "workerProfessional", fn: workerScheduleAPI.getAllWorkerSchedules },
  { name: "appointments", fn: appointmentAPI.getAllAppointments },
  { name: "persons", fn: personAPI.getAllPersons },
];

export const professionalLoaders: Loader[] = [
  { name: "payments", fn: paymentAPI.getAllPayments },
  {
    name: "proServices",
    fn: professionalServiceAPI.getAllProfessionalServices,
  },

  { name: "services", fn: serviceAPI.getAllServices },

  { name: "workerProfessional", fn: workerScheduleAPI.getAllWorkerSchedules },
  { name: "appointments", fn: appointmentAPI.getAllAppointments },
  { name: "appointmentReports", fn: appointmentReportAPI.getAllReports },
  { name: "persons", fn: personAPI.getAllPersons },
];

// Recorrers para cada tipo
export const runAdminLoaders = async () => {
  console.log("Initializing data...");
  const token = localStorage.getItem("token");
  if (!token) return;

  for (const { name, fn } of adminLoaders) {
    try {
      const response = await fn();
      localStorage.setItem(name, JSON.stringify(response));
      console.log(`✔️ Loaded: ${name}`);
    } catch (error) {
      console.error(`❌ Error loading ${name}:`, error);
    }
  }
};

export const runClientLoaders = async () => {
  console.log("Initializing data...");
  const token = localStorage.getItem("token");
  if (!token) return;

  for (const { name, fn } of clientLoaders) {
    try {
      const response = await fn();
      localStorage.setItem(name, JSON.stringify(response));
      console.log(`✔️ Loaded: ${name}`);
    } catch (error) {
      console.error(`❌ Error loading ${name}:`, error);
    }
  }
};

export const runStaffLoaders = async () => {
  console.log("Initializing data...");
  const token = localStorage.getItem("token");
  if (!token) return;

  for (const { name, fn } of staffLoaders) {
    try {
      const response = await fn();
      localStorage.setItem(name, JSON.stringify(response));
      console.log(`✔️ Loaded: ${name}`);
    } catch (error) {
      console.error(`❌ Error loading ${name}:`, error);
    }
  }
};

export const runProfessionalLoaders = async () => {
  console.log("Initializing data...");
  const token = localStorage.getItem("token");
  if (!token) return;

  for (const { name, fn } of professionalLoaders) {
    try {
      const response = await fn();
      localStorage.setItem(name, JSON.stringify(response));
      console.log(`✔️ Loaded: ${name}`);
    } catch (error) {
      console.error(`❌ Error loading ${name}:`, error);
    }
  }
};
/*
export const initData = async (): Promise<void> => {
  console.log("Initializing data...");
  const token = localStorage.getItem("token");
  if (!token) return;

  for (const { name, fn } of loaders) {
    try {
      const response = await fn();
      localStorage.setItem(name, JSON.stringify(response.data));
      console.log(`✔️ Loaded: ${name}`);
    } catch (error) {
      console.error(`❌ Error loading ${name}:`, error);
    }
  }
};
*/
