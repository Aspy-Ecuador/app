import { User } from "@/types/User";
import ProfileView from "@components/ProfileView";

export default function Profile() {
  const sample_data: User = {
    id: 19,
    identity: 112244668,
    first_name: "Daniel",
    last_name: "Torres",
    middle_name: "Ignacio",
    role: "Profesional",
    photo: "",
    aboutme: "Psicoterapeuta con enfoque en terapia familiar y de pareja.",
    age: 42,
    gender: "Masculino",
    email: "dtorres@gmail.com",
    phone: "0912341234",
    address: "Calle Loja y Cuenca",
    province: "Manabí",
    city: "Portoviejo",
    password: "profesional123",
    confirmPassword: "profesional123",
    birthdate: "1982-02-14",
    occupation: "Psicoterapeuta",
    marital_status: "Casado",
    education: "Maestría",
    role_id: 3,
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
