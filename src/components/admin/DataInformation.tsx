import { ButtonAdmin } from "@/types/ButtonAdmin";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

interface DataInformationProps {
  buttonsData: ButtonAdmin[];
}

export default function DataInformation({ buttonsData }: DataInformationProps) {
  return (
    <>
      {buttonsData.map((btn, index) => (
        <IconButton key={index} size="large" className="botones-admin">
          {btn.icon}
          <Grid container sx={{ marginLeft: 2 }}>
            <Grid size={12}>
              <Typography variant="body1" className="typo-tittle-boton">
                {btn.label}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography variant="body1" className="typo-number-boton">
                {btn.value}
              </Typography>
            </Grid>
          </Grid>
        </IconButton>
      ))}
    </>
  );
}
