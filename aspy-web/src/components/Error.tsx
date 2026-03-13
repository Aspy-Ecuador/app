import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type ErrorProps = {
  mensaje: string;
};

export default function Error({ mensaje }: ErrorProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h5" color="error">
        {mensaje}
      </Typography>
    </Box>
  );
}
