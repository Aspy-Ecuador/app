import { User } from "@/types/User";
import ProfileView from "@components/ProfileView";

export default function Profile() {
  const sample_data: User = {
    id: 1,
    firstName: "Jhon",
    lastName: "Gonzales",
    role: "Paciente",
    aboutme: "No disponible",
    age: 35,
    gender: "Masculino",
    email: "jgonzales@gmail.com",
    identity: 123456789,
    phone: "0999273651",
    address: "Av. Quito y Los Ríos",
    province: "Pichincha", // Campo province agregado
  };

  const handleImageClick = () => {
    alert("Edicion!");
  };

  return (
    <div>
      <ProfileView
        user_info={sample_data}
        onEdit={handleImageClick}
        isRowPosition={true}
      />
    </div>
  );
}
