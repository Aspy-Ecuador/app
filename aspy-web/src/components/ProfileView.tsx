import { User } from "@/types/User";
import penToSquare from "@assets/pen-to-square.svg";
import { getAge, getGender } from "@/utils/utils";
import { UserLogin } from "@/types/UserLogin";
import photo from "@assets/user.png";
import { useNavigate } from "react-router-dom";

type ProfileProps = {
  user: User | UserLogin;
  isRowPosition: boolean;
};

export default function ProfileView({ user, isRowPosition }: ProfileProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editar/${user.user_id}`);
  };

  return (
    <div
      className={`flex ${isRowPosition ? "flex-col md:flex-row" : "flex-col"} justify-center gap-16 p-8 m-8`}
    >
      <div className="flex flex-col gap-16 items-center">
        <img
          className="rounded-full w-[200px] h-auto"
          src={photo}
          alt={user.first_name}
        />
        <div className="flex flex-col gap-1 justify-center items-center">
          <h1 className="font-kumbh text-primaryAspy font-semibold text-base">
            {user.full_name}
          </h1>
          <h2 className="font-kumbh text-secondaryAspy text-sm">
            {user.role.name}
          </h2>
        </div>
        <img
          src={penToSquare}
          onClick={handleEdit}
          className="fill-gray-200 size-8 cursor-pointer"
          alt="Editar perfil"
        />
      </div>
      <div className="flex flex-col gap-16 items-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-kumbh text-primaryAspy font-semibold text-base">
            Sobre mí
          </h1>
          <p className="font-kumbh text-sm text-secondaryAspy">
            Hola, soy {user.role.name} en Fundación ASPY :)
          </p>
        </div>
        <div className="flex flex-row gap-16">
          <div className="flex flex-col gap-2">
            <h2 className="font-kumbh text-primaryAspy font-semibold text-base">
              Edad
            </h2>
            <p className="font-kumbh text-sm text-secondaryAspy">
              {getAge(user.birthdate)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-kumbh text-primaryAspy font-semibold text-base">
              Género
            </h2>
            <p className="font-kumbh text-sm text-secondaryAspy">
              {getGender(user.gender)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
