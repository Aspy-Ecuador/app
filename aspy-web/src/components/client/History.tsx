// FINAL
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TimeLinePatients from "@client/TimeLinePatient";
import SimpleHeader from "@components/SimpleHeader";
import { getAuthenticatedPersonID } from "@/utils/store";
import { useState } from "react";
import Typography from "@mui/material/Typography";

export default function History() {
  const [selectedComments, setSelectedComments] = useState("");
  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text="Mi histórico" />
        </Grid>
        <Grid size={6}>
          <TimeLinePatients
            patient_id={getAuthenticatedPersonID()}
            onSelectComments={setSelectedComments}
          />
        </Grid>
        <Grid size={6} sx={{ height: "90vh" }}>
          {selectedComments ? (
            <div className="border border-gray-300 rounded-md overflow-hidden h-full">
              <iframe
                src={selectedComments}
                title="Vista previa del reporte"
                width="100%"
                height="100%"
                className="rounded-md"
              />
            </div>
          ) : (
            <Typography variant="h6" align="center" sx={{ marginTop: "20%" }}>
              Selecciona un reporte para ver los detalles
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
