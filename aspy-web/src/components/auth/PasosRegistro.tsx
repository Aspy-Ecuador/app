// Indicador de pasos del registro: círculos numerados unidos por una línea que se va llenando.
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { aspy } from "@shared-theme/themePrimitives";
import { C } from "@components/landing/constants";

interface PasosRegistroProps {
  paso: number;
  pasos: string[];
}

const CIRCULO = 36;

export default function PasosRegistro({ paso, pasos }: PasosRegistroProps) {
  return (
    <Box
      component="ol"
      aria-label={`Paso ${paso + 1} de ${pasos.length}`}
      sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gridTemplateColumns: `repeat(${pasos.length}, 1fr)` }}
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
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              textAlign: "center",
              // Línea que une este paso con el anterior
              "&:not(:first-of-type)::before": {
                content: '""',
                position: "absolute",
                top: CIRCULO / 2 - 1.5,
                left: `calc(-50% + ${CIRCULO / 2 + 8}px)`,
                right: `calc(50% + ${CIRCULO / 2 + 8}px)`,
                height: 3,
                borderRadius: 2,
                bgcolor: i <= paso ? C.blue : aspy.border,
                transition: "background-color 0.3s",
              },
            }}
          >
            <Box
              sx={{
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
                px: 0.5,
                fontSize: { xs: "0.76rem", sm: "0.86rem" },
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
