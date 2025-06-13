import { useState } from "react";
import { getProfesionales } from "@utils/utils";
import { User } from "@/types/User";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

export default function SelectProfessional({
  onSelect,
}: {
  onSelect: (id: number) => void;
}) {
  const [selectedId, setSelectedId] = useState<number | "">("");

  const options: User[] = getProfesionales();

  const handleChange = (event: SelectChangeEvent<number>) => {
    const id = event.target.value as number;
    setSelectedId(id); // Guarda el id directamente
    onSelect(id); // Envía el id al padre
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <Typography variant="body1">Profesionales</Typography>
      <FormControl fullWidth>
        <Select value={selectedId} onChange={handleChange}>
          <MenuItem value="">Seleccione una opción</MenuItem>
          {options?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.firstName + " " + option.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
