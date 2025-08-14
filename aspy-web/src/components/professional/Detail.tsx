import { useRoleData } from "@/observer/RoleDataContext";
import { useParams, useNavigate } from "react-router-dom";
import { AppointmentReport } from "@/types/AppointmentReport";
import { getAppointmentsReport } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import LogoClaro from "@assets/logo mediano.png";
import Divider from "@mui/material/Divider";
import Progress from "@components/Progress";
import Header from "@components/Header";

export default function AppointmentDetail() {
  const { data, loading } = useRoleData();
  if (loading) return <Progress />;
  const navigate = useNavigate();

  const appointmentsReport: AppointmentReport[] = getAppointmentsReport(data);

  const { id, citaId } = useParams();
  console.log(id);

  const appointment = appointmentsReport.find(
    (a) => a.appointment.id_appointment.toString() === citaId
  );

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader="Detalles de la cita"
            isCreate={false}
            handle={handleBack}
          />
        </Grid>
        <Grid size={6}>
          <Grid container width={"100%"}>
            <Grid container size={12}>
              <Grid size={6} className="grid-empresa" sx={{}}>
                <Typography variant="h2">Fundación ASPY</Typography>
              </Grid>
              <Grid size={6} className="grid-logo">
                <img src={LogoClaro} alt="Logo" width={200} />
              </Grid>
            </Grid>
            <Grid size={12} textAlign={"center"}>
              <Typography variant="h4">
                #{appointment?.appointment.id_appointment}
              </Typography>
            </Grid>
            <Grid container size={12}>
              <Grid size={6} width={"10%"}>
                <Typography variant="body1">Fecha</Typography>
              </Grid>
              <Grid size={6} width={"20%"} textAlign={"right"}>
                <Typography variant="body1" className="negrita">
                  {appointment?.appointment.date}
                </Typography>
              </Grid>
            </Grid>
            <Grid container size={12}>
              <Grid size={6} width={"10%"}>
                <Typography variant="body1">Hora</Typography>
              </Grid>
              <Grid size={6} width={"25%"} textAlign={"right"}>
                <Typography variant="body1" className="negrita">
                  {appointment?.appointment.startTime} -{" "}
                  {appointment?.appointment.endTime}
                </Typography>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Divider className="divider-report" />
            </Grid>
            <Grid container size={12}>
              <Grid size={6} textAlign={"left"}>
                <Typography variant="body1" className="typo-report">
                  Profesional
                </Typography>
                <Typography variant="body1">
                  {appointment?.appointment.proffesional.full_name}
                </Typography>
                <Typography variant="body1">
                  {appointment?.appointment.proffesional.email}
                </Typography>
                {/*
                <Typography variant="body1">
                  {"Aquí va dirección"}
                  {user?.address}
                </Typography>
                <Typography variant="body1">{user?.phone}</Typography>
                */}
              </Grid>
              <Grid size={6} textAlign={"right"}>
                <Typography variant="body1" className="typo-report">
                  Paciente
                </Typography>
                <Typography variant="body1">
                  {appointment?.appointment.client.full_name}
                </Typography>
                <Typography variant="body1">
                  {appointment?.appointment.client.email}
                </Typography>
                {/*
                <Typography variant="body1">
                  {"Aquí va dirección"}
                  {user?.address}
                </Typography>
                <Typography variant="body1">{user?.phone}</Typography>
                */}
              </Grid>
            </Grid>
            <Grid size={12}>
              <Divider className="divider-report" />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={6} sx={{ height: "90vh" }}>
          {appointment?.comments && (
            <div className="border border-gray-300 rounded-md overflow-hidden h-full">
              <iframe
                src={appointment.comments}
                title="Vista previa del reporte"
                width="100%"
                height="100%"
                className="rounded-md"
              />
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
