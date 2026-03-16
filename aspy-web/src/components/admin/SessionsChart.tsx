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

export default function SessionsChart({ income }: SessionsChartProps) {
  const theme = useTheme();

  const data = [
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
  ];

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
            Ingresos del mes pasado
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
