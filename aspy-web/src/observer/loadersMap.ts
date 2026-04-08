import {
  runAdminLoaders,
  runClientLoaders,
  runStaffLoaders,
  runProfessionalLoaders,
  adminLoaders,
  clientLoaders,
  staffLoaders,
  professionalLoaders,
} from "@API/init";

export type UserRole = "Admin" | "Client" | "Staff" | "Professional";

export const loadersByRole: Record<UserRole, () => Promise<void>> = {
  Admin: runAdminLoaders,
  Client: runClientLoaders,
  Staff: runStaffLoaders,
  Professional: runProfessionalLoaders,
};

export const loadersArraysByRole: Record<
  UserRole,
  { name: string; fn: () => Promise<any> }[]
> = {
  Admin: adminLoaders,
  Client: clientLoaders,
  Staff: staffLoaders,
  Professional: professionalLoaders,
};
