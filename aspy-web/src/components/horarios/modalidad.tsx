// Modalidad de un horario (presencial o virtual) y su enlace de reunión: las piezas que comparten la
// pantalla del profesional, la de Secretaría y la agenda. La modalidad la elige quien crea el horario;
// Secretaría o el Admin lo aprueban y pueden cambiarla (ver "Horarios y citas virtuales" en CLAUDE.md).
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import Campo from "@forms/Campo";
import { campoSx } from "@forms/estilos";
import workerScheduleAPI, { type EstadoDelHorario } from "@API/workerScheduleAPI";
import type { Modalidad } from "@/typesResponse/WorkerSchedule";
import { AYUDA_ENLACE_VIRTUAL, NOMBRE_MODALIDAD, plataformaVirtual } from "@utils/citaVirtual";
import { tone } from "@shared-theme/themePrimitives";

const OPCIONES: { valor: Modalidad; icono: React.ReactNode }[] = [
  { valor: "presencial", icono: <PlaceRoundedIcon sx={{ fontSize: 15 }} /> },
  { valor: "virtual", icono: <VideocamRoundedIcon sx={{ fontSize: 15 }} /> },
];

/** Dos botones para elegir la modalidad. `value` vacío = todavía no se eligió. */
export function SelectorModalidad({ id, value, onChange, disabled }: { id: string; value: Modalidad | ""; onChange: (m: Modalidad) => void; disabled?: boolean }) {
  return (
    <Box role="radiogroup" aria-labelledby={`${id}-etiqueta`} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
      {OPCIONES.map(({ valor, icono }) => {
        const elegido = value === valor;
        const color = valor === "virtual" ? tone.blue : tone.green;
        return (
          <Button
            key={valor}
            id={`${id}-${valor}`}
            role="radio"
            aria-checked={elegido}
            disabled={disabled}
            onClick={() => onChange(valor)}
            startIcon={icono}
            sx={{
              minHeight: 40,
              borderRadius: 2,
              textTransform: "none",
              fontSize: 12.5,
              fontWeight: 600,
              border: "1px solid",
              borderColor: elegido ? color.main : "divider",
              bgcolor: elegido ? color.bg : "transparent",
              color: elegido ? color.fg : "text.secondary",
              "&:hover": { bgcolor: elegido ? color.bg : "action.hover" },
            }}
          >
            {NOMBRE_MODALIDAD[valor]}
          </Button>
        );
      })}
    </Box>
  );
}

const chipSx = { display: "inline-flex", alignItems: "center", gap: 0.5, px: 0.875, height: 22, borderRadius: "999px", fontSize: 10.5, fontWeight: 600, whiteSpace: "nowrap", border: "0.5px solid" } as const;

/** Etiqueta "Presencial" / "Virtual" (con el servicio de la reunión, o avisando que falta el enlace). */
export function ChipModalidad({ modalidad, enlace, sinDetalle = false }: { modalidad: Modalidad; enlace?: string | null; sinDetalle?: boolean }) {
  const virtual = modalidad === "virtual";
  const color = virtual ? tone.blue : tone.gray;
  const plataforma = virtual ? plataformaVirtual(enlace) : null;
  const detalle = !virtual || sinDetalle ? "" : plataforma ? ` · ${plataforma}` : " · falta el enlace";
  return (
    <Box component="span" sx={{ ...chipSx, color: color.fg, bgcolor: color.bg, borderColor: color.border }}>
      {virtual ? <VideocamRoundedIcon sx={{ fontSize: 13 }} /> : <PlaceRoundedIcon sx={{ fontSize: 13 }} />}
      {NOMBRE_MODALIDAD[modalidad]}
      {detalle}
    </Box>
  );
}

/** Etiqueta de un horario que Secretaría (o el Admin) todavía no aprobó. */
export function ChipPorAprobar() {
  return (
    <Box component="span" sx={{ ...chipSx, color: tone.amber.fg, bgcolor: tone.amber.bg, borderColor: tone.amber.border }}>
      <HourglassTopRoundedIcon sx={{ fontSize: 12 }} />
      Por aprobar
    </Box>
  );
}

interface EditorModalidadProps {
  /** Prefijo único de los campos en la página. */
  id: string;
  horarioId: number;
  modalidad: Modalidad;
  enlace: string | null;
  /** Puede elegir presencial o virtual. Si no, solo edita el enlace de un horario virtual. */
  puedeCambiarModalidad: boolean;
  /** Aviso para quien cambia la modalidad (p. ej., que Secretaría tendrá que aprobarlo otra vez). */
  avisoAlCambiar?: string;
  onGuardado: (estado: EstadoDelHorario) => void;
  onCancelar: () => void;
}

/** Formulario para cambiar la modalidad de un horario y poner, editar o quitar el enlace de su reunión. */
export function EditorModalidad({ id, horarioId, modalidad, enlace, puedeCambiarModalidad, avisoAlCambiar, onGuardado, onCancelar }: EditorModalidadProps) {
  const [elegida, setElegida] = useState<Modalidad>(modalidad);
  const [texto, setTexto] = useState(enlace ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const limpio = texto.trim();
  const enlaceMalo = elegida === "virtual" && limpio !== "" && plataformaVirtual(limpio) === null;

  const guardar = async () => {
    if (enlaceMalo) {
      setError(AYUDA_ENLACE_VIRTUAL);
      return;
    }
    setGuardando(true);
    setError("");
    try {
      const cambios: { modalidad?: Modalidad; enlace?: string } = {};
      if (puedeCambiarModalidad) cambios.modalidad = elegida;
      if (elegida === "virtual") cambios.enlace = limpio;
      onGuardado(await workerScheduleAPI.cambiarModalidad(horarioId, cambios));
    } catch (e) {
      const datos = (e as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      setError(datos?.errors?.enlace?.[0] ?? datos?.errors?.modalidad?.[0] ?? datos?.message ?? "No se pudo guardar. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!guardando) guardar();
      }}
      sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}
    >
      {puedeCambiarModalidad && (
        <Campo etiqueta="Modalidad" idEtiqueta={`${id}-modalidad-etiqueta`}>
          <SelectorModalidad id={`${id}-modalidad`} value={elegida} onChange={setElegida} disabled={guardando} />
        </Campo>
      )}
      {elegida === "virtual" && (
        <Campo etiqueta="Enlace de la reunión" htmlFor={`${id}-enlace`} ayuda="De Zoom, Microsoft Teams o Google Meet. Puedes dejarlo vacío y ponerlo después.">
          <TextField
            id={`${id}-enlace`}
            fullWidth
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setError("");
            }}
            placeholder="https://meet.google.com/abc-defg-hij"
            autoComplete="off"
            error={enlaceMalo}
            sx={campoSx}
            slotProps={{ htmlInput: { inputMode: "url", maxLength: 500 } }}
          />
        </Campo>
      )}
      {puedeCambiarModalidad && avisoAlCambiar && elegida !== modalidad && (
        <Typography sx={{ fontSize: 11.5, color: tone.amber.fg, lineHeight: 1.4 }}>{avisoAlCambiar}</Typography>
      )}
      {error && (
        <Alert severity="error" sx={{ py: 0, fontSize: 12, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button type="submit" disabled={guardando} sx={{ minHeight: 34, px: 2, borderRadius: 2, textTransform: "none", fontSize: 12, fontWeight: 600, bgcolor: "#1D9E75", color: "#fff", "&:hover": { bgcolor: "#0F6E56" }, "&.Mui-disabled": { bgcolor: tone.green.border, color: "#fff" } }}>
          {guardando ? "Guardando…" : "Guardar"}
        </Button>
        <Button type="button" onClick={onCancelar} disabled={guardando} sx={{ minHeight: 34, px: 2, borderRadius: 2, textTransform: "none", fontSize: 12, fontWeight: 600, color: "text.secondary", border: "0.5px solid", borderColor: "divider" }}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}
