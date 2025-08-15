import { createContext, useContext, useEffect, useState } from "react";
import { loadersByRole, UserRole } from "./loadersMap";
import { getAuthenticatedUser } from "@/utils/store";
import serviceAPI from "@/API/serviceAPI";
import { Service } from "@/types/Service";

type DataStore = Record<string, any>;

type RoleDataContextType = {
  data: DataStore;
  loading: boolean;
  refreshData: () => Promise<void>;
  refreshServices: () => Promise<void>;
};

const RoleDataContext = createContext<RoleDataContextType>({
  data: {},
  loading: true,
  refreshData: async () => { },
  refreshServices: async () => { },
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
        value = value.map((s: any) => ({
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

    console.log("📦 Datos crudos de API:", normalized.map((s: Service) => s.id_serice));
    console.log("🔍 Tipos de ID:", normalized.map((s: Service) => typeof s.id_serice));

    const orderedServices = [...normalized].sort(
      (a: Service, b: Service) => Number(a.id_serice) - Number(b.id_serice)
    );

    console.log("✅ Datos ordenados:", orderedServices.map((s: Service) => s.id_serice));

    localStorage.setItem("services", JSON.stringify(orderedServices));
    setData((prev) => ({ ...prev, services: orderedServices }));

    console.log("✔️ Servicios actualizados y ordenados por ID");
  } catch (err) {
    console.error("❌ Error al refrescar servicios:", err);
  }
};

  useEffect(() => {
    refreshData();
  }, [role]); // se recarga si cambia el rol

  return (
    <RoleDataContext.Provider value={{ data, loading, refreshData, refreshServices }}>
      {children}
    </RoleDataContext.Provider>
  );
};

export const useRoleData = () => useContext(RoleDataContext);
