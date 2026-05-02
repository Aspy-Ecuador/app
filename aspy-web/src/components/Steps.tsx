// FINAL
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

interface StepsProps {
  activeStep: number;
  steps: string[];
}

export default function Steps({ activeStep, steps }: StepsProps) {
  return (
    <Box sx={{ width: "100%", py: 1 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
