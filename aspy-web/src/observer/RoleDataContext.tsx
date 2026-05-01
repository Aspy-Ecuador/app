import { createContext, useContext, useEffect, useState } from "react";
import {
  loadersByRole,
  loadersArraysByRole,
  type UserRole,
} from "./loadersMap";
import { getAuthenticatedUser } from "@/utils/store";
import serviceAPI from "@/API/serviceAPI";
import professionalAPI from "@/API/professionalAPI";
import personAPI from "@/API/personAPI";
import appointmentAPI from "@/API/appointmentAPI";
import professionalServiceAPI from "@/API/professionalServiceAPI";
import appointmentReportAPI from "@/API/appointmentReportAPI";
import paymentAPI from "@/API/paymentAPI";

type DataStore = Record<string, any>;

type RoleDataContextType = {
  data: DataStore;
  loading: boolean;
  refreshData: () => Promise<void>;
  refreshServices: () => Promise<void>;
  refreshPersons: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  refreshAppointmentReports: () => Promise<void>;
  refreshPayments: () => Promise<void>;
  refreshWorkerProfessional: () => Promise<void>;
  refreshProServices: () => Promise<void>;
};

const RoleDataContext = createContext<RoleDataContextType>({
  data: {},
  loading: true,
  refreshData: async () => {},
  refreshServices: async () => {},
  refreshPersons: async () => {},
  refreshAppointments: async () => {},
  refreshAppointmentReports: async () => {},
  refreshPayments: async () => {},
  refreshWorkerProfessional: async () => {},
  refreshProServices: async () => {},
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

    const newData: DataStore = {};

    for (const loader of loadersArraysByRole[role]) {
      const value = localStorage.getItem(loader.name);

      try {
        const data = value ? JSON.parse(value) : [];
        newData[loader.name] = data;
      } catch (error) {
        console.warn(`Error parsing ${error}`);
        newData[loader.name] = [];
      }
    }

    setData(newData);
    setLoading(false);
  };

  const refreshServices = async () => {
    try {
      const res = await serviceAPI.getAllServices();
      localStorage.setItem("services", JSON.stringify(res));
      setData((prev: any) => ({ ...prev, services: res }));
      console.log("✔️ Services actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar services:", err);
    }
  };

  const refreshPersons = async () => {
    try {
      const res = await personAPI.getAllPersons();
      localStorage.setItem("persons", JSON.stringify(res));
      setData((prev: any) => ({ ...prev, persons: res }));
      console.log("✔️ Persons actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar persons:", err);
    }
  };

  const refreshAppointments = async () => {
    try {
      const res = await appointmentAPI.getAllAppointments();
      localStorage.setItem("appointments", JSON.stringify(res));
      setData((prev: any) => ({ ...prev, appointments: res }));
      console.log("✔️ Appointments actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar appointments:", err);
    }
  };

  const refreshProServices = async () => {
    try {
      const res = await professionalServiceAPI.getAllProfessionalServices();
      localStorage.setItem("proServices", JSON.stringify(res));
      setData((prev: any) => ({ ...prev, professionalServices: res }));
      console.log("✔️ ProfessionalServices actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar professionalServices:", err);
    }
  };

  const refreshWorkerProfessional = async () => {
    try {
      const res = await professionalAPI.getAllProfessionals();
      localStorage.setItem("workerProfessional", JSON.stringify(res));
      setData((prev: any) => ({ ...prev, professional: res }));
      console.log("✔️ Professionals Worker actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar professionals:", err);
    }
  };

  const refreshAppointmentReports = async () => {
    try {
      const res = await appointmentReportAPI.getAllReports();
      localStorage.setItem("appointmentReports", JSON.stringify(res));
      setData((prev: any) => ({ ...prev, appointmentReports: res }));
      console.log("✔️ AppointmentReports actualizados");
    } catch (err) {
      console.error("❌ Error al refrescar appointmentReports:", err);
    }
  };

  const refreshPayments = async () => {
    try {
      const res = await paymentAPI.getAllPayments();
      localStorage.setItem("payments", JSON.stringify(res));
      setData((prev: any) => ({ ...prev, payments: res }));
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
        data,
        loading,
        refreshData,
        refreshServices,
        refreshPersons,
        refreshAppointments,
        refreshAppointmentReports,
        refreshPayments,
        refreshWorkerProfessional,
        refreshProServices,
      }}
    >
      {children}
    </RoleDataContext.Provider>
  );
};

export const useRoleData = () => useContext(RoleDataContext);
