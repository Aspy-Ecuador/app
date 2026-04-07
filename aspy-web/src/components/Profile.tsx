// FINAL
import type { UserLogin } from "@/types/UserLogin";
import ProfileView from "@components/ProfileView";

export default function Profile() {
  const getUserInfoFromLocalStorage = (): UserLogin => {
    const UserAccountInfo = localStorage.getItem("authenticatedUser");
    if (UserAccountInfo) {
      const userAccounts = JSON.parse(UserAccountInfo);
      console.log("User info loaded from localStorage:", userAccounts);
      return userAccounts as UserLogin;
    }
    return {} as UserLogin;
  };

  const user = getUserInfoFromLocalStorage();

  return (
    <div>
      <ProfileView user={user} isRowPosition={true} />
    </div>
  );
}
