import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { CalcularTendenciaDiaria, TotalIngresosMensual } from "@utils/utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export type SessionsChartProps = {
  income: number[];
};

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("es-ES", { month: "short" });
  const formattedMonthName =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${formattedMonthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function SessionsChart({ income }: SessionsChartProps) {
  const theme = useTheme();
  const fechaActual = new Date();

  const mesActual = fechaActual.getMonth() + 1;
  const anioActual = fechaActual.getFullYear();
  const data = getDaysInMonth(mesActual, anioActual);

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Ingresos
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
              $ {TotalIngresosMensual(income).total}
            </Typography>
            <Chip
              size="small"
              color="success"
              label={CalcularTendenciaDiaria(income).promedioPorcentual + "%"}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Ingresos en los últimos 30 días
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data,
              tickInterval: (index) => (index + 1) % 5 === 0,
            },
          ]}
          series={[
            {
              id: "ingresos",
              label: "Ingresos",
              showMark: false,
              curve: "linear",
              stack: "total",
              stackOrder: "ascending",
              data: income,
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-ingresos": {
              fill: "url('#ingresos')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.primary.dark} id="ingresos" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
