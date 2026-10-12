// Botones "PDF" y "Excel" de una tabla: descargan lo que la tabla está mostrando (con los filtros puestos).
// Todas las tablas del sistema los llevan: la mayoría, dentro de su barra de filtros (BarraFiltros.tsx).
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { tone } from "@shared-theme/themePrimitives";
import { exportarTablaExcel, exportarTablaPDF, type TablaExportable } from "@utils/utils";

interface BotonesExportarProps<T> {
  tabla: TablaExportable<T>;
  /** Más bajos, para la barra de filtros. Sin esto, del alto de los botones del encabezado de la pantalla. */
  compactos?: boolean;
}

export default function BotonesExportar<T>({ tabla, compactos = false }: BotonesExportarProps<T>) {
  const vacia = tabla.filas.length === 0;
  const boton = (color: typeof tone.red) =>
    ({
      fontSize: compactos ? "0.8rem" : 12,
      fontWeight: compactos ? 600 : 500,
      bgcolor: color.bg,
      color: color.fg,
      border: `0.5px solid ${color.border}`,
      borderRadius: compactos ? "999px" : 3,
      px: compactos ? 1.25 : 1.75,
      py: compactos ? 0 : 1.25,
      height: compactos ? 30 : "auto",
      minWidth: 0,
      textTransform: "none",
      "&:hover": { bgcolor: color.border },
      "&.Mui-disabled": { opacity: 0.5, color: color.fg },
    }) as const;
  const icono = <FileDownloadOutlinedIcon sx={{ fontSize: "14px !important" }} />;
  const que = tabla.titulo.toLowerCase();

  return (
    <Box sx={{ display: "flex", gap: compactos ? 0.75 : 1, alignItems: "center" }}>
      <Button onClick={() => exportarTablaPDF(tabla)} disabled={vacia} startIcon={icono} aria-label={`Descargar en PDF: ${que}`} sx={boton(tone.red)}>
        PDF
      </Button>
      <Button onClick={() => void exportarTablaExcel(tabla)} disabled={vacia} startIcon={icono} aria-label={`Descargar en Excel: ${que}`} sx={boton(tone.green)}>
        Excel
      </Button>
    </Box>
  );
}
