// FINAL
import Typography from "@mui/material/Typography";

import Paper from "@mui/material/Paper";

interface WelcomePanelProps {
  user: string;
}

export default function WelcomePanel({ user }: WelcomePanelProps) {
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
      <Typography
        variant="h1"
        sx={{
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "text.disabled",
          textAlign: "center",
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
