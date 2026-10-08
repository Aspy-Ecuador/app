// Muestra un comprobante o un reporte ocupando todo el espacio de su contenedor.
// Los archivos son privados: se piden con la sesión iniciada (ver utils/archivos).
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useArchivo } from "@/utils/archivos";

interface VisorArchivoProps {
  /** Referencia guardada en `payment_data.file` o `report.file`. */
  archivo?: string | null;
  titulo: string;
  /** Qué se muestra cuando no hay archivo. */
  vacio?: ReactNode;
}

const centrado = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 1.25,
  p: 2,
  textAlign: "center",
} as const;

export default function VisorArchivo({ archivo, titulo, vacio = null }: VisorArchivoProps) {
  const { url, esImagen, cargando, error } = useArchivo(archivo);

  if (!archivo) return <>{vacio}</>;

  if (cargando) {
    return (
      <Box sx={centrado} role="status">
        <CircularProgress size={26} />
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Abriendo el archivo…</Typography>
      </Box>
    );
  }

  if (error || !url) {
    return (
      <Box sx={centrado} role="alert">
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          {error || "No se pudo abrir el archivo. Intenta de nuevo."}
        </Typography>
      </Box>
    );
  }

  if (esImagen) {
    return (
      <Box
        component="img"
        src={url}
        alt={titulo}
        sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block", bgcolor: "action.hover" }}
      />
    );
  }

  return (
    <Box
      component="iframe"
      src={url}
      title={titulo}
      sx={{ width: "100%", height: "100%", border: "none", display: "block" }}
    />
  );
}
