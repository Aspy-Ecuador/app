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
    <Box
      sx={{
        display: "flex",
        justifyContent: { sm: "space-between", md: "flex-end" },
        alignItems: "center",
        width: "100%",
        maxWidth: { sm: "100%", md: 600 },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexGrow: 1,
        }}
      >
        <Stepper
          id="desktop-stepper"
          activeStep={activeStep}
          sx={{ width: "100%", height: 40 }}
        >
          {steps.map((label) => (
            <Step
              sx={{ ":first-of-type": { pl: 0 }, ":last-child": { pr: 0 } }}
              key={label}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
}
