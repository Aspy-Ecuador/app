// Envoltura de un campo de formulario del panel: etiqueta arriba, el control y, debajo,
// el error (en rojo) o la ayuda. El control se pasa como hijo y se estiliza con `campoSx`.
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { ayudaSx, etiquetaSx } from "./estilos";

interface CampoProps {
  etiqueta: string;
  /** id del control, para que al tocar la etiqueta se enfoque (no usar con Select de MUI). */
  htmlFor?: string;
  /** id de la etiqueta, para enlazarla con un Select de MUI (`labelId`). */
  idEtiqueta?: string;
  error?: string;
  ayuda?: string;
  /** Reserva el espacio del mensaje aunque no haya, para que las filas no salten. */
  reservarMensaje?: boolean;
  children: ReactNode;
}

export default function Campo({ etiqueta, htmlFor, idEtiqueta, error, ayuda, reservarMensaje, children }: CampoProps) {
  const mensaje = error ?? ayuda;
  return (
    <Box sx={{ minWidth: 0, width: "100%" }}>
      <Box component="label" id={idEtiqueta} htmlFor={htmlFor} sx={etiquetaSx}>
        {etiqueta}
      </Box>
      {children}
      {(mensaje || reservarMensaje) && (
        <Box
          role={error ? "alert" : undefined}
          sx={{ ...ayudaSx, minHeight: reservarMensaje ? 18 : undefined, color: error ? "error.main" : "text.secondary", fontWeight: error ? 600 : 400 }}
        >
          {mensaje}
        </Box>
      )}
    </Box>
  );
}
