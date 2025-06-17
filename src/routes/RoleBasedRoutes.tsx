import React from "react";
import { Routes as RRDRoutes, Route } from "react-router-dom";
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
  Admin: AdminLayout,
  Staff: StaffLayout,
  Professional: ProfessionalLayout,
  Client: ClientLayout,
};

const RoleBasedRoutes = () => {
  const xThemeComponents = {};
  const role = getAuthenticatedUserRole() as Role;
  const Layout = layouts[role];
  const routes = Routes[role];

  return (
    <RRDRoutes>
      <Route
        path="/"
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
    </RRDRoutes>
  );
};

export default RoleBasedRoutes;
