import React from "react";
import { Route } from "react-router-dom";
import { getAuthenticatedUserRole } from "@store";
import { Routes } from "@routes/Routes";
import { Role } from "@/types/Role";
import AppTheme from "@shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";

import AdminLayout from "@layouts/AdminLayout";
import StaffLayout from "@layouts/StaffLayout";
import ProfessionalLayout from "@layouts/ProfessionalLayout";
import ClientLayout from "@layouts/ClientLayout";

const layouts: Record<Role, () => React.ReactElement> = {
  admin: AdminLayout,
  staff: StaffLayout,
  professional: ProfessionalLayout,
  client: ClientLayout,
};

const RoleBasedRoutes = () => {
  const xThemeComponents = {};
  const role = getAuthenticatedUserRole() as Role;
  const Layout = layouts[role];
  const routes = Routes[role];

  return (
    <Route
      element={
        <AppTheme themeComponents={xThemeComponents}>
          <CssBaseline enableColorScheme />
          <Layout />
        </AppTheme>
      }
    >
      {routes.map((route, i) => (
        <Route key={i} path={route.path} element={route.element} />
      ))}
    </Route>
  );
};

export default RoleBasedRoutes;
