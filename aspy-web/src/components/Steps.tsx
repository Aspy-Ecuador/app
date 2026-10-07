// FINAL
import Box from "@mui/material/Box";
import PasosRegistro from "@components/auth/PasosRegistro";

interface StepsProps {
  activeStep: number;
  steps: string[];
}

/** Indicador de pasos de los formularios del panel (el mismo del registro). */
export default function Steps({ activeStep, steps }: StepsProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 720, mx: "auto", py: 1.5, px: { xs: 1, md: 0 } }}>
      <PasosRegistro paso={activeStep} pasos={steps} />
    </Box>
  );
}
