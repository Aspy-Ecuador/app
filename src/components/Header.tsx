import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface HeaderProps {
  textHeader: string;
  isCreate: boolean;
  textIcon?: string;
  handle: () => void;
}

export default function Header({
  textHeader,
  isCreate,
  textIcon,
  handle,
}: HeaderProps) {
  return (
    <Box>
      <Grid container spacing={0}>
        <Grid size={9}>
          <Typography variant="h3">{textHeader}</Typography>
        </Grid>

        <Grid size={3} display="flex" justifyContent="flex-end">
          {isCreate ? (
            <Button
              onClick={handle}
              variant="outlined"
              startIcon={<AddRoundedIcon fontSize="large" />}
              className="guardar"
            >
              {textIcon}
            </Button>
          ) : (
            <Button
              onClick={handle}
              variant="outlined"
              startIcon={<ReplyRoundedIcon fontSize="large" />}
              className="guardar"
            >
              Volver
            </Button>
          )}
        </Grid>
      </Grid>
      <Divider className="divider-paciente-historial"></Divider>
    </Box>
  );
}
