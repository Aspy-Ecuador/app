import { useParams, useNavigate } from "react-router-dom";
import { User } from "@/types/User";
import { useRoleData } from "@/observer/RoleDataContext";
import { getUser } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import OverviewPatient from "@professional/OverviewPatient";
import TimeLinePatients from "@professional/TimeLinePatient";
import Header from "@components/Header";
import Progress from "@components/Progress";

export default function History() {
  const { data, loading } = useRoleData();

  if (loading) return <Progress />;

  const handleBack = () => {
    navigate(-1);
  };

  const backToHome = () => {
    navigate("/");
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const numericId = id ? parseInt(id) : 0;

  if (numericId == 0) {
    backToHome();
  }

  const user: User = getUser(data, numericId);
  console.log(user);
  return (
    <Box className="box-panel-control" sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12} className="grid-p-patients-tittle">
          <Header
            textHeader={"Histórico de Paciente"}
            isCreate={false}
            handle={handleBack}
          />
        </Grid>
        <Grid size={8}>
          <TimeLinePatients patient={user!} />
        </Grid>
        <Grid size={4}>
          <OverviewPatient patient={user!} />
        </Grid>
      </Grid>
    </Box>
  );
}
