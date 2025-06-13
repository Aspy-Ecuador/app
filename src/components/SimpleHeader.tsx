import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";

interface SimpleHeaderProps {
  text: string;
}

export default function SimpleHeader({ text }: SimpleHeaderProps) {
  return (
    <Box>
      <Grid container spacing={0}>
        <Grid size={9} marginBottom={"4px"}>
          <Typography variant="h3">{text}</Typography>
        </Grid>
      </Grid>
      <Divider className="divider-paciente-historial"></Divider>
    </Box>
  );
}
