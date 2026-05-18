// FINAL
import { useNavigate } from "react-router-dom";
import { useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import type { AppointmentRequest } from "@/typesRequest/AppointmentRequest";
import type { FileData } from "@/types/FileData";
import { useRoleData } from "@/observer/RoleDataContext";
import { getAuthenticatedPersonID } from "@/utils/store";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PaymentForm from "@/components/PaymentForm";
import Review from "@components/Review";
import Steps from "@components/Steps";
import Success from "@components/Success";
import appointmentAPI from "@API/appointmentAPI";
import Progress from "@components/Progress";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Header from "@components/Header";

const steps = ["Detalles de Pago", "Revisar cita"];

interface CheckoutViewProp {
  isClient: boolean;
}

export default function CheckoutView({ isClient }: CheckoutViewProp) {
  const {
    loading,
    refreshPayments,
    refreshAppointments,
    refreshWorkerProfessional,
  } = useRoleData();

  const navigate = useNavigate();
  const { serviceId, workerId, clientId, professionalId } = useParams();

  const parsedServiceId = parseInt(serviceId || "", 10);
  const parsedWorkerId = parseInt(workerId || "", 10);
  const parsedClientId = parseInt(clientId || "", 10);
  const parsedProfessionalId = parseInt(professionalId || "", 10);

  const [activeStep, setActiveStep] = useState(0);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<FileData | null>(null);
  const [load, setLoad] = useState(false);

  if (loading) return <Progress />;

  const handleOpen = async () => {
    if (file != null) {
      setLoad(true);

      // const uploadedFileUrl = await uploadToCloudinary(file);
      const resolvedClientId = isClient
        ? getAuthenticatedPersonID()
        : parsedClientId;

      const dataSend: AppointmentRequest = {
        payment_type: "Transferencia",
        payment_file:
          "https://res.cloudinary.com/dyqznwbdb/raw/upload/v1777582266/pdfs/tlmcvftgfpjxiiymcupb.pdf",
        client_id: resolvedClientId,
        professional_id: parsedProfessionalId,
        service_id: parsedServiceId,
        worker_schedule_id: parsedWorkerId,
      };

      await appointmentAPI.createAppointment(dataSend);
      await Promise.all([
        refreshAppointments(),
        refreshWorkerProfessional(),
        refreshPayments(),
      ]);
      setActiveStep(activeStep + 1);
      setLoad(false);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PaymentForm
            service_id={parsedServiceId}
            setIsValid={setIsPaymentValid}
            setFile={setFile}
          />
        );
      case 1:
        return <Review service_id={parsedServiceId} />;
      default:
        throw new Error("Unknown step");
    }
  };

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "grey.50",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 3 },
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {/* Encabezado */}
        <Grid size={12}>
          <Header
            textHeader="Pagar"
            isCreate={false}
            handle={() => navigate(-1)}
          />
        </Grid>

        {/* Steps */}
        <Grid size={12}>
          <Steps activeStep={activeStep} steps={steps} />
        </Grid>

        {/* Contenido principal */}
        <Grid size={12}>
          {activeStep === steps.length ? (
            <Success
              open={open}
              handleClose={handleClose}
              isRegister={false}
              message={"Cita registrada con éxito"}
            />
          ) : (
            <Fragment>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  p: { xs: 2.5, sm: 4 },
                  backgroundColor: "white",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {getStepContent(activeStep)}

                {/* Botones de navegación */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      activeStep !== 0 ? "space-between" : "flex-end",
                    alignItems: "center",
                    mt: 4,
                    pt: 3,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    gap: 1,
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "text.secondary",
                        display: { xs: "none", sm: "flex" },
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      Anterior
                    </Button>
                  )}

                  {activeStep === 0 && (
                    <Button
                      variant="contained"
                      endIcon={<ChevronRightRoundedIcon />}
                      onClick={handleNext}
                      disabled={!isPaymentValid}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        px: 4,
                        py: 1.25,
                        fontSize: "0.95rem",
                        boxShadow: "0 4px 14px rgba(25,118,210,0.35)",
                        "&:hover": {
                          boxShadow: "0 6px 20px rgba(25,118,210,0.45)",
                        },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Continuar
                    </Button>
                  )}

                  {activeStep === 1 && (
                    <Button
                      variant="contained"
                      onClick={handleOpen}
                      disabled={load}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        px: 4,
                        py: 1.25,
                        fontSize: "0.95rem",
                        minWidth: 140,
                        background:
                          "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
                        boxShadow: "0 4px 14px rgba(25,118,210,0.35)",
                        "&:hover": {
                          boxShadow: "0 6px 20px rgba(25,118,210,0.45)",
                        },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      {load ? (
                        <CircularProgress size={22} sx={{ color: "white" }} />
                      ) : (
                        "Finalizar reserva"
                      )}
                    </Button>
                  )}
                </Box>
              </Paper>
            </Fragment>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}