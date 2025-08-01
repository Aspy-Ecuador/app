import {
  runAdminLoaders,
  runClientLoaders,
  runStaffLoaders,
  runProfessionalLoaders,
} from "@API/init";

export type UserRole = "Admin" | "Client" | "Staff" | "Professional";

export const loadersByRole: Record<UserRole, () => Promise<void>> = {
  Admin: runAdminLoaders,
  Client: runClientLoaders,
  Staff: runStaffLoaders,
  Professional: runProfessionalLoaders,
};
