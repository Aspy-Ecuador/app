import { useParams, useNavigate, useLocation } from "react-router-dom";
import { pacientes } from "@data/Pacientes";
import { User } from "@/types/User";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import OverviewPaciente from "@professional/OverviewPaciente";
import TimeLinePatients from "@professional/TimeLinePatient";

import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";

export default function History() {
  const { id } = useParams();
  const navigate = useNavigate();

  const numericId = id ? parseInt(id.split("-")[0]) : null;
  const user: User | undefined = pacientes.find((u) => u.id === numericId);

  const handleBack = () => {
    navigate(-1);
  };

  const location = useLocation();

  const handleNewReport = () => {
    if (user) {
      const newPath = `${location.pathname}/nuevoReporte`;
      navigate(newPath);
    }
  };

  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Grid container spacing={0}>
            <Grid size={9}>
              <Typography variant="h3">Histórico de Paciente</Typography>
            </Grid>
            <Grid size={3} display="flex" justifyContent="flex-end">
              <Button
                onClick={handleBack}
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
        <Grid size={8}>
          <Typography variant="h6">Histórico</Typography>
          <TimeLinePatients />
        </Grid>
        <Grid size={4}>
          <OverviewPaciente
            paciente={user!}
            representante={user!}
            newReport={handleNewReport}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
