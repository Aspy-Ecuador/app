import { useMemo } from "react";
import { User } from "@/types/User";
import penToSquare from "@assets/pen-to-square.svg";

type ProfileProps = {
  user: User;
  onEdit: () => void;
  isRowPosition: boolean;
};

export default function ProfileView({
  user,
  onEdit,
  isRowPosition,
}: ProfileProps) {
  // Generar imagen aleatoria solo cuando cambia el usuario
  const randomIndex = useMemo(
    () => Math.floor(Math.random() * 50) + 1,
    [user.user_id]
  );

  const genderFolder = user.gender === "1" ? "men" : "women";

  const imageUrl = `https://randomuser.me/api/portraits/${genderFolder}/${randomIndex}.jpg`;

  const age_calculated = calcularEdad(user.birthdate);

  return (
    <div
      className={`flex ${isRowPosition ? "flex-col md:flex-row" : "flex-col"} justify-center gap-16 p-8 m-8`}
    >
      <div className="flex flex-col gap-16 items-center">
        <img
          className="rounded-full w-auto h-auto"
          src={imageUrl}
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
            Hola, soy {user.role.name} en Fundación ASPY :)
          </p>
        </div>
        <div className="flex flex-row gap-16">
          <div className="flex flex-col gap-2">
            <h2 className="font-kumbh text-primaryAspy font-semibold text-base">
              Edad
            </h2>
            <p className="font-kumbh text-sm text-secondaryAspy">
              {age_calculated}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-kumbh text-primaryAspy font-semibold text-base">
              Género
            </h2>
            <p className="font-kumbh text-sm text-secondaryAspy">
              {user.gender === "1" ? "Hombre" : "Mujer"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function calcularEdad(fechaNacimiento: string): number | null {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const antesCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() &&
      hoy.getDate() < nacimiento.getDate());
  return antesCumple ? edad - 1 : edad;
}
