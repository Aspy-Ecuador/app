// FINAL
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ServiceForm from "@forms/ServiceForm";
import Header from "@components/Header";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Progress from "@components/Progress"; // <-- Importamos el spinner
import { useRoleData } from "@/observer/RoleDataContext"; // <-- Importamos el contexto

export default function EditService() {
  const { id } = useParams();
  const numericId = id ? parseInt(id) : undefined;
  const navigate = useNavigate();
  
  // Extraemos el estado de carga
  const { loading } = useRoleData();

  // ESCUDO: Si los datos aún no llegan, mostramos el spinner y detenemos el renderizado
  if (loading) return <Progress />;

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      
      {/* Header estandarizado */}
      <Box className="grid-p-patients-tittle">
        <Header
          textHeader="Editar Servicio"
          isCreate={false}
          handle={() => navigate(-1)}
        />
      </Box>

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
                  bgcolor: "#E6F1FB", 
                  color: "#185FA5",
                  "& svg": { fontSize: 15 },
                }}
              >
                <EditRoundedIcon fontSize="inherit" />
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
                  Actualizar datos
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "text.disabled",
                    lineHeight: 1.2,
                  }}
                >
                  Modifica la información del servicio
                </Typography>
              </Box>
            </Box>

            {/* Formulario: Ahora es 100% seguro renderizarlo porque loading ya es false */}
            <Box sx={{ p: 2.5 }}>
              <ServiceForm isEditMode={true} serviceId={numericId} />
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
                  titulo: "Actualización de Costos",
                  desc: "Si modificas el precio, el nuevo valor solo aplicará para las futuras citas. Los comprobantes anteriores no se verán afectados.",
                },
                {
                  titulo: "Nombre del servicio",
                  desc: "Intenta mantener un nombre descriptivo para no confundir a los clientes que ya conocen el servicio.",
                },
                {
                  titulo: "Profesional asignado",
                  desc: "La asignación actual de profesionales se mantiene intacta aunque cambies estos datos.",
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