// FINAL
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 1.25,
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "text.disabled",
          }}
        >
          {title}
        </Typography>
        {icon && (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "7px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: iconBg ?? "action.hover",
              color: iconColor ?? "text.secondary",
              "& svg": { fontSize: 14 },
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          fontSize: 26,
          fontWeight: 500,
          lineHeight: 1,
          color: "text.primary",
          mb: 0.5,
        }}
      >
        {value}
      </Typography>

      {subtitle && (
        <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
          {subtitle}
        </Typography>
      )}

      {trend && (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            mt: 0.75,
            px: 0.875,
            py: 0.25,
            borderRadius: "20px",
            bgcolor: "#E1F5EE",
          }}
        >
          <Typography sx={{ fontSize: 10, fontWeight: 500, color: "#0F6E56" }}>
            {trend}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
