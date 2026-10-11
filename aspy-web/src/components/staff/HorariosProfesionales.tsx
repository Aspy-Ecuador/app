// Secretaría crea y quita horarios de los profesionales. Solo funciona si el Admin lo habilitó
// (Datos bancarios → "Horarios de los profesionales"); el servidor lo vuelve a comprobar en cada cambio.
import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import SimpleHeader from "@components/SimpleHeader";
import Progress from "@components/Progress";
import Campo from "@forms/Campo";
import { campoSx } from "@forms/estilos";
import HorarioProfessional from "@professional/HorarioProfessional";
import professionalAPI, { type ReglasHorario } from "@API/professionalAPI";
import { useRoleData } from "@/observer/RoleDataContext";
import { getProfessional } from "@utils/utils";
import type { Person } from "@/typesResponse/Person";

export default function HorariosProfesionales() {
  const { data, loading } = useRoleData();
  const [reglas, setReglas] = useState<ReglasHorario | null>(null);
  const [fallo, setFallo] = useState(false);
  const [elegido, setElegido] = useState("");

  useEffect(() => {
    professionalAPI
      .reglasHorario(true)
      .then(setReglas)
      .catch(() => setFallo(true));
  }, []);

  // Solo profesionales con la cuenta habilitada: a los demás no se les puede agendar
  const profesionales: Person[] = useMemo(
    () => getProfessional(data.persons ?? []).filter((p) => p.user_account?.is_available ?? true),
    [data.persons],
  );
  const profesional = profesionales.find((p) => String(p.person_id) === elegido) ?? null;

  if (loading || (!reglas && !fallo)) return <Progress />;

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Horarios de profesionales" chip="Horarios" />

      {fallo && <Alert severity="error">No se pudieron cargar las reglas de los horarios. Vuelve a intentarlo en un momento.</Alert>}

      {reglas && !reglas.puede_gestionar && (
        <Alert severity="info">
          La administración no habilitó que Secretaría gestione los horarios de los profesionales. Por ahora, cada profesional crea los suyos.
        </Alert>
      )}

      {reglas?.puede_gestionar && (
        <>
          <Paper elevation={0} sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: 3, p: 2 }}>
            <Box sx={{ maxWidth: 420 }}>
              <Campo
                etiqueta="Profesional"
                idEtiqueta="horarios-profesional-etiqueta"
                ayuda={profesionales.length ? "Elige de quién son los horarios que vas a crear o quitar." : "Todavía no hay profesionales registrados."}
              >
                <Select
                  fullWidth
                  displayEmpty
                  labelId="horarios-profesional-etiqueta"
                  value={elegido}
                  onChange={(e) => setElegido(String(e.target.value))}
                  disabled={profesionales.length === 0}
                  sx={campoSx}
                >
                  <MenuItem value="">
                    <Typography component="span" sx={{ color: "text.secondary" }}>
                      Seleccione una opción
                    </Typography>
                  </MenuItem>
                  {profesionales.map((p) => (
                    <MenuItem key={p.person_id} value={String(p.person_id)}>
                      {p.first_name} {p.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </Campo>
            </Box>
          </Paper>

          {profesional && (
            <HorarioProfessional
              key={profesional.person_id}
              professionalId={profesional.person_id}
              nombre={`${profesional.first_name} ${profesional.last_name}`}
            />
          )}
        </>
      )}
    </Box>
  );
}
