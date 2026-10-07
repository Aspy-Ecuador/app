// FINAL
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { vh } from "@shared-theme/pantallaGrande";

export default function Progress() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: vh(100),
      }}
    >
      <CircularProgress />
    </Box>
  );
}
