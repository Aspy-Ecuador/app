import { useTheme } from "@mui/material/styles";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { CalcularTendenciaDiaria } from "@utils/utils";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: "usuarios" | "citas" | "pacientes" | "inactivos";
  data: number[];
};

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getLastMonthAndYear(): { month: number; year: number } {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth(); // 0-based: enero=0, diciembre=11

  if (month === 0) {
    // Si es enero, el mes pasado es diciembre del año anterior
    month = 11;
    year = year - 1;
  } else {
    month = month - 1;
  }

  // Queremos el mes 1-based para tu función getDaysInMonth
  return { month: month + 1, year };
}

export default function StatCard({
  title,
  value,
  interval,
  trend,
  data,
}: StatCardProps) {
  const { month, year } = getLastMonthAndYear();
  const theme = useTheme();
  const daysInWeek = getDaysInMonth(month, year);

  const trendColors = {
    usuarios:
      theme.palette.mode === "light"
        ? theme.palette.info.main
        : theme.palette.info.dark,
    citas:
      theme.palette.mode === "light"
        ? theme.palette.warning.main
        : theme.palette.warning.dark,
    pacientes:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
    inactivos:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
  };

  const labelColors = {
    usuarios: "info" as const,
    pacientes: "default" as const,
    citas: "warning" as const,
    inactivos: "error" as const,
  };

  const color = labelColors[trend];
  const chartColor = trendColors[trend];
  const trendValues = {
    usuarios: CalcularTendenciaDiaria(data).promedioPorcentual + "%",
    pacientes: CalcularTendenciaDiaria(data).promedioPorcentual + "%",
    citas: CalcularTendenciaDiaria(data).promedioPorcentual + "%",
    inactivos: CalcularTendenciaDiaria(data).promedioPorcentual + "%",
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="h4" component="p">
                {value}
              </Typography>
              <Chip size="small" color={color} label={trendValues[trend]} />
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {interval}
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 50 }}>
            <SparkLineChart
              colors={[chartColor]}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: "band",
                data: daysInWeek, // Use the correct property 'data' for xAxis
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
