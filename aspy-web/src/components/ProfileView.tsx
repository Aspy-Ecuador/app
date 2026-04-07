// FINAL
import type { Person } from "@/typesResponse/Person";
import type { UserLogin } from "@/types/UserLogin";
import penToSquare from "@assets/pen-to-square.svg";
import { getAge } from "@/utils/utils";
import photo from "@assets/user.png";
import { useNavigate } from "react-router-dom";

type ProfileProps = {
  user: Person | UserLogin;
  isRowPosition: boolean;
};

export default function ProfileView({ user, isRowPosition }: ProfileProps) {
  const navigate = useNavigate();
  const person = "person" in user ? user.person : user;
  const roleName =
    "person" in user ? user.role.name : user.user_account.role.name;

  const handleEdit = () => {
    navigate(`/editar/${person.user_id}`);
  };

  return (
    <div
      className={`flex ${isRowPosition ? "flex-col md:flex-row" : "flex-col"} justify-center gap-16 p-8 m-8`}
    >
      <div className="flex flex-col gap-16 items-center">
        <img
          className="rounded-full w-[200px] h-auto"
          src={photo}
          alt={person.first_name}
        />
        <div className="flex flex-col gap-1 justify-center items-center">
          <h1 className="font-kumbh text-primaryAspy font-semibold text-base">
            {person.first_name} {person.last_name}
          </h1>
          <h2 className="font-kumbh text-secondaryAspy text-sm">{roleName}</h2>
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
            Hola, soy {roleName} en Fundación ASPY :)
          </p>
        </div>
        <div className="flex flex-row gap-16">
          <div className="flex flex-col gap-2">
            <h2 className="font-kumbh text-primaryAspy font-semibold text-base">
              Edad
            </h2>
            <p className="font-kumbh text-sm text-secondaryAspy">
              {getAge(person.birthdate)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-kumbh text-primaryAspy font-semibold text-base">
              Género
            </h2>
            <p className="font-kumbh text-sm text-secondaryAspy">
              {person.gender?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
