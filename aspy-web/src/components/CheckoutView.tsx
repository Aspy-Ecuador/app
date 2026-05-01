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
import Typography from "@mui/material/Typography";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PaymentForm from "@/components/PaymentForm";
import Review from "@components/Review";
import Steps from "@components/Steps";
import Divider from "@mui/material/Divider";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import Success from "@components/Success";
import appointmentAPI from "@API/appointmentAPI";
import Progress from "@components/Progress";
import CircularProgress from "@mui/material/CircularProgress";

const steps = ["Detalles de Pago", "Revisar cita"];

interface CheckoutViewProp {
  isClient: boolean;
}

export default function CheckoutView({ isClient }: CheckoutViewProp) {
  const {
    loading,
    refreshServices,
    refreshPersons,
    refreshAppointmentReports,
    refreshPayments,
    refreshAppointments,
    refreshProServices,
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

      //const uploadedFileUrl = await uploadToCloudinary(file);

      const clientId = isClient ? getAuthenticatedPersonID() : parsedClientId; // Cliente

      const dataSend: AppointmentRequest = {
        payment_type: "Transferencia",
        payment_file:
          "https://res.cloudinary.com/dyqznwbdb/raw/upload/v1777582266/pdfs/tlmcvftgfpjxiiymcupb.pdf",
        client_id: clientId,
        professional_id: parsedProfessionalId,
        service_id: parsedServiceId,
        worker_schedule_id: parsedWorkerId,
      };

      await appointmentAPI.createAppointment(dataSend);
      await refreshPersons();
      await refreshAppointments();
      await refreshAppointmentReports();
      await refreshPayments();
      await refreshProServices();
      await refreshServices();
      await refreshWorkerProfessional();
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

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleBackPage = () => {
    navigate(-1);
  };
  if (loading) return <Progress />;
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
              gap: { xs: 1, md: "none" },
            }}
          >
            {activeStep === steps.length ? (
              <Success
                open={open}
                handleClose={handleClose}
                isRegister={false}
                message={"Cita registrada con éxito"}
              />
            ) : (
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
                      disabled={!isPaymentValid}
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
                      {load ? (
                        <CircularProgress size={24} sx={{ color: "white" }} /> // Mostrar ciclo de carga
                      ) : (
                        <h1>Finalizar</h1>
                      )}
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
