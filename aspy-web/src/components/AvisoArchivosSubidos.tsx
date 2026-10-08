// Le dice a la persona cuántos archivos tiene subidos sin usar y cuántos lleva hoy.
// El servidor guarda pocos archivos sin usar por cuenta y limita las subidas por día, para que nadie
// pueda llenar la base de datos (ver ArchivoPrivadoController). Quien usa el sistema con normalidad no
// ve este aviso: solo aparece si le quedó algún archivo sin usar o si se acerca al máximo del día.
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { tone } from "@shared-theme/themePrimitives";
import archivoAPI, { type ResumenArchivos } from "@API/archivoAPI";

/** Desde cuántas subidas antes del máximo del día se avisa. */
const MARGEN = 5;

export default function AvisoArchivosSubidos() {
  const [resumen, setResumen] = useState<ResumenArchivos | null>(null);

  useEffect(() => {
    let vigente = true;
    archivoAPI
      .resumen()
      .then((datos) => {
        if (vigente) setResumen(datos);
      })
      // Es solo informativo: si no se puede consultar, no se muestra nada
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  if (!resumen) return null;
  const { sin_usar: sinUsar, maximo_sin_usar: maximoSinUsar, hoy, maximo_por_dia: maximoPorDia } = resumen;
  const cercaDelMaximo = hoy >= maximoPorDia - MARGEN;
  if (sinUsar === 0 && !cercaDelMaximo) return null;

  return (
    <Box
      role="status"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        p: 1.25,
        borderRadius: 2,
        bgcolor: tone.blue.bg,
        border: `1px solid ${tone.blue.border}`,
        color: tone.blue.fg,
      }}
    >
      <InfoOutlinedIcon sx={{ fontSize: 17, mt: "1px", flex: "none" }} />
      <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.5, color: "inherit" }}>
        {sinUsar > 0 && (
          <>
            Tienes <strong>{sinUsar === 1 ? "1 archivo subido" : `${sinUsar} archivos subidos`}</strong> sin usar (el sistema guarda
            como máximo {maximoSinUsar}). Si subes otro cuando ya tienes {maximoSinUsar}, se reemplaza el más antiguo; los que no se usan se
            borran solos al día siguiente.{" "}
          </>
        )}
        {cercaDelMaximo && (
          <>
            Hoy has subido <strong>{hoy}</strong> de los {maximoPorDia} archivos permitidos por día.
          </>
        )}
      </Typography>
    </Box>
  );
}
