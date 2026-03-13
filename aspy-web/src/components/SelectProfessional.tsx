import { useState, useEffect } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import { ProfessionalResponse } from "@/typesResponse/ProffesionalResponse";
import apiURL from "@/API/apiConfig";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SelectProfessionalProp {
  onSelect: (id: number) => void;
}

export default function SelectProfessional({
  onSelect,
}: SelectProfessionalProp) {
  const [selectedId, setSelectedId] = useState<string>("0");
  const [options, setOptions] = useState<ProfessionalResponse[]>([]);

  const handleChange = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setSelectedId(id); // Guarda el id directamente
    onSelect(Number(id)); // Envía el id al padre
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      try {
        const responseProfessional = await axios.get(
          `${apiURL}/professionals`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const professionals: ProfessionalResponse[] = responseProfessional.data;
        console.log(professionals);
        setOptions(professionals);
      } catch (error) {
        console.error("Error loading appointments", error);
      }
    };
    fetchAppointments();
  }, []);

  if (options.length === 0) {
    return <div>Cargando profesionales...</div>;
  }
  return (
    <Box sx={{ minWidth: 120 }}>
      <Typography variant="body1">Profesionales</Typography>
      <FormControl fullWidth>
        <Select value={selectedId} onChange={handleChange} displayEmpty>
          <MenuItem key={0} value={"0"}>
            Seleccione una opción
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.person_id} value={String(option.person_id)}>
              {option.person.first_name} {option.person.last_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
