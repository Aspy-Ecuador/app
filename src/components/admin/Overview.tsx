import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import PageViewsBarChart, {
  PageViewsBarChartProps,
} from "@admin/PageViewsBarChart";
import SessionsChart from "@admin/SessionsChart";
import StatCard, { StatCardProps } from "@admin/StatCard";
import { citas } from "@data/Citas";

const data: StatCardProps[] = [
  {
    title: "Usuarios",
    value: "20",
    interval: "Últimos 30 días",
    trend: "usuarios",
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340,
      380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: "Citas",
    value: "23",
    interval: "Últimos 30 días",
    trend: "citas",
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600,
      820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300,
      220,
    ],
  },
  {
    title: "Pacientes",
    value: "10",
    interval: "Últimos 30 días",
    trend: "pacientes",
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510,
      530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
  {
    title: "Usuarios inactivos",
    value: "2",
    interval: "Últimos 30 días",
    trend: "inactivos",
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510,
      530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

const income: number[] = [
  28, 34, 26, 38, 22, 36, 33, 29, 25, 32, 40, 30, 24, 22, 35, 31, 27, 38, 23,
  40, 21, 32, 29, 26, 37, 28, 39, 25, 22, 31,
];

const citasDatos: PageViewsBarChartProps = {
  total: citas.length,
  asistidas: [15, 8, 12, 19, 17, 13, 11, 16, 14, 9, 18, 20],
  canceladas: [18, 16, 14, 10, 15, 12, 13, 9, 7, 5, 4, 3],
  noAsistidas: [11, 13, 8, 12, 10, 16, 14, 18, 20, 19, 17, 15],
};

export default function MainGrid() {
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
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart income={income} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart {...citasDatos} />
        </Grid>
      </Grid>
    </Box>
  );
}
