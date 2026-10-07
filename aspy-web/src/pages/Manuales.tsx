// Manual de uso dentro del sistema. Los manuales no son públicos: los sirve el backend
// (aspy/resources/manuales) con un pase temporal que solo se obtiene con sesión iniciada.
// El backend decide qué manuales ve cada rol: Cliente y Profesional el suyo; Staff y Admin todos.
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SimpleHeader from "@components/SimpleHeader";
import Progress from "@components/Progress";
import manualAPI, { type AccesoManuales } from "@API/manualAPI";
import { getAuthenticatedUserRole } from "@store";
import { vh } from "@shared-theme/pantallaGrande";

const MANUALES = [
  { archivo: "manual-familias", titulo: "Familias y pacientes", descripcion: "Crear la cuenta, agendar y pagar citas, recibos y reportes." },
  { archivo: "manual-profesional", titulo: "Profesionales", descripcion: "Horarios, agenda, asistencia y reportes de sesión." },
  { archivo: "manual-personal", titulo: "Secretaría", descripcion: "Aprobar pagos, citas, pacientes, profesionales y servicios." },
  { archivo: "manual-administrador", titulo: "Administración", descripcion: "Indicadores, usuarios y roles, servicios y agenda general." },
  { archivo: "manual-pagina-web", titulo: "Página web (Sanity)", descripcion: "Cambiar textos, fotos y contactos de la página pública." },
];

/** Manual que se abre primero: el del propio rol. */
const PROPIO: Record<string, string> = {
  Client: "manual-familias",
  Professional: "manual-profesional",
  Staff: "manual-personal",
  Admin: "manual-administrador",
};

/** El pase se renueva un poco antes de vencer. */
const vigente = (acceso: AccesoManuales | null) => !!acceso && acceso.expira - 60 > Date.now() / 1000;

export default function Manuales() {
  const [acceso, setAcceso] = useState<AccesoManuales | null>(null);
  const [error, setError] = useState(false);
  const [actual, setActual] = useState(PROPIO[getAuthenticatedUserRole() ?? ""]);

  const pedirPase = () =>
    manualAPI.acceso().then(
      (a) => { setAcceso(a); setError(false); },
      () => setError(true),
    );

  useEffect(() => {
    pedirPase();
  }, []);

  const elegir = (archivo: string) => {
    setActual(archivo);
    if (!vigente(acceso)) pedirPase();
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <SimpleHeader text="Manual de uso" chip="Ayuda" />
        <Typography sx={{ mt: 3, color: "text.secondary" }}>
          No se pudo abrir el manual. Revisa tu conexión e inténtalo de nuevo.
        </Typography>
        <Button onClick={pedirPase} variant="outlined" size="small" sx={{ mt: 2 }}>Reintentar</Button>
      </Box>
    );
  }
  if (!acceso) return <Progress />;

  const visibles = MANUALES.filter((m) => acceso.manuales.includes(m.archivo));
  const manual = visibles.find((m) => m.archivo === actual) ?? visibles[0];

  if (!manual) {
    return (
      <Box sx={{ p: 2 }}>
        <SimpleHeader text="Manual de uso" chip="Ayuda" />
        <Typography sx={{ mt: 3, color: "text.secondary" }}>No hay manuales disponibles para tu cuenta.</Typography>
      </Box>
    );
  }

  const url = manualAPI.url(acceso.pase, manual.archivo);

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5, height: { md: vh(100) } }}>
      <SimpleHeader text="Manual de uso" chip="Ayuda" />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ alignItems: { xs: "stretch", sm: "center" }, justifyContent: "space-between" }}
      >
        {visibles.length > 1 ? (
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }} role="tablist" aria-label="Manuales">
            {visibles.map((m) => {
              const activo = m.archivo === manual.archivo;
              return (
                <Chip
                  key={m.archivo}
                  role="tab"
                  aria-selected={activo}
                  label={m.titulo}
                  title={m.descripcion}
                  onClick={() => elegir(m.archivo)}
                  color={activo ? "primary" : "default"}
                  variant={activo ? "filled" : "outlined"}
                  sx={{ fontWeight: 600 }}
                />
              );
            })}
          </Stack>
        ) : (
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>{manual.descripcion}</Typography>
        )}

        <Button
          component="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          variant="outlined"
          startIcon={<OpenInNewRoundedIcon />}
          sx={{ alignSelf: { xs: "flex-start", sm: "center" }, whiteSpace: "nowrap" }}
        >
          Abrir en otra pestaña
        </Button>
      </Stack>

      <Box
        component="iframe"
        key={manual.archivo}
        title={`Manual de uso: ${manual.titulo}`}
        src={`${url}?embebido`}
        referrerPolicy="no-referrer"
        sx={{
          flex: 1,
          width: "100%",
          minHeight: { xs: `calc(${vh(100)} - 210px)`, md: 0 },
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: 3,
          bgcolor: "#fff8f1", // el manual siempre es claro: mismo fondo mientras carga
        }}
      />
    </Box>
  );
}
