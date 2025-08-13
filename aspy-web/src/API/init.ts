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

type Loader = {
  name: string;
  fn: () => Promise<{ data: any }>;
};

const adminLoaders: Loader[] = [
  { name: "services", fn: serviceAPI.getAllServices },
  { name: "userAccounts", fn: userAccountAPI.getAllUserAccounts },
  { name: "appointments", fn: appointmentAPI.getAllAppointments },
  { name: "appointmentReports", fn: appointmentReportAPI.getAllReports },
  { name: "persons", fn: personAPI.getAllPersons },
  { name: "roles", fn: roleAPI.getAllRoles },
  { name: "professional", fn: professionalAPI.getAllProfessionals },
];

const clientLoaders: Loader[] = [
  { name: "persons", fn: personAPI.getAllPersons },
  //{ name: "payments", fn: paymentAPI.getAllPayments },
  { name: "paymentData", fn: paymentDataAPI.getAllPaymentData },
  {
    name: "professionalServices",
    fn: professionalServiceAPI.getAllProfessionalServices,
  },
  { name: "receipts", fn: receiptAPI.getAllReceipts },
  { name: "schedules", fn: scheduleAPI.getAllSchedules },
  { name: "services", fn: serviceAPI.getAllServices },
  { name: "userAccounts", fn: userAccountAPI.getAllUserAccounts },
  { name: "workerSchedules", fn: workerScheduleAPI.getAllWorkerSchedules },
  { name: "appointments", fn: appointmentAPI.getAllAppointments },
  { name: "appointmentReports", fn: appointmentReportAPI.getAllReports },
  { name: "roles", fn: roleAPI.getAllRoles },
];

const staffLoaders: Loader[] = [
  //{ name: "payments", fn: paymentAPI.getAllPayments },
  { name: "paymentData", fn: paymentDataAPI.getAllPaymentData },
  {
    name: "professionalServices",
    fn: professionalServiceAPI.getAllProfessionalServices,
  },
  { name: "receipts", fn: receiptAPI.getAllReceipts },
  { name: "schedules", fn: scheduleAPI.getAllSchedules },
  { name: "services", fn: serviceAPI.getAllServices },
  { name: "userAccounts", fn: userAccountAPI.getAllUserAccounts },
  { name: "workerSchedules", fn: workerScheduleAPI.getAllWorkerSchedules },
  { name: "appointments", fn: appointmentAPI.getAllAppointments },
  { name: "appointmentReports", fn: appointmentReportAPI.getAllReports },
  { name: "persons", fn: personAPI.getAllPersons },
];

const professionalLoaders: Loader[] = [
  //{ name: "payments", fn: paymentAPI.getAllPayments },
  { name: "paymentData", fn: paymentDataAPI.getAllPaymentData },
  {
    name: "professionalServices",
    fn: professionalServiceAPI.getAllProfessionalServices,
  },
  { name: "receipts", fn: receiptAPI.getAllReceipts },
  { name: "schedules", fn: scheduleAPI.getAllSchedules },
  { name: "services", fn: serviceAPI.getAllServices },
  { name: "userAccounts", fn: userAccountAPI.getAllUserAccounts },
  { name: "workerSchedules", fn: workerScheduleAPI.getAllWorkerSchedules },
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
      localStorage.setItem(name, JSON.stringify(response.data));
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
      localStorage.setItem(name, JSON.stringify(response.data));
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
      localStorage.setItem(name, JSON.stringify(response.data));
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
      localStorage.setItem(name, JSON.stringify(response.data));
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
