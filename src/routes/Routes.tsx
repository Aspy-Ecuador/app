// routes/routes.ts
import { AdminRoutes } from "./AdminRoutes";
import { StaffRoutes } from "./StaffRoutes";
import { ProfessionalRoutes } from "./ProfessionalRoutes";
import { ClientRoutes } from "./ClientRoutes";

export const Routes = {
  admin: AdminRoutes,
  staff: StaffRoutes,
  professional: ProfessionalRoutes,
  client: ClientRoutes,
};
