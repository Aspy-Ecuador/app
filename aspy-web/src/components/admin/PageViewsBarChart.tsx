import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export type PageViewsBarChartProps = {
  total: number;
  scheduled: number[];
  completed: number[];
  cancelled: number[];
};

export default function PageViewsBarChart({
  total,
  scheduled,
  completed,
  cancelled,
}: PageViewsBarChartProps) {
  const theme = useTheme();
  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Número de Citas
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {total}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Cantidad de citas del año pasado
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "band",
              data: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
              ],
            },
          ]}
          series={[
            {
              id: "citas-agendadas",
              label: "Citas Agendadas",
              data: scheduled,
              stack: "A",
            },
            {
              id: "citas-asistidas",
              label: "Citas Asistidas",
              data: completed,
              stack: "A",
            },
            {
              id: "citas-canceladas",
              label: "Citas Canceladas",
              data: cancelled,
              stack: "A",
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
