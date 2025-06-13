import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface WelcomePanelProps {
  user: string;
}

export default function WelcomePanel({ user }: WelcomePanelProps) {
  return (
    <Box>
      <Typography variant="h3" className="h1-panel">
        Bienvenid@ al Panel de Control, ASPY
      </Typography>
      <Typography variant="h3" className="h2-panel">
        {user}
      </Typography>
    </Box>
  );
}
