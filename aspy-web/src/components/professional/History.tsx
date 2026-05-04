// FINAL
import { useParams, useNavigate } from "react-router-dom";
import type { Person } from "@/typesResponse/Person";
import { useRoleData } from "@/observer/RoleDataContext";
import { getUser } from "@/utils/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import OverviewPatient from "@professional/OverviewPatient";
import TimeLinePatients from "@professional/TimeLinePatient";
import Header from "@components/Header";
import Progress from "@components/Progress";

export default function History() {
  const { data, loading } = useRoleData();
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) return <Progress />;

  const handleBack = () => navigate(-1);
  const backToHome = () => navigate("/");

  const numericId = id ? parseInt(id) : 0;
  if (numericId === 0) backToHome();

  const user: Person = getUser(data.persons, numericId);

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Header
            textHeader="Histórico de Paciente"
            isCreate={false}
            handle={handleBack}
          />
        </Grid>

        {/* Timeline — columna principal */}
        <Grid size={{ xs: 12, md: 8 }}>
          <TimeLinePatients patient={user!} />
        </Grid>

        {/* Overview — columna lateral */}
        <Grid size={{ xs: 12, md: 4 }}>
          <OverviewPatient patient={user!} />
        </Grid>
      </Grid>
    </Box>
  );
}
