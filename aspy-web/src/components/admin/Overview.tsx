import PageViewsBarChart, {
  PageViewsBarChartProps,
} from "@admin/PageViewsBarChart";
import { useRoleData } from "@/observer/RoleDataContext";
import { AppointmentResponse } from "@/types/responses/AppointmentResponse";
import { PaymentResponse } from "@/types/responses/PaymentResponse";
import { PersonResponse } from "@/types/responses/PersonResponse";
import { getDataAppointment, getDataCard, getIncome } from "@/utils/utils";
import { useEffect, useState } from "react";
import StatCard, { StatCardProps } from "@admin/StatCard";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import SessionsChart from "@admin/SessionsChart";
import Progress from "@components/Progress";

export default function MainGrid() {
  const { loading } = useRoleData();

  const [dataAppointment, setDataAppointment] =
    useState<PageViewsBarChartProps | null>(null);
  const [dataCard, setDataCard] = useState<StatCardProps[]>([]);
  const [income, setIncome] = useState<number[]>([]);

  useEffect(() => {
    if (!loading) {
      const appointments: AppointmentResponse[] = JSON.parse(
        localStorage.getItem("appointments") || "[]",
      );
      const payments: PaymentResponse[] = JSON.parse(
        localStorage.getItem("payments") || "[]",
      );
      const persons: PersonResponse[] = JSON.parse(
        localStorage.getItem("persons") || "[]",
      );

      const formattedData: PageViewsBarChartProps =
        getDataAppointment(appointments);
      setDataAppointment(formattedData);

      const incomeData: number[] = getIncome(payments);
      setIncome(incomeData);

      const cardData: StatCardProps[] = getDataCard(persons, appointments);
      setDataCard(cardData);
    }
  }, [loading]);

  if (
    loading ||
    !dataAppointment ||
    dataCard.length === 0 ||
    income.length === 0
  ) {
    return <Progress />;
  }

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
