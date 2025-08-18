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

type DataStore = Record<string, any>;

type RoleDataContextType = {
  data: DataStore;
  loading: boolean;
  refreshData: () => Promise<void>;
  refreshServices: () => Promise<void>;
  refreshPersons: () => Promise<void>;
  refreshUserAccounts: () => Promise<void>;
  refreshRoles: () => Promise<void>;
  refreshProfessionals: () => Promise<void>;
  refreshSchedules: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  refreshWorkerSchedules: () => Promise<void>;
};

const RoleDataContext = createContext<RoleDataContextType>({
  data: {},
  loading: true,
  refreshData: async () => {},
  refreshServices: async () => {},
  refreshPersons: async () => {},
  refreshUserAccounts: async () => {},
  refreshRoles: async () => {},
  refreshProfessionals: async () => {},
  refreshSchedules: async () => {},
  refreshAppointments: async () => {},
  refreshWorkerSchedules: async () => {},
});

export const RoleDataProvider = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) => {
  const [data, setData] = useState<DataStore>({});
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

    const keys = Object.keys(localStorage);
    const newData: DataStore = {};

    for (const key of keys) {
      try {
        let value = JSON.parse(localStorage.getItem(key) ?? "null");

        // 🔹 Si la clave es "services", normalizamos y ordenamos por id_serice
        if (key === "services" && Array.isArray(value)) {
          value = value
            .map((s: any) => ({
              ...s,
              id_serice: s.id_serice ?? s.service_id, // compatibilidad con DB
            }))
            .sort((a, b) => Number(a.id_serice) - Number(b.id_serice));
        }

        newData[key] = value;
      } catch {
        // Ignorar errores de parseo
      }
    }

    setData(newData);
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
        normalized.map((s: Service) => s.id_serice)
      );
      console.log(
        "🔍 Tipos de ID:",
        normalized.map((s: Service) => typeof s.id_serice)
      );

      const orderedServices = [...normalized].sort(
        (a: Service, b: Service) => Number(a.id_serice) - Number(b.id_serice)
      );

      console.log(
        "✅ Datos ordenados:",
        orderedServices.map((s: Service) => s.id_serice)
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
        (a: PersonResponse, b: PersonResponse) => a.person_id - b.person_id
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
          a.user_id - b.user_id
      );

      localStorage.setItem("userAccounts", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, userAccounts: ordered }));
      console.log("✔️ UserAccounts actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar userAccounts:", err);
    }
  };

  const refreshRoles = async () => {
    try {
      const res = await roleAPI.getAllRoles();
      const ordered = [...res.data].sort(
        (a: RoleResponse, b: RoleResponse) => a.role_id - b.role_id
      );

      localStorage.setItem("roles", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, roles: ordered }));
      console.log("✔️ Roles actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar roles:", err);
    }
  };

  const refreshProfessionals = async () => {
    try {
      const res = await professionalAPI.getAllProfessionals();
      const ordered = [...res.data].sort(
        (a: ProfessionalResponse, b: ProfessionalResponse) =>
          a.person_id - b.person_id
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
          a.schedule_id - b.schedule_id
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
          a.appointment_id - b.appointment_id
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
          a.worker_schedule_id - b.worker_schedule_id
      );

      localStorage.setItem("workerSchedules", JSON.stringify(ordered));
      setData((prev: any) => ({ ...prev, workerSchedules: ordered }));
      console.log("✔️ WorkerSchedules actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar workerSchedules:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [role]);

  return (
    <RoleDataContext.Provider
      value={{
        data,
        loading,
        refreshData,
        refreshServices,
        refreshPersons,
        refreshUserAccounts,
        refreshRoles,
        refreshProfessionals,
        refreshSchedules,
        refreshAppointments,
        refreshWorkerSchedules,
      }}
    >
      {children}
    </RoleDataContext.Provider>
  );
};

export const useRoleData = () => useContext(RoleDataContext);
