// FINAL
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ServiceForm from "@forms/ServiceForm";
import Header from "@components/Header";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";

export default function CreateService() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <Header
        textHeader="Registrar Servicio"
        isCreate={false}
        handle={() => navigate(-1)}
      />

      <Grid container spacing={2} justifyContent="center">
        {/* Columna principal — formulario */}
        <Grid size={{ xs: 12, md: 7, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            {/* Cabecera del card */}
            <Box
              sx={{
                px: 2.5,
                py: 1.75,
                borderBottom: "0.5px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1.25,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#EEEDFE",
                  color: "#534AB7",
                  "& svg": { fontSize: 15 },
                }}
              >
                <AssignmentTurnedInRoundedIcon fontSize="inherit" />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  Nuevo servicio
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "text.disabled",
                    lineHeight: 1.2,
                  }}
                >
                  Completa los datos del servicio
                </Typography>
              </Box>
            </Box>

            {/* Formulario */}
            <Box sx={{ p: 2.5 }}>
              <ServiceForm isEditMode={false} />
            </Box>
          </Paper>
        </Grid>

        {/* Columna secundaria — tips */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: "0.5px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "text.disabled",
                }}
              >
                Información
              </Typography>
            </Box>

            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                {
                  titulo: "Nombre del servicio",
                  desc: "Usa un nombre claro y descriptivo que los pacientes puedan identificar fácilmente.",
                },
                {
                  titulo: "Costo",
                  desc: "Ingresa el precio en dólares. Puedes actualizarlo después si es necesario.",
                },
                {
                  titulo: "Profesional asignado",
                  desc: "Puedes asignar el profesional desde la lista de servicios una vez creado.",
                },
              ].map(({ titulo, desc }) => (
                <Box
                  key={titulo}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    border: "0.5px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 11, fontWeight: 600, color: "text.primary", mb: 0.4 }}
                  >
                    {titulo}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.5 }}>
                    {desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}