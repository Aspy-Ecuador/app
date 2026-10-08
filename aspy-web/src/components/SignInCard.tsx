// FINAL
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "@API/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { aspy } from "@shared-theme/themePrimitives";
import { AuthCard, AuthLogo } from "@components/auth/AuthShell";
import { authButtonSx, authFieldSx, authLabelSx, authLinkSx } from "@components/auth/estilos";
import { DISPLAY_FONT } from "@components/landing/constants";

// El campo no reserva espacio para la ayuda: aquí solo aparece cuando hay un error
const campoSx = { ...authFieldSx, "& .MuiFormHelperText-root": { mx: 0.25, mt: 0.5, fontSize: "0.78rem", lineHeight: 1.35 } };

const MENSAJE_DESHABILITADA =
  "Tu cuenta está deshabilitada. Comunícate con el administrador de la fundación.";

const MENSAJE_CONSENTIMIENTO_RETIRADO =
  "Retiraste tu consentimiento y tu cuenta quedó deshabilitada. Si fue un error o quieres volver, comunícate con la fundación.";

export default function SignInCard() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Si la cuenta se deshabilitó con la sesión abierta, el sistema vuelve aquí con ?motivo=deshabilitada;
  // si la persona retiró su consentimiento (Privacidad y mis datos), con ?motivo=consentimiento
  const [loginError, setLoginError] = useState(() => {
    const motivo = new URLSearchParams(window.location.search).get("motivo");
    if (motivo === "deshabilitada") return MENSAJE_DESHABILITADA;
    if (motivo === "consentimiento") return MENSAJE_CONSENTIMIENTO_RETIRADO;
    return "";
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [olvido, setOlvido] = useState(false);

  const loginUser = async () => {
    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        setLoginError(MENSAJE_DESHABILITADA);
      } else if (status === 429) {
        setLoginError("Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.");
      } else {
        setLoginError("Credenciales incorrectas. Por favor, intente de nuevo.");
      }
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
    <AuthCard maxWidth={440}>
      {/* Logo (solo móvil; en pantallas grandes va al lado) */}
      <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center" }}>
        <AuthLogo height={92} />
      </Box>

      {/* Encabezado */}
      <Box>
        <Typography
          component="h1"
          sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: "1.7rem", lineHeight: 1.15, letterSpacing: "-0.02em", color: aspy.text }}
        >
          Inicia sesión
        </Typography>
        <Typography sx={{ mt: 0.75, fontSize: "0.95rem", lineHeight: 1.5, color: aspy.muted }}>
          Ingresa con tu correo y tu contraseña.
        </Typography>
      </Box>

      {/* Error de login */}
      {loginError && (
        <Alert severity="error" onClose={() => setLoginError("")} sx={{ borderRadius: 3, fontSize: "0.88rem" }}>
          {loginError}
        </Alert>
      )}

      {/* Formulario */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}
      >
        <Box>
          <Box component="label" htmlFor="email" sx={authLabelSx}>
            Correo electrónico
          </Box>
          <TextField
            id="email"
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
            sx={campoSx}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box component="label" htmlFor="password" sx={authLabelSx}>
            Contraseña
          </Box>
          <TextField
            id="password"
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="Tu contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (loginError) setLoginError("");
            }}
            autoComplete="current-password"
            required
            fullWidth
            sx={campoSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ border: 0, bgcolor: "transparent", width: 32, height: 32 }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Link
            component="button"
            type="button"
            onClick={() => setOlvido((v) => !v)}
            sx={{ ...authLinkSx, alignSelf: "flex-end", mt: 1, fontSize: "0.84rem", fontWeight: 600 }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>

        {olvido && (
          <Alert severity="info" onClose={() => setOlvido(false)} sx={{ borderRadius: 3, fontSize: "0.88rem" }}>
            Por seguridad, la contraseña la restablece la fundación. Comunícate con la secretaría o la
            administración de ASPY y te asignarán una nueva para que puedas ingresar.
          </Alert>
        )}

        <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ ...authButtonSx(), mt: 0.5 }}>
          {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Iniciar sesión"}
        </Button>
      </Box>

      <Typography sx={{ textAlign: "center", fontSize: "0.92rem", color: aspy.muted }}>
        ¿No tienes una cuenta?{" "}
        <Link component={RouterLink} to="/register" sx={authLinkSx}>
          Regístrate
        </Link>
      </Typography>
    </AuthCard>
  );
}
