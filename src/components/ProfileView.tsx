import penToSquare from "@assets/pen-to-square.svg";
import { User } from "@/types/User";

type ProfileProps = {
  user_info: User;
  onEdit: () => void;
  isRowPosition: boolean;
};

function ProfileView({ user_info, onEdit, isRowPosition }: ProfileProps) {
  return (
    <div
      className={`flex ${isRowPosition ? "flex-col md:flex-row" : "flex-col"} justify-center gap-16 p-8 m-8`}
    >
      <div className="flex flex-col gap-16 items-center">
        <img
          className="rounded-full w-auto h-auto"
          src={`https://randomuser.me/api/portraits/${user_info.gender.toLowerCase() === "masculino" ? "men" : "women"}/${Math.floor(Math.random() * 50) + 1}.jpg`}
          alt={user_info.first_name}
        />
        <div className="flex flex-col gap-1 justify-center items-center">
          <h1 className="font-kumbh text-primaryAspy font-semibold text-base">
            {user_info.first_name} {user_info.last_name}
          </h1>
          <h2 className="font-kumbh text-secondaryAspy text-sm">
            {user_info.role}
          </h2>
        </div>
        <img
          src={penToSquare}
          onClick={onEdit}
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
            Hola, soy {user_info.role} en Fundación ASPY :)
          </p>
        </div>
        <div className="flex flex-row gap-16">
          <div className="flex flex-col gap-2">
            <h2 className="font-kumbh text-primaryAspy font-semibold text-base">
              Edad
            </h2>
            <p className="font-kumbh text-sm text-secondaryAspy">
              {user_info.age}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-kumbh text-primaryAspy font-semibold text-base">
              Género
            </h2>
            <p className="font-kumbh text-sm text-secondaryAspy">
              {user_info.gender}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
