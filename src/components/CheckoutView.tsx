import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PaymentForm from "@/components/PaymentForm";
import Review from "@components/Review";
import Steps from "@components/Steps";
import Divider from "@mui/material/Divider";

import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import Success from "@components/Success";

const steps = ["Detalles de Pago", "Revisar cita"];

export default function CheckoutView() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentType, setPaymentType] = useState("creditCard");
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setActiveStep(activeStep + 1);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/citas");
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PaymentForm
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            setIsValid={setIsPaymentValid}
          />
        );
      case 1:
        return <Review paymentType={paymentType} />;
      default:
        throw new Error("Unknown step");
    }
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleBackPage = () => {
    navigate(-1);
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1} className="contenedor-principal">
        <Grid size={12} className="grid-p-patients-tittle">
          <Grid container spacing={0}>
            <Grid size={9}>
              <Typography variant="h3">Pagar</Typography>
            </Grid>
            <Grid size={3} display="flex" justifyContent="flex-end">
              <Button
                onClick={handleBackPage}
                variant="outlined"
                startIcon={<ReplyRoundedIcon />}
                className="guardar"
              >
                Volver
              </Button>
            </Grid>
          </Grid>
          <Divider className="divider-paciente-historial"></Divider>
        </Grid>
        <Grid size={12} className="contenedor-principal">
          <Steps activeStep={activeStep} steps={steps} />
        </Grid>
        {/* Bloque */}
        <Grid size={12} className="contenedor-principal">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 5, md: "none" },
            }}
          >
            {activeStep === steps.length ? (
              <Success
                open={open}
                handleClose={handleClose}
                isRegister={false}
                message={
                  paymentType === "creditCard"
                    ? "Cita agendada con éxito"
                    : "Cita registrada con éxito"
                }
              />
            ) : (
              /*
              <Stack spacing={2} useFlexGap>
                <img src={LogoCita} width={"10%"} />
                <Typography variant="h5">Gracias por preferirnos!!!</Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Hemos enviado por correo electrónico la confirmación de su
                  pedido y le informaremos cuando se haya enviado.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ alignSelf: "start", width: { xs: "100%", sm: "auto" } }}
                >
                  Go to my orders
                </Button>
              </Stack>
              */
              <Fragment>
                {getStepContent(activeStep)}
                <Box
                  sx={[
                    {
                      display: "flex",
                      flexDirection: { xs: "column-reverse", sm: "row" },
                      alignItems: "end",
                      flexGrow: 1,
                      gap: 1,
                      pb: { xs: 12, sm: 0 },
                      mt: { xs: 2, sm: 0 },
                      mb: "60px",
                    },
                    activeStep !== 0
                      ? { justifyContent: "space-between" }
                      : { justifyContent: "flex-end" },
                  ]}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{ display: { xs: "none", sm: "flex" } }}
                    >
                      Previous
                    </Button>
                  )}

                  {activeStep === 0 && (
                    <Button
                      variant="contained"
                      endIcon={<ChevronRightRoundedIcon />}
                      onClick={handleNext}
                      disabled={paymentType === "creditCard" && !isPaymentValid}
                      sx={{ width: { xs: "100%", sm: "fit-content" } }}
                    >
                      Next
                    </Button>
                  )}

                  {activeStep === 1 && (
                    <Button
                      variant="contained"
                      onClick={handleOpen} // o handleFinish si necesitas hacer otra cosa
                      sx={{ width: { xs: "100%", sm: "fit-content" } }}
                    >
                      Finalizar
                    </Button>
                  )}
                </Box>
              </Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
