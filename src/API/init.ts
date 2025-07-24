import cityAPI from "./cityAPI";
import clientAPI from "./clientAPI";
import countryAPI from "./countryAPI";
import discountAPI from "./discountAPI";
import educationAPI from "./educationAPI";
import genderAPI from "./genderAPI";
import identificationAPI from "./identificationAPI";
import maritalStatusAPI from "./maritalStatusAPI";
import medicalProfileAPI from "./medicalProfileAPI";
import occupationAPI from "./occupationAPI";
import paymentAPI from "./paymentAPI";
import paymentDataAPI from "./paymentDataAPI";
import paymentStatusAPI from "./paymentStatusAPI";
import personAPI from "./personAPI";
import phoneAPI from "./phoneAPI";
import professionalAPI from "./professionalAPI";
import professionalServiceAPI from "./professionalServiceAPI";
import receiptAPI from "./receiptAPI";
import roleAPI from "./roleAPI";
import scheduleAPI from "./scheduleAPI";
import serviceAPI from "./serviceAPI";
import staffAPI from "./staffAPI";
import stateAPI from "./stateAPI";
import userAccountAPI from "./userAccountAPI";
import userAccountStatusAPI from "./userAccountStatusAPI";
import workerScheduleAPI from "./workerScheduleAPI";
import appointmentAPI from "./appointmentAPI";
import appointmentReportAPI from "./appointmentReportAPI";
import appointmentStatusAPI from "./appointmentStatusAPI";

type Loader = {
  name: string;
  fn: () => Promise<{ data: any }>;
};

const loaders: Loader[] = [
  { name: "cities", fn: cityAPI.getAllCities },
  { name: "clients", fn: clientAPI.getAllClients },
  { name: "countries", fn: countryAPI.getAllCountries },
  { name: "discounts", fn: discountAPI.getAllDiscounts },
  { name: "educations", fn: educationAPI.getAllEducations },
  { name: "genders", fn: genderAPI.getAllGenders },
  { name: "identifications", fn: identificationAPI.getAllIdentifications },
  { name: "maritalStatuses", fn: maritalStatusAPI.getAllMaritalStatuses },
  { name: "medicalProfiles", fn: medicalProfileAPI.getAllMedicalProfiles },
  { name: "occupations", fn: occupationAPI.getAllOccupations },
  { name: "payments", fn: paymentAPI.getAllPayments },
  { name: "paymentData", fn: paymentDataAPI.getAllPaymentData },
  { name: "paymentStatuses", fn: paymentStatusAPI.getAllStatuses },
  { name: "people", fn: personAPI.getAllPersons },
  { name: "phones", fn: phoneAPI.getAllPhones },
  { name: "professionals", fn: professionalAPI.getAllProfessionals },
  { name: "professionalServices", fn: professionalServiceAPI.getAllProfessionalServices },
  { name: "receipts", fn: receiptAPI.getAllReceipts },
  { name: "roles", fn: roleAPI.getAllRoles },
  { name: "schedules", fn: scheduleAPI.getAllSchedules },
  { name: "services", fn: serviceAPI.getAllServices },
  { name: "staff", fn: staffAPI.getAllStaff },
  { name: "states", fn: stateAPI.getAllStates },
  { name: "userAccounts", fn: userAccountAPI.getAllUserAccounts },
  { name: "userAccountStatuses", fn: userAccountStatusAPI.getAllStatuses },
  { name: "workerSchedules", fn: workerScheduleAPI.getAllWorkerSchedules },
  { name: "appointments", fn: appointmentAPI.getAllAppointments },
  { name: "appointmentReports", fn: appointmentReportAPI.getAllReports },
  { name: "appointmentStatuses", fn: appointmentStatusAPI.getAllStatuses },
];

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
