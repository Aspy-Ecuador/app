import { User } from "@/types/User";
import ProfileView from "@components/ProfileView";

export default function Profile() {
  const handleImageClick = () => {
    alert("Edicion!");
  };

  const getUserInfoFromLocalStorage = (): User => {
    // query para obtener id = numericId
    const UserAccountInfo = localStorage.getItem("authenticatedUser");
    if (UserAccountInfo) {
      const userAccounts = JSON.parse(UserAccountInfo);
      return userAccounts as User;
    }
    return {} as User;
  };

  //const user_from_local_storage = getUserFromLocalStorage();

  const user = getUserInfoFromLocalStorage();

  return (
    <div>
      <ProfileView user={user} onEdit={handleImageClick} isRowPosition={true} />
    </div>
  );
}
