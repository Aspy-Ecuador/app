// Descarga un comprobante o un reporte (archivo privado: se pide con la sesión iniciada).
// Hace falta sobre todo en el celular, donde el navegador no muestra un PDF dentro de la página.
import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { tone } from "@shared-theme/themePrimitives";
import { descargarArchivo } from "@/utils/archivos";

interface BotonDescargarArchivoProps {
  archivo: string;
  /** Nombre con que se guarda, sin extensión. */
  nombre: string;
}

export default function BotonDescargarArchivo({ archivo, nombre }: BotonDescargarArchivoProps) {
  const [descargando, setDescargando] = useState(false);
  const [fallo, setFallo] = useState(false);

  const descargar = async () => {
    setDescargando(true);
    setFallo(false);
    try {
      await descargarArchivo(archivo, nombre);
    } catch {
      setFallo(true);
    } finally {
      setDescargando(false);
    }
  };

  return (
    <Button
      size="small"
      disabled={descargando}
      startIcon={
        descargando ? (
          <CircularProgress size={12} color="inherit" />
        ) : (
          <FileDownloadRoundedIcon sx={{ fontSize: "14px !important" }} />
        )
      }
      onClick={descargar}
      sx={{
        flexShrink: 0,
        fontSize: 11,
        fontWeight: 500,
        textTransform: "none",
        color: fallo ? tone.red.fg : tone.blue.fg,
        bgcolor: fallo ? tone.red.bg : tone.blue.bg,
        border: `0.5px solid ${fallo ? tone.red.border : tone.blue.border}`,
        borderRadius: 1.5,
        px: 1.25,
        minWidth: 0,
        "&:hover": { bgcolor: fallo ? tone.red.border : tone.blue.border },
      }}
    >
      {fallo ? "Reintentar" : "Descargar"}
    </Button>
  );
}
