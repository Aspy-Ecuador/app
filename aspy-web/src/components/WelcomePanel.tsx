// FINAL
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

interface WelcomePanelProps {
  user: string;
}

export default function WelcomePanel({ user }: WelcomePanelProps) {
  const initials = user
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        px: 2.5,
        py: 3,
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          bgcolor: "#E1F5EE",
          color: "#0F6E56",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 500,
        }}
      >
        {initials}
      </Box>
      <Typography
        variant="h1"
        sx={{
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "text.disabled",
        }}
      >
        Bienvenid@ al Panel de Control, ASPY
      </Typography>
      <Typography variant="h1" sx={{ textAlign: "center" }}>
        {user}
      </Typography>
    </Paper>
  );
}
