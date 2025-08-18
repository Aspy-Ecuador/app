import { UserLogin } from "@/types/UserLogin";
import ProfileView from "@components/ProfileView";

export default function Profile() {
  const getUserInfoFromLocalStorage = (): UserLogin => {
    // query para obtener id = numericId
    const UserAccountInfo = localStorage.getItem("authenticatedUser");
    if (UserAccountInfo) {
      const userAccounts = JSON.parse(UserAccountInfo);
      return userAccounts as UserLogin;
    }
    return {} as UserLogin;
  };

  //const user_from_local_storage = getUserFromLocalStorage();

  const user = getUserInfoFromLocalStorage();

  return (
    <div>
      <ProfileView user={user} isRowPosition={true} />
    </div>
  );
}
