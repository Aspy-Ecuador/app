// FINAL
import { useState } from "react";
import type { FileData } from "@/types/FileData";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import AddReport from "@professional/AddReport";

export default function NewReport() {
  const [report, setReport] = useState<FileData | null>(null);
  const navigate = useNavigate();

  const previewSrc =
    report?.file instanceof File
      ? URL.createObjectURL(report.file)
      : (report?.file ?? null);

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 1.5,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            border: "0.5px solid",
            borderColor: "divider",
            borderRadius: 1.5,
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>

        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
          Nuevo Reporte
        </Typography>
        <Chip
          label="Pendiente subir Reporte"
          size="small"
          sx={{
            ml: "auto",
            bgcolor: "#FAEEDA",
            color: "#854F0B",
            fontWeight: 500,
            fontSize: 11,
            height: 22,
            "& .MuiChip-label": { px: 1.25 },
          }}
        />
      </Box>

      {/* ── Columnas ── */}
      <Grid container spacing={1.5} alignItems="flex-start">
        {/* Vista previa */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: "78vh",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                borderBottom: "0.5px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <InsertDriveFileOutlinedIcon
                sx={{ fontSize: 15, color: "text.disabled" }}
              />
              <Typography variant="caption" color="text.secondary">
                {report?.file instanceof File
                  ? report.file.name
                  : "Sin archivo cargado"}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, position: "relative", minHeight: "70vh" }}>
              {previewSrc ? (
                <iframe
                  src={previewSrc}
                  title="Vista previa del reporte"
                  width="100%"
                  height="100%"
                  style={{
                    border: "none",
                    display: "block",
                    position: "absolute",
                    inset: 0,
                  }}
                />
              ) : (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%", gap: 1.5, py: 10 }}
                >
                  <InsertDriveFileOutlinedIcon
                    sx={{ fontSize: 40, color: "text.disabled" }}
                  />
                  <Typography variant="body2" color="text.disabled">
                    Sube un archivo para previsualizarlo aquí
                  </Typography>
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Formulario */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: 2,
              position: { md: "sticky" },
              top: { md: 24 },
            }}
          >
            <AddReport setReport={setReport} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
