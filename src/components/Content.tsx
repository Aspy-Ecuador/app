import ThemedLogo from "@/shared-theme/ThemedLogo";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: "column",
        alignSelf: "center",
        gap: 4,
        maxWidth: 450,
      }}
    >
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <Grid container>
          <Grid size={12}>
            <Typography textAlign="center" variant="h1">
              Bienvenido a
            </Typography>
          </Grid>
          <Grid size={12}>
            <ThemedLogo />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
