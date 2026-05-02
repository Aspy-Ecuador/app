// FINAL
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import TimeLinePatients from "@client/TimeLinePatient";
import SimpleHeader from "@components/SimpleHeader";
import { getAuthenticatedPersonID } from "@/utils/store";
import { useState } from "react";

export default function History() {
  const [selectedComments, setSelectedComments] = useState("");

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Mi histórico" chip="Reportes" />

      <Grid container spacing={1.5} alignItems="flex-start">
        {/* Timeline */}
        <Grid size={4}>
          <TimeLinePatients
            patient_id={getAuthenticatedPersonID()}
            onSelectComments={setSelectedComments}
            selectedComments={selectedComments}
          />
        </Grid>

        {/* Visor de reporte */}
        <Grid size={8}>
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

            <Box sx={{ height: "80vh" }}>
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
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
