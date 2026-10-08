// Indicador de pasos del registro: círculos numerados unidos por una línea que se va llenando.
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { aspy } from "@shared-theme/themePrimitives";
import { C } from "@components/landing/constants";

interface PasosRegistroProps {
  paso: number;
  pasos: string[];
  /** Desde PC (lg) los pasos van uno debajo de otro: para ponerlos en una columna junto al formulario. */
  enColumnaEnPc?: boolean;
}

const CIRCULO = 36;
/** Separación entre pasos cuando van en columna. */
const SEPARACION = 18;

export default function PasosRegistro({ paso, pasos, enColumnaEnPc = false }: PasosRegistroProps) {
  // Valor para celular/tablet (fila) y, si corresponde, para PC (columna)
  const segun = <const F, const C>(fila: F, columna: C) => (enColumnaEnPc ? { xs: fila, lg: columna } : fila);

  return (
    <Box
      component="ol"
      aria-label={`Paso ${paso + 1} de ${pasos.length}`}
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        display: "grid",
        gridTemplateColumns: segun(`repeat(${pasos.length}, 1fr)`, "1fr"),
        rowGap: segun(0, `${SEPARACION}px`),
      }}
    >
      {pasos.map((nombre, i) => {
        const hecho = i < paso;
        const actual = i === paso;
        return (
          <Box
            component="li"
            key={nombre}
            aria-current={actual ? "step" : undefined}
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: segun("column", "row"),
              alignItems: "center",
              gap: segun(1, 1.5),
              textAlign: segun("center", "left"),
              // Línea que une este paso con el anterior (horizontal en fila, vertical en columna)
              "&:not(:first-of-type)::before": {
                content: '""',
                position: "absolute",
                top: segun(`${CIRCULO / 2 - 1.5}px`, `${4 - SEPARACION}px`),
                left: segun(`calc(-50% + ${CIRCULO / 2 + 8}px)`, `${CIRCULO / 2 - 1.5}px`),
                right: segun(`calc(50% + ${CIRCULO / 2 + 8}px)`, "auto"),
                width: segun("auto", "3px"),
                height: segun("3px", `${SEPARACION - 8}px`),
                borderRadius: 2,
                bgcolor: i <= paso ? C.blue : aspy.border,
                transition: "background-color 0.3s",
              },
            }}
          >
            <Box
              sx={{
                flex: "none",
                width: CIRCULO,
                height: CIRCULO,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: "0.9rem",
                transition: "background-color 0.3s, box-shadow 0.3s",
                ...(actual
                  ? { color: "#fff", background: `linear-gradient(135deg, #2C7F9C, ${C.blueDark})`, boxShadow: `0 0 0 5px ${C.blue}33` }
                  : hecho
                    ? { color: C.blueDark, bgcolor: C.blueLight, border: "1.5px solid", borderColor: C.blue }
                    : { color: aspy.muted, bgcolor: aspy.surface, border: "1.5px solid", borderColor: aspy.border }),
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            >
              {hecho ? <CheckRoundedIcon sx={{ fontSize: 20 }} /> : i + 1}
            </Box>
            <Typography
              sx={{
                px: segun(0.5, 0),
                fontSize: { xs: "0.76rem", sm: "0.86rem", ...(enColumnaEnPc ? { lg: "0.92rem" } : {}) },
                lineHeight: 1.25,
                fontWeight: actual ? 700 : 500,
                color: actual ? aspy.text : aspy.muted,
              }}
            >
              {nombre}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
