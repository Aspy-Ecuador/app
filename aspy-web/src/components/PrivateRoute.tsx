/*
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
*/
// src/routes/PrivateRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { RoleDataProvider } from "@/observer/RoleDataContext";
import { UserRole } from "@/observer/loadersMap";
import { getAuthenticatedUserRole } from "@/utils/store";

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  const role = getAuthenticatedUserRole() as UserRole | null;

  if (!token) return <Navigate to="/login" replace />;
  if (!role) return <Navigate to="/login" replace />;

  return (
    <RoleDataProvider role={role}>
      <Outlet />
    </RoleDataProvider>
  );
};

export default PrivateRoute;
