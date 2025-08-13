import { useState } from "react";
import { User } from "@/types/User";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRoleData } from "@/observer/RoleDataContext";
import Progress from "./Progress";
import { getUsers } from "@/utils/utils";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";

interface SelectProfessionalProp {
  onSelect: (id: number) => void;
}

export default function SelectProfessional({
  onSelect,
}: SelectProfessionalProp) {
  const { data, loading } = useRoleData();
  const [selectedId, setSelectedId] = useState<number>(0);

  if (loading) return <Progress />;

  const users: User[] = getUsers(data);

  const options: User[] =
    users.filter((user: User) => user.role_id === 2) || [];

  const handleChange = (event: SelectChangeEvent<number>) => {
    const id = event.target.value as number;
    setSelectedId(id); // Guarda el id directamente
    onSelect(id); // Envía el id al padre
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Typography variant="body1">Profesionales</Typography>
      <FormControl fullWidth>
        <Select value={selectedId} onChange={handleChange} displayEmpty>
          <MenuItem key={0} value={0}>
            Seleccione una opción
          </MenuItem>
          {options?.map((option) => (
            <MenuItem key={option.person_id} value={option.person_id}>
              {option.full_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
