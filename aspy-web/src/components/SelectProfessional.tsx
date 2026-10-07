// FINAL
import { useState } from "react";
import Box from "@mui/material/Box";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "./Progress";
import Campo from "@forms/Campo";
import { campoSx } from "@forms/estilos";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import type { Person } from "@/typesResponse/Person";

interface SelectProfessionalProp {
  onSelect: (id: number) => void;
}

export default function SelectProfessional({
  onSelect,
}: SelectProfessionalProp) {
  const { data, loading } = useRoleData();
  const [selectedId, setSelectedId] = useState<number>(0);

  if (loading) return <Progress />;

  const users: Person[] = data.persons;

  const options: Person[] =
    users.filter((user) => user.user_account.role_id === 2) || [];

  const handleChange = (event: SelectChangeEvent<number>) => {
    const id = event.target.value as number;
    setSelectedId(id); // Guarda el id directamente
    onSelect(id); // Envía el id al padre
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Campo etiqueta="Profesionales" idEtiqueta="citas-profesional-etiqueta">
        <Select fullWidth labelId="citas-profesional-etiqueta" value={selectedId} onChange={handleChange} displayEmpty sx={campoSx}>
          <MenuItem key={0} value={0}>
            Seleccione una opción
          </MenuItem>
          {options?.map((option) => (
            <MenuItem key={option.user_id} value={option.user_id}>
              {option.first_name} {option.last_name}
            </MenuItem>
          ))}
        </Select>
      </Campo>
    </Box>
  );
}
