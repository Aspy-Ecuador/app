import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AppointmentRequest } from "@/typesRequest/AppointmentRequest";
import { FileData } from "@/types/FileData";
import { ServiceResponse } from "@/typesResponse/ServiceResponse";
import { useRoleData } from "@/observer/RoleDataContext";
import { getAuthenticatedUserID } from "@/utils/store";
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
import appointmentAPI from "@API/appointmentAPI";
import Progress from "@components/Progress";
import { getAppointments, uploadToCloudinary } from "@/utils/utils";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

const steps = ["Detalles de Pago", "Revisar cita"];

interface CheckoutViewProp {
  isClient: boolean;
}

export default function CheckoutView({ isClient }: CheckoutViewProp) {
  const {
    data,
    loading,
    refreshServices,
    refreshPersons,
    refreshUserAccounts,
    refreshRoles,
    refreshProfessionals,
    refreshSchedules,
    refreshAppointments,
    refreshWorkerSchedules,
  } = useRoleData();

  if (loading) return <Progress />;

  const services: ServiceResponse[] = data.services;

  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<FileData | null>(null);
  const { serviceId, scheduleId, clientId } = useParams();

  // Opcional: convertirlos a número si los necesitas como enteros
  const parsedServiceId = parseInt(serviceId || "", 10);
  const parsedScheduleId = parseInt(scheduleId || "", 10);
  const parsedClientId = parseInt(clientId || "", 10);

  const [load, setLoad] = useState(false);

  const handleOpen = async () => {
    if (file != null) {
      setLoad(true);
      const selectedService = services.find(
        (service) => service.service_id === parsedServiceId
      );

      // 2. Subir a Cloudinary
      const uploadedFileUrl = await uploadToCloudinary(file);

      const hardcodedPersonId = isClient
        ? getAuthenticatedUserID()
        : parsedClientId; // Cliente

      const hardcodedScheduledBy = 5;
      const hardcodedServicePrice = selectedService!.price;
      const hardcodedTotalAmount = selectedService!.price;
      const hardcodedPaymentType = "Transferencia";
      const hardcodedAccountNumber = 987654321;

      const dataSend: AppointmentRequest = {
        payment_data: {
          type: hardcodedPaymentType,
          number: hardcodedAccountNumber,
          file: uploadedFileUrl,
        },
        payment: {
          person_id: Number(hardcodedPersonId),
          service_id: Number(parsedServiceId),
          service_price: Number(hardcodedServicePrice),
          total_amount: Number(hardcodedTotalAmount),
        },
        scheduled_by: hardcodedScheduledBy,
        worker_schedule_id: parsedScheduleId,
      };
      await appointmentAPI.createAppointment(dataSend);
      await refreshServices();
      await refreshPersons();
      await refreshUserAccounts();
      await refreshRoles();
      await refreshProfessionals();
      await refreshSchedules();
      await refreshAppointments();
      await refreshWorkerSchedules();
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
