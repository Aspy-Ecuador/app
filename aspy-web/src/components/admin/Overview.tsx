import { useRoleData } from "@/observer/RoleDataContext";
import PageViewsBarChart, {
  PageViewsBarChartProps,
} from "@admin/PageViewsBarChart";
import {
  getDataAppointment,
  getDataCard,
  getIncome,
  getPayments,
} from "@/utils/utils";
import { dataPayments } from "@/data/Payment";
import StatCard, { StatCardProps } from "@admin/StatCard";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import SessionsChart from "@admin/SessionsChart";
import { PaymentResponse } from "@typesResponse/PaymentResponse";

export default function MainGrid() {
  const { data } = useRoleData();
  const dataAppointment: PageViewsBarChartProps = getDataAppointment(data);
  //const paymentsData: PaymentResponse[] = getPayments(data);
  const income: number[] = getIncome(dataPayments);
  const dataCard: StatCardProps[] = getDataCard(data);
  return (
    <Box
      sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}
      className="xd"
    >
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
