import { useRoleData } from "@/observer/RoleDataContext";
import PageViewsBarChart from "@admin/PageViewsBarChart";
import type { PageViewsBarChartProps } from "@admin/PageViewsBarChart";
import { getDataAppointment, getDataCard, getIncome } from "@/utils/utils";
import StatCard from "@admin/StatCard";
import type { StatCardProps } from "@admin/StatCard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SessionsChart from "@admin/SessionsChart";

export default function MainGrid() {
  const { data } = useRoleData();
  const dataAppointment: PageViewsBarChartProps = getDataAppointment(data);
  const income: number[] = getIncome(data);
  const dataCard: StatCardProps[] = getDataCard(data);
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {dataCard.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart income={income} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart {...dataAppointment} />
        </Grid>
      </Grid>
    </Box>
  );
}
