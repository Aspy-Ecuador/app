import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import AddReport from "@professional/AddReport";
import { FileData } from "@/types/FileData";

export default function NewReport() {
  const [report, setReport] = useState<FileData | null>(null);
  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Grid container spacing={0}>
            <Grid size={9} marginBottom={"4px"}>
              <Typography variant="h3">Nuevo Reporte</Typography>
            </Grid>
          </Grid>
          <Divider className="divider-paciente-historial"></Divider>
        </Grid>

        <Grid size={8}>
          {report?.file && (
            <div className="border border-gray-300 rounded-md overflow-hidden h-[500px]">
              <iframe
                src={
                  report.file instanceof File
                    ? URL.createObjectURL(report.file)
                    : report.file
                }
                title="Vista previa del reporte"
                width="100%"
                height="100%"
                className="rounded-md"
              />
            </div>
          )}
        </Grid>
        <Grid size={4}>
          <AddReport setReport={setReport} />
        </Grid>
      </Grid>
    </Box>
  );
}
