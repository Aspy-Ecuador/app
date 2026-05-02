// FINAL
import { useRoleData } from "@/observer/RoleDataContext";
import PageViewsBarChart from "@admin/PageViewsBarChart";
import SessionsChart from "@admin/SessionsChart";
import StatCard from "@admin/StatCard";
import { getDataAppointment, getDataCard, getIncome } from "@/utils/utils";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

const ICON_MAP: Record<
  number,
  { icon: React.ReactNode; bg: string; color: string }
> = {
  0: { icon: <EmojiPeopleIcon />, bg: "#E1F5EE", color: "#0F6E56" },
  1: { icon: <CalendarMonthOutlinedIcon />, bg: "#E6F1FB", color: "#185FA5" },
  2: { icon: <PeopleOutlinedIcon />, bg: "#EEEDFE", color: "#534AB7" },
  3: { icon: <AccessibilityNewIcon />, bg: "#FAEEDA", color: "#854F0B" },
};

export default function Overview() {
  const { data } = useRoleData();
  const dataAppointment = getDataAppointment(data);
  const income = getIncome(data);
  const dataCard = getDataCard(data);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={1.25}>
        {/* StatCards */}
        {dataCard.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              {...card}
              icon={ICON_MAP[index]?.icon}
              iconBg={ICON_MAP[index]?.bg}
              iconColor={ICON_MAP[index]?.color}
            />
          </Grid>
        ))}

        {/* Charts */}
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
