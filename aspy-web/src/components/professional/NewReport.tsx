import { useState } from "react";
import { FileData } from "@/types/FileData";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import AddReport from "@professional/AddReport";
import SimpleHeader from "../SimpleHeader";

export default function NewReport() {
  const [report, setReport] = useState<FileData | null>(null);

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <SimpleHeader text="Nuevo Reporte" />
        </Grid>
        <Grid size={8} sx={{ height: "90vh" }}>
          {report?.file && (
            <div className="border border-gray-300 rounded-md overflow-hidden h-full">
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
