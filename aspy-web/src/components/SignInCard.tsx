// FINAL
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "@API/auth";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ThemedLogo from "@/shared-theme/ThemedLogo";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2.5),
  borderRadius: 20,
  border: "1px solid",
  borderColor: theme.palette.divider,
  boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
  [theme.breakpoints.up("sm")]: {
    width: "420px",
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
  }),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.02)",
    "& fieldset": {
      borderColor: theme.palette.divider,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function SignInCard() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Credenciales incorrectas. Por favor, intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateInputs();
    if (!isValid) return;
    await loginUser();
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage(
        "Por favor, introduzca una dirección de correo electrónico válida.",
      );
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 4) {
      setPasswordError(true);
      setPasswordErrorMessage(
        "La contraseña debe tener al menos 4 caracteres.",
      );
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <Card variant="outlined">
      {/* Logo (solo móvil) */}
      <Box
        sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center" }}
      >
        <ThemedLogo />
      </Box>

      {/* Encabezado */}
      <Box sx={{ mb: 0.5 }}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontWeight: 800, mb: 0.5 }}
        >
          Bienvenido de nuevo
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Ingresa tus credenciales para continuar
        </Typography>
      </Box>

      {/* Error de login */}
      {loginError && (
        <Alert
          severity="error"
          onClose={() => setLoginError("")}
          sx={{ borderRadius: 2, fontSize: "0.82rem" }}
        >
          {loginError}
        </Alert>
      )}

      {/* Formulario */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl>
          <FormLabel
            htmlFor="email"
            sx={{ fontWeight: 600, fontSize: "0.85rem", mb: 0.5 }}
          >
            Correo electrónico
          </FormLabel>
          <StyledTextField
            error={emailError}
            helperText={emailErrorMessage}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (loginError) setLoginError("");
            }}
            type="email"
            name="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            size="small"
            color={emailError ? "error" : "primary"}
          />
        </FormControl>

        <FormControl>
          <FormLabel
            htmlFor="password"
            sx={{ fontWeight: 600, fontSize: "0.85rem", mb: 0.5 }}
          >
            Contraseña
          </FormLabel>
          <StyledTextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="•••••••••"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (loginError) setLoginError("");
            }}
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            size="small"
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 0.5,
            py: 1.25,
            borderRadius: 2.5,
            fontWeight: 700,
            fontSize: "0.95rem",
            textTransform: "none",
            background: "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
            boxShadow: "0 4px 14px rgba(25,118,210,0.35)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(25,118,210,0.45)",
            },
            "&:disabled": {
              background: "rgba(0,0,0,0.12)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={22} sx={{ color: "white" }} />
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </Box>

      <Divider sx={{ fontSize: "0.78rem", color: "text.secondary" }}>o</Divider>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: "text.secondary" }}
      >
        ¿No tienes una cuenta?{" "}
        <Link
          onClick={() => navigate("/register")}
          component="button"
          sx={{
            fontWeight: 600,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Regístrate
        </Link>
      </Typography>
    </Card>
  );
}
