// FINAL
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import TimeLinePatients from "@client/TimeLinePatient";
import SimpleHeader from "@components/SimpleHeader";
import { getAuthenticatedPersonID } from "@/utils/store";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";

export default function History() {
  const [selectedComments, setSelectedComments] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const reportViewer = (
    <>
      <Box
        sx={{
          px: 1.75,
          py: 1.25,
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
          Vista previa del reporte
        </Typography>
      </Box>

      <Box sx={{ height: { xs: "75vh", md: "80vh" } }}>
        {selectedComments ? (
          <Box
            component="iframe"
            src={selectedComments}
            title="Vista previa del reporte"
            sx={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "action.hover",
                border: "0.5px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.disabled",
              }}
            >
              <ArticleRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography
              sx={{
                fontSize: 12,
                color: "text.disabled",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Selecciona un reporte
              <br />
              para ver los detalles
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Mi histórico" chip="Reportes" />

      <Grid container spacing={1.5} alignItems="flex-start">
        {/* Timeline — ancho completo en móvil, 4 columnas en desktop */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TimeLinePatients
            patient_id={getAuthenticatedPersonID()}
            onSelectComments={setSelectedComments}
            selectedComments={selectedComments}
          />
        </Grid>

        {/* Visor de reporte — solo en desktop */}
        {!isMobile && (
          <Grid size={{ md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
                position: "sticky",
                top: 12,
              }}
            >
              {reportViewer}
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Drawer — solo en móvil/tablet */}
      {isMobile && (
        <Drawer
          anchor="bottom"
          open={Boolean(selectedComments)}
          onClose={() => setSelectedComments("")}
          slotProps={{
            backdrop: {
              sx: {
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(0,0,0,0.2)",
              },
            },
          }}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "85vh",
              boxShadow: "0px -4px 20px rgba(0,0,0,0.1)",
              overflow: "hidden",
            },
          }}
        >
          {/* Handle visual */}
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: "action.disabled",
              borderRadius: 2,
              mx: "auto",
              my: 1.5,
              flexShrink: 0,
            }}
          />
          {reportViewer}
        </Drawer>
      )}
    </Box>
  );
}