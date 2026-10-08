// Casillas del consentimiento: cada declaración se acepta por separado y ninguna viene marcada
// (LOPDP, arts. 8 y 26). Si la cuenta es de una persona menor de 15 años, lo da su madre, padre o
// representante legal y se piden su nombre y su identificación (art. 21); de 15 a 17 años se elige.
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { tone } from "@shared-theme/themePrimitives";
import { campoSx, etiquetaSx } from "@components/forms/estilos";
import { DECLARACIONES, EDAD_PARA_CONSENTIR, type Declaracion } from "@/config/politica";
import { daElRepresentante, type EstadoConsentimiento, type ModoRepresentante } from "./consentimiento";

interface CasillasConsentimientoProps {
  declaraciones: Declaracion[];
  modo: ModoRepresentante;
  estado: EstadoConsentimiento;
  onCambio: (estado: EstadoConsentimiento) => void;
  deshabilitado?: boolean;
}

const cajaSx = (activa: boolean) => ({
  m: 0,
  p: 1.25,
  pr: 1.75,
  alignItems: "flex-start",
  borderRadius: 2,
  border: "1px solid",
  borderColor: activa ? tone.green.main : "divider",
  bgcolor: activa ? tone.green.bg : "background.default",
  transition: "border-color 0.2s, background-color 0.2s",
  "& .MuiFormControlLabel-label": { minWidth: 0 },
});

export default function CasillasConsentimiento({ declaraciones, modo, estado, onCambio, deshabilitado = false }: CasillasConsentimientoProps) {
  const porRepresentante = daElRepresentante(estado, modo);
  const alternar = (d: Declaracion) =>
    onCambio({ ...estado, marcadas: estado.marcadas.includes(d) ? estado.marcadas.filter((x) => x !== d) : [...estado.marcadas, d] });

  return (
    <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
      <Typography component="h3" sx={{ fontWeight: 800, fontSize: "1rem", color: "text.primary" }}>
        Tu consentimiento
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.75, lineHeight: 1.55 }}>
        Marca cada casilla para aceptar. Son independientes y ninguna viene marcada: lo que autorizas lo decides tú.
      </Typography>

      {modo === "obligatorio" && (
        <Box sx={{ mb: 1.75, p: 1.5, borderRadius: 2, bgcolor: tone.blue.bg, border: `1px solid ${tone.blue.border}` }}>
          <Typography variant="body2" sx={{ color: tone.blue.fg, lineHeight: 1.55 }}>
            Esta cuenta es de una persona menor de {EDAD_PARA_CONSENTIR} años: el consentimiento debe darlo su madre, su padre o su
            representante legal. Al marcar las casillas declaras que lo eres.
          </Typography>
        </Box>
      )}

      {modo === "opcional" && (
        <Box sx={{ mb: 1.75 }}>
          <Typography id="quien-consiente" sx={etiquetaSx}>
            ¿Quién da este consentimiento?
          </Typography>
          <RadioGroup
            aria-labelledby="quien-consiente"
            value={estado.quien}
            onChange={(e) => onCambio({ ...estado, quien: e.target.value as EstadoConsentimiento["quien"] })}
          >
            <FormControlLabel
              value="titular"
              disabled={deshabilitado}
              control={<Radio size="small" />}
              label={<Typography variant="body2">Yo: tengo {EDAD_PARA_CONSENTIR} años o más y la cuenta es mía.</Typography>}
            />
            <FormControlLabel
              value="representante"
              disabled={deshabilitado}
              control={<Radio size="small" />}
              label={<Typography variant="body2">Mi madre, mi padre o mi representante legal.</Typography>}
            />
          </RadioGroup>
        </Box>
      )}

      {porRepresentante && (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 1.75 }}>
          <Box>
            <Typography component="label" htmlFor="representante-nombre" sx={etiquetaSx}>
              Nombre completo de quien autoriza
            </Typography>
            <TextField
              id="representante-nombre"
              fullWidth
              disabled={deshabilitado}
              value={estado.nombre}
              onChange={(e) => onCambio({ ...estado, nombre: e.target.value.slice(0, 150) })}
              placeholder="Nombres y apellidos"
              autoComplete="name"
              sx={campoSx}
            />
          </Box>
          <Box>
            <Typography component="label" htmlFor="representante-identificacion" sx={etiquetaSx}>
              Su número de identificación
            </Typography>
            <TextField
              id="representante-identificacion"
              fullWidth
              disabled={deshabilitado}
              value={estado.identificacion}
              onChange={(e) => onCambio({ ...estado, identificacion: e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 20) })}
              placeholder="Cédula o pasaporte"
              sx={campoSx}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {declaraciones.map((d) => {
          const marcada = estado.marcadas.includes(d);
          return (
            <FormControlLabel
              key={d}
              disabled={deshabilitado}
              sx={cajaSx(marcada)}
              control={<Checkbox checked={marcada} onChange={() => alternar(d)} color="success" sx={{ mt: -0.5 }} />}
              label={
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "text.primary" }}>{DECLARACIONES[d].titulo}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.55 }}>
                    {DECLARACIONES[d].texto}
                  </Typography>
                </Box>
              }
            />
          );
        })}
      </Box>
    </Box>
  );
}
