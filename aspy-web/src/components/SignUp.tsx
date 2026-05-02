// FINAL
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import AppTheme from "@shared-theme/AppTheme";
import RegisterView from "@components/RegisterView";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4, 5),
  gap: theme.spacing(2.5),
  margin: "auto",
  borderRadius: 20,
  border: "1px solid",
  borderColor: theme.palette.divider,
  boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
  [theme.breakpoints.up("sm")]: {
    width: "680px",
  },
  [theme.breakpoints.up("md")]: {
    width: "760px",
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100dvh",
  padding: theme.spacing(2),
  overflowY: "auto",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          {/* Encabezado */}
          <Box sx={{ textAlign: "center", mb: 0.5 }}>
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontWeight: 800, mb: 0.5 }}
            >
              Crear cuenta en ASPY
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Completa los pasos para registrarte como cliente
            </Typography>
          </Box>

          {/* Formulario multi-paso */}
          <RegisterView />

          <Divider sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
            o
          </Divider>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "text.secondary" }}
          >
            ¿Ya tienes una cuenta?{" "}
            <Link
              onClick={() => navigate("/login")}
              component="button"
              sx={{
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Iniciar sesión
            </Link>
          </Typography>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
