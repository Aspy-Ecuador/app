// Barra de filtros que va arriba de cada tabla del sistema: buscar por texto, elegir de una lista
// (estado, rol…) y acotar por fechas. Filtra en pantalla; cada lista decide qué significa cada filtro.
// Sigue las reglas de los formularios del panel: etiqueta arriba (Campo), CampoFecha para las fechas
// y Select de MUI con `displayEmpty` y `labelId` (ver "Mapa de pantallas" en CLAUDE.md).
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import Campo from "@forms/Campo";
import CampoFecha from "@forms/CampoFecha";
import { campoSx } from "@forms/estilos";
import { tone } from "@shared-theme/themePrimitives";
import { PERIODOS_RAPIDOS } from "./filtros";

export interface FiltroLista {
  /** Identificador único en la página (se usa para enlazar la etiqueta). */
  id: string;
  etiqueta: string;
  value: string;
  onChange: (valor: string) => void;
  opciones: { value: string; texto: string }[];
  /** Texto de la opción que no filtra. Por defecto, "Todos". */
  todos?: string;
}

interface BarraFiltrosProps {
  /** Identificador único en la página (prefijo de los campos). */
  id: string;
  busqueda?: { value: string; onChange: (valor: string) => void; etiqueta?: string; placeholder: string };
  listas?: FiltroLista[];
  /** Fechas "AAAA-MM-DD" ("" = sin límite). */
  periodo?: { desde: string; hasta: string; onChange: (desde: string, hasta: string) => void; etiqueta?: string };
  /** Cuántas filas hay en total y cuántas pasan los filtros. */
  total: number;
  mostrados: number;
  /** Qué se cuenta, en singular y en plural: ["pago", "pagos"]. */
  que: [singular: string, plural: string];
  hayFiltros: boolean;
  onLimpiar: () => void;
}

const chipPeriodoSx = {
  minWidth: 0,
  height: 28,
  px: 1.25,
  borderRadius: "999px",
  textTransform: "none",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: tone.blue.fg,
  bgcolor: tone.blue.bg,
  border: `0.5px solid ${tone.blue.border}`,
  "&:hover": { bgcolor: tone.blue.border },
} as const;

export default function BarraFiltros({ id, busqueda, listas = [], periodo, total, mostrados, que, hayFiltros, onLimpiar }: BarraFiltrosProps) {
  const [singular, plural] = que;
  const etiquetaPeriodo = periodo?.etiqueta ?? "Fecha";
  // "Limpiar filtros" también borra una fecha a medio escribir (que todavía no es un filtro): se rehacen los campos
  const [limpiezas, setLimpiezas] = useState(0);

  return (
    <Paper
      component="section"
      aria-label="Filtros de la lista"
      elevation={0}
      sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: 3, p: { xs: 1.5, sm: 2 }, display: "flex", flexDirection: "column", gap: 1.5 }}
    >
      {/* Los campos se acomodan solos: uno por línea en el celular, varios en pantallas anchas */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "flex-start" }}>
        {busqueda && (
          <Box sx={{ flex: "2 1 260px", minWidth: 0 }}>
            <Campo etiqueta={busqueda.etiqueta ?? "Buscar"} htmlFor={`${id}-buscar`}>
              <TextField
                id={`${id}-buscar`}
                fullWidth
                value={busqueda.value}
                onChange={(e) => busqueda.onChange(e.target.value)}
                placeholder={busqueda.placeholder}
                autoComplete="off"
                sx={campoSx}
                slotProps={{
                  htmlInput: { inputMode: "search", enterKeyHint: "search", maxLength: 80 },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: busqueda.value ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          aria-label="Borrar la búsqueda"
                          onClick={() => busqueda.onChange("")}
                          sx={{ width: 28, height: 28, border: 0, bgcolor: "transparent" }}
                        >
                          <CloseRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  },
                }}
              />
            </Campo>
          </Box>
        )}

        {listas.map((lista) => (
          <Box key={lista.id} sx={{ flex: "1 1 170px", minWidth: 0 }}>
            <Campo etiqueta={lista.etiqueta} idEtiqueta={`${id}-${lista.id}-etiqueta`}>
              <Select
                fullWidth
                displayEmpty
                labelId={`${id}-${lista.id}-etiqueta`}
                value={lista.value}
                onChange={(e) => lista.onChange(String(e.target.value))}
                sx={campoSx}
              >
                <MenuItem value="">
                  <Typography component="span" sx={{ color: "text.secondary" }}>
                    {lista.todos ?? "Todos"}
                  </Typography>
                </MenuItem>
                {lista.opciones.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.texto}
                  </MenuItem>
                ))}
              </Select>
            </Campo>
          </Box>
        ))}

        {periodo && (
          <Box sx={{ flex: "2 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, "& > *": { minWidth: 0 } }}>
              <Campo etiqueta={`${etiquetaPeriodo}: desde`} htmlFor={`${id}-desde`}>
                <CampoFecha
                  key={`desde-${limpiezas}`}
                  id={`${id}-desde`}
                  titulo="Desde"
                  tipo="cualquiera"
                  limpiable
                  value={periodo.desde}
                  // No se toca "hasta" mientras se escribe (cada tecla pasa por fechas intermedias): si el periodo
                  // queda al revés, `enPeriodo` lo ordena al filtrar
                  onChange={(v) => periodo.onChange(v, periodo.hasta)}
                  fieldSx={campoSx}
                />
              </Campo>
              <Campo etiqueta={`${etiquetaPeriodo}: hasta`} htmlFor={`${id}-hasta`}>
                <CampoFecha
                  key={`hasta-${limpiezas}`}
                  id={`${id}-hasta`}
                  titulo="Hasta"
                  tipo="cualquiera"
                  limpiable
                  value={periodo.hasta}
                  onChange={(v) => periodo.onChange(periodo.desde, v)}
                  fieldSx={campoSx}
                />
              </Campo>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {PERIODOS_RAPIDOS.map(({ texto, rango }) => {
                const [desde, hasta] = rango();
                const activo = periodo.desde === desde && periodo.hasta === hasta;
                return (
                  <Button
                    key={texto}
                    size="small"
                    aria-pressed={activo}
                    onClick={() => (activo ? periodo.onChange("", "") : periodo.onChange(desde, hasta))}
                    sx={{ ...chipPeriodoSx, ...(activo ? { bgcolor: tone.blue.fg, color: "background.paper", "&:hover": { bgcolor: tone.blue.fg } } : {}) }}
                  >
                    {texto}
                  </Button>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1, minHeight: 30 }}>
        <Typography aria-live="polite" sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
          {hayFiltros ? (
            <>
              Mostrando <strong>{mostrados}</strong> de {total} {total === 1 ? singular : plural}
            </>
          ) : (
            <>
              {total} {total === 1 ? singular : plural}
            </>
          )}
        </Typography>
        {hayFiltros && (
          <Button
            size="small"
            onClick={() => {
              setLimpiezas((n) => n + 1);
              onLimpiar();
            }}
            startIcon={<FilterAltOffRoundedIcon sx={{ fontSize: "16px !important" }} />}
            sx={{ height: 30, px: 1.25, borderRadius: "999px", textTransform: "none", fontSize: "0.8rem", fontWeight: 600, color: "text.secondary", border: "0.5px solid", borderColor: "divider" }}
          >
            Limpiar filtros
          </Button>
        )}
      </Box>
    </Paper>
  );
}
