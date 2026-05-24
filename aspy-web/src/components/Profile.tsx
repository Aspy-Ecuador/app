// FINAL
import type { UserLogin } from "@/types/UserLogin";
import ProfileView from "@components/ProfileView";
import Box from "@mui/material/Box";
import SimpleHeader from "@components/SimpleHeader";

export default function Profile() {
  const getUserInfoFromLocalStorage = (): UserLogin => {
    const raw = localStorage.getItem("authenticatedUser");
    return raw ? (JSON.parse(raw) as UserLogin) : ({} as UserLogin);
  };

  const user = getUserInfoFromLocalStorage();
  console.log("User info from localStorage:", user);
  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Mi perfil" chip="Cuenta" />
      <ProfileView user={user} isRowPosition={true} />
    </Box>
  );
}
