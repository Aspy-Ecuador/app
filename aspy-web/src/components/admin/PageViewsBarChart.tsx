// FINAL
import { BarChart } from "@mui/x-charts/BarChart";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type PageViewsBarChartProps = {
  total: number;
  scheduled: number[];
  completed: number[];
  cancelled: number[];
  saved: number[];
};

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

export default function PageViewsBarChart({
  total,
  scheduled,
  completed,
  cancelled,
  saved,
}: PageViewsBarChartProps) {
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
          Número de citas
        </Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 500 }}>{total}</Typography>
        <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
          Cantidad de citas durante el año
        </Typography>
      </Box>

      {/* Chart */}
      <Box sx={{ px: 1, pb: 1 }}>
        <BarChart
          borderRadius={4}
          colors={["#1D9E75", "#378ADD", "#E24B4A", "#d5c916"]}
          xAxis={[{ scaleType: "band", data: MONTHS }]}
          series={[
            {
              id: "agendadas",
              label: "Agendadas",
              data: scheduled,
              stack: "A",
            },
            {
              id: "asistidas",
              label: "Asistidas",
              data: completed,
              stack: "A",
            },
            {
              id: "canceladas",
              label: "Canceladas",
              data: cancelled,
              stack: "A",
            },
            {
              id: "guardadas",
              label: "Guardadas",
              data: saved,
              stack: "A",
            },
          ]}
          height={200}
          margin={{ left: 48, right: 12, top: 16, bottom: 24 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiChartsAxis-tickLabel": {
              fontSize: "10px !important",
              fill: "var(--mui-palette-text-disabled)",
            },
            "& .MuiChartsGrid-line": {
              stroke: "var(--mui-palette-divider)",
              strokeWidth: 0.5,
            },
            "& .MuiChartsLegend-root text": { fontSize: "10px !important" },
          }}
          slotProps={{
            legend: {
              position: { vertical: "bottom" },
            },
          }}
        />
      </Box>
    </Paper>
  );
}
