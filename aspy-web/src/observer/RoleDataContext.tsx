import { createContext, useContext, useEffect, useState } from "react";
import { loadersByRole, UserRole } from "./loadersMap";
import { getAuthenticatedUser } from "@/utils/store";
import serviceAPI from "@/API/serviceAPI";
import { Service } from "@/types/Service";
import { ProfessionalResponse } from "@/typesResponse/ProffesionalResponse";
import professionalAPI from "@/API/professionalAPI";
import { RoleResponse } from "@/typesResponse/RoleResponse";
import roleAPI from "@/API/roleAPI";
import { UserAccountResponse } from "@/typesResponse/UserAccountResponse";
import userAccountAPI from "@/API/userAccountAPI";
import { PersonResponse } from "@/typesResponse/PersonResponse";
import personAPI from "@/API/personAPI";
import { AppointmentResponse } from "@/typesResponse/AppointmentResponse";
import appointmentAPI from "@/API/appointmentAPI";
import { ScheduleResponse } from "@/typesResponse/ScheduleResponse";
import scheduleAPI from "@/API/scheduleAPI";
import { WorkerScheduleResponse } from "@/typesResponse/WorkerScheduleResponse";
import workerScheduleAPI from "@/API/workerScheduleAPI";
import paymentDataAPI from "@/API/paymentDataAPI";
import { PaymentDataResponse } from "@/typesResponse/PaymentDataResponse";
import professionalServiceAPI from "@/API/professionalServiceAPI";
import { ProfessionalServiceResponse } from "@/typesResponse/ProfessionalServiceResponse";
import receiptAPI from "@/API/receiptAPI";
import { ReceiptResponse } from "@/typesResponse/ReceiptResponse";
import appointmentReportAPI from "@/API/appointmentReportAPI";
import { AppointmentReportResponse } from "@/typesResponse/AppointmentReportResponse";
import paymentAPI from "@/API/paymentAPI";
import { PaymentResponse } from "@typesResponse/PaymentResponse";

type RoleDataContextType = {
  loading: boolean;
  refreshData: () => Promise<void>;
  refreshServices: () => Promise<void>;
  refreshPersons: () => Promise<void>;
  refreshUserAccounts: () => Promise<void>;
  refreshProfessionals: () => Promise<void>;
  refreshSchedules: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  refreshWorkerSchedules: () => Promise<void>;
  refreshPaymentData: () => Promise<void>;
  refreshProfessionalServices: () => Promise<void>;
  refreshReceipts: () => Promise<void>;
  refreshAppointmentReports: () => Promise<void>;
  refreshPayments: () => Promise<void>;
};

const RoleDataContext = createContext<RoleDataContextType>({
  loading: true,
  refreshData: async () => {},
  refreshServices: async () => {},
  refreshPersons: async () => {},
  refreshUserAccounts: async () => {},
  refreshProfessionals: async () => {},
  refreshSchedules: async () => {},
  refreshAppointments: async () => {},
  refreshWorkerSchedules: async () => {},
  refreshPaymentData: async () => {},
  refreshProfessionalServices: async () => {},
  refreshReceipts: async () => {},
  refreshAppointmentReports: async () => {},
  refreshPayments: async () => {},
});

export const RoleDataProvider = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) => {
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);

    const authUser = getAuthenticatedUser();
    if (!authUser) {
      setLoading(false);
      return;
    }

    const runLoader = loadersByRole[role];
    await runLoader();
    setLoading(false);
  };

  const refreshServices = async () => {
    try {
      const res = await serviceAPI.getAllServices();

      // Normalizamos para que todos tengan id_serice
      const normalized: Service[] = res.data.map((s: any) => ({
        ...s,
        id_serice: s.id_serice ?? s.service_id, // usa el que exista
      }));

      console.log(
        "📦 Datos crudos de API:",
        normalized.map((s: Service) => s.id_serice),
      );
      console.log(
        "🔍 Tipos de ID:",
        normalized.map((s: Service) => typeof s.id_serice),
      );

      const orderedServices = [...normalized].sort(
        (a: Service, b: Service) => Number(a.id_serice) - Number(b.id_serice),
      );

      console.log(
        "✅ Datos ordenados:",
        orderedServices.map((s: Service) => s.id_serice),
      );

      localStorage.setItem("services", JSON.stringify(orderedServices));
      setData((prev) => ({ ...prev, services: orderedServices }));

      console.log("✔️ Servicios actualizados y ordenados por ID");
    } catch (err) {
      console.error("❌ Error al refrescar servicios:", err);
    }
  };

  const refreshPersons = async () => {
    try {
      const res = await personAPI.getAllPersons();
      const ordered = [...res.data].sort(
        (a: PersonResponse, b: PersonResponse) => a.person_id - b.person_id,
      );

      localStorage.setItem("persons", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, persons: ordered }));
      console.log("✔️ Persons actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar persons:", err);
    }
  };

  const refreshUserAccounts = async () => {
    try {
      const res = await userAccountAPI.getAllUserAccounts();
      const ordered = [...res.data].sort(
        (a: UserAccountResponse, b: UserAccountResponse) =>
          a.user_account_id - b.user_account_id,
      );

      localStorage.setItem("userAccounts", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, userAccounts: ordered }));
      console.log("✔️ UserAccounts actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar userAccounts:", err);
    }
  };

  const refreshProfessionals = async () => {
    try {
      const res = await professionalAPI.getAllProfessionals();
      const ordered = [...res.data].sort(
        (a: ProfessionalResponse, b: ProfessionalResponse) =>
          a.person_id - b.person_id,
      );

      localStorage.setItem("professional", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, professional: ordered }));
      console.log("✔️ Professionals actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar professionals:", err);
    }
  };

  const refreshSchedules = async () => {
    try {
      const res = await scheduleAPI.getAllSchedules();
      const ordered = [...res.data].sort(
        (a: ScheduleResponse, b: ScheduleResponse) =>
          a.schedule_id - b.schedule_id,
      );

      localStorage.setItem("schedules", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, schedules: ordered }));
      console.log("✔️ Schedules actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar schedules:", err);
    }
  };

  const refreshAppointments = async () => {
    try {
      const res = await appointmentAPI.getAllAppointments();
      const ordered = [...res.data].sort(
        (a: AppointmentResponse, b: AppointmentResponse) =>
          a.appointment_id - b.appointment_id,
      );

      localStorage.setItem("appointments", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, appointments: ordered }));
      console.log("✔️ Appointments actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar appointments:", err);
    }
  };

  const refreshWorkerSchedules = async () => {
    try {
      const res = await workerScheduleAPI.getAllWorkerSchedules();
      const ordered = [...res.data].sort(
        (a: WorkerScheduleResponse, b: WorkerScheduleResponse) =>
          a.worker_schedule_id - b.worker_schedule_id,
      );

      localStorage.setItem("workerSchedules", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, workerSchedules: ordered }));
      console.log("✔️ WorkerSchedules actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar workerSchedules:", err);
    }
  };

  const refreshPaymentData = async () => {
    try {
      const res = await paymentDataAPI.getAllPaymentData();
      const ordered = [...res.data].sort(
        (a: PaymentDataResponse, b: PaymentDataResponse) =>
          a.payment_data_id - b.payment_data_id,
      );

      localStorage.setItem("paymentData", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, paymentData: ordered }));
      console.log("✔️ PaymentData actualizado");
    } catch (err) {
      console.error("❌ Error al refrescar paymentData:", err);
    }
  };

  const refreshProfessionalServices = async () => {
    try {
      const res = await professionalServiceAPI.getAllProfessionalServices();
      const ordered = [...res.data].sort(
        (a: ProfessionalServiceResponse, b: ProfessionalServiceResponse) =>
          a.professional_service_id - b.professional_service_id,
      );

      localStorage.setItem("professionalServices", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, professionalServices: ordered }));
      console.log("✔️ ProfessionalServices actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar professionalServices:", err);
    }
  };

  const refreshReceipts = async () => {
    try {
      const res = await receiptAPI.getAllReceipts();
      const ordered = [...res.data].sort(
        (a: ReceiptResponse, b: ReceiptResponse) => a.receipt_id - b.receipt_id,
      );

      localStorage.setItem("receipts", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, receipts: ordered }));
      console.log("✔️ Receipts actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar receipts:", err);
    }
  };

  const refreshAppointmentReports = async () => {
    try {
      const res = await appointmentReportAPI.getAllReports();
      const ordered = [...res.data].sort(
        (a: AppointmentReportResponse, b: AppointmentReportResponse) =>
          a.appointment_report_id - b.appointment_report_id,
      );

      localStorage.setItem("appointmentReports", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, appointmentReports: ordered }));
      console.log("✔️ AppointmentReports actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar appointmentReports:", err);
    }
  };

  const refreshPayments = async () => {
    try {
      const res = await paymentAPI.getAllPayments();
      const ordered = [...res.data].sort(
        (a: PaymentResponse, b: PaymentResponse) => a.payment_id - b.payment_id,
      );

      localStorage.setItem("payments", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, payments: ordered }));
      console.log("✔️ Payments actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar payments:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [role]);

  return (
    <RoleDataContext.Provider
      value={{
        loading,
        refreshData,
        refreshServices,
        refreshPersons,
        refreshUserAccounts,
        refreshProfessionals,
        refreshSchedules,
        refreshAppointments,
        refreshWorkerSchedules,
        refreshPaymentData,
        refreshProfessionalServices,
        refreshReceipts,
        refreshAppointmentReports,
        refreshPayments,
      }}
    >
      {children}
    </RoleDataContext.Provider>
  );
};

export const useRoleData = () => useContext(RoleDataContext);
