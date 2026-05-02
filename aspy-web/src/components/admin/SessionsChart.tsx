// FINAL
import { LineChart } from "@mui/x-charts/LineChart";
import { TotalIngresosMensual } from "@utils/utils";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type SessionsChartProps = { income: number[] };

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

const MONTHS = [
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

export default function SessionsChart({ income }: SessionsChartProps) {
  const total = TotalIngresosMensual(income).total;

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "0.5px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.disabled",
            mb: 0.5,
          }}
        >
          Ingresos mensuales
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 500 }}>
            ${total}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
          Ingresos del mes pasado
        </Typography>
      </Box>

      {/* Chart */}
      <Box sx={{ px: 1, pb: 1 }}>
        <LineChart
          colors={["#1D9E75"]}
          xAxis={[
            {
              scaleType: "point",
              data: MONTHS,
              tickInterval: (_, i) => i % 3 === 0,
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
          height={200}
          margin={{ left: 48, right: 12, top: 16, bottom: 24 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-ingresos": { fill: "url('#ingresos')" },
            "& .MuiChartsAxis-tickLabel": {
              fontSize: "10px !important",
              fill: "var(--mui-palette-text-disabled)",
            },
            "& .MuiChartsGrid-line": {
              stroke: "var(--mui-palette-divider)",
              strokeWidth: 0.5,
            },
          }}
          //slotProps={}
        >
          <AreaGradient color="#1D9E75" id="ingresos" />
        </LineChart>
      </Box>
    </Paper>
  );
}
