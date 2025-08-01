import { createContext, useContext, useEffect, useState } from "react";
import { loadersByRole, UserRole } from "./loadersMap";

type DataStore = Record<string, any>;

type RoleDataContextType = {
  data: DataStore;
  loading: boolean;
  refreshData: () => Promise<void>;
};

const RoleDataContext = createContext<RoleDataContextType>({
  data: {},
  loading: true,
  refreshData: async () => {},
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
    const runLoader = loadersByRole[role];
    await runLoader();

    // Recoger claves del localStorage
    const keys = Object.keys(localStorage);
    const newData: DataStore = {};
    for (const key of keys) {
      try {
        newData[key] = JSON.parse(localStorage.getItem(key) ?? "null");
      } catch {
        // Ignorar errores de parseo
      }
    }
    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [role]); // se recarga si cambia el rol

  return (
    <RoleDataContext.Provider value={{ data, loading, refreshData }}>
      {children}
    </RoleDataContext.Provider>
  );
};

export const useRoleData = () => useContext(RoleDataContext);
