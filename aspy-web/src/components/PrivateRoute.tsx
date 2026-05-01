// FINAL
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { RoleDataProvider } from "@/observer/RoleDataContext";
import type { UserRole } from "@/observer/loadersMap";
import { getAuthenticatedUserRole } from "@/utils/store";

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  const role = getAuthenticatedUserRole() as UserRole | null;
  if (!role) return <Navigate to="/login" replace />;

  return (
    <RoleDataProvider role={role}>
      <Outlet />
    </RoleDataProvider>
  );
};

export default PrivateRoute;
