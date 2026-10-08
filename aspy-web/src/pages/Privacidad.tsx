// Privacidad y mis datos (menú ⋮, todos los roles): qué aceptó la persona y cuándo, sus derechos,
// la política vigente y, para pacientes y familias, el retiro del consentimiento. La ley pide que
// retirarlo sea tan fácil como darlo (LOPDP, art. 8): por eso se hace aquí, con una confirmación.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SimpleHeader from "@components/SimpleHeader";
import TextoPolitica from "@components/privacidad/TextoPolitica";
import consentimientoAPI, { type EstadoDelConsentimiento } from "@API/consentimientoAPI";
import { FECHA_POLITICA, VERSION_POLITICA } from "@/config/politica";
import { fechaLocal } from "@/utils/utils";
import { tone } from "@shared-theme/themePrimitives";

const tarjetaSx = { p: { xs: 2, sm: 2.5 }, borderRadius: 3, border: "0.5px solid", borderColor: "divider" } as const;
const tituloSx = { fontWeight: 700, fontSize: "1rem", color: "text.primary", mb: 0.75 } as const;
const textoSx = { color: "text.secondary", lineHeight: 1.6 } as const;

export default function Privacidad() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<EstadoDelConsentimiento | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [retirando, setRetirando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;
    consentimientoAPI
      .estado()
      .then((e) => {
        if (vigente) setEstado(e);
      })
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  const retirar = async () => {
    setRetirando(true);
    setError("");
    try {
      await consentimientoAPI.retirar();
      // La cuenta ya quedó deshabilitada y sin sesiones: se limpia este navegador y se explica en el ingreso
      localStorage.removeItem("token");
      localStorage.removeItem("authenticatedUser");
      window.location.assign("/login?motivo=consentimiento");
    } catch {
      setError("No se pudo registrar el retiro. Revisa tu conexión e inténtalo de nuevo.");
      setRetirando(false);
    }
  };

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>
      <SimpleHeader text="Privacidad y mis datos" chip="Privacidad" />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.75, alignItems: "start" }}>
        <Paper elevation={0} sx={tarjetaSx}>
          <Typography component="h2" sx={{ ...tituloSx, display: "flex", alignItems: "center", gap: 0.75 }}>
            <ShieldOutlinedIcon sx={{ fontSize: 19, color: tone.green.fg }} />
            Tu consentimiento
          </Typography>
          {estado?.aceptado_el ? (
            <Typography variant="body2" sx={textoSx}>
              Aceptaste la política de privacidad (versión {estado.version}) el {fechaLocal(estado.aceptado_el)}
              {estado.calidad === "representante" ? ", por medio de tu madre, tu padre o tu representante legal" : ""}. Autorizaste cada punto
              por separado, y puedes volver a leerlos más abajo.
            </Typography>
          ) : (
            <Typography variant="body2" sx={textoSx}>
              La política vigente es la versión {VERSION_POLITICA}, de {FECHA_POLITICA}.
            </Typography>
          )}

          {estado?.puede_retirar ? (
            <>
              <Typography variant="body2" sx={{ ...textoSx, mt: 1.25 }}>
                Puedes retirarlo cuando quieras, sin dar explicaciones y sin costo. Al hacerlo, tu cuenta se deshabilita y ASPY deja de tratar
                tus datos, salvo los que la ley obligue a conservar.
              </Typography>
              <Button
                onClick={() => setConfirmando(true)}
                sx={{
                  mt: 1.5,
                  minHeight: 40,
                  px: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  color: tone.red.fg,
                  bgcolor: tone.red.bg,
                  border: `1px solid ${tone.red.border}`,
                  backgroundImage: "none",
                  "&:hover": { bgcolor: tone.red.border, backgroundImage: "none" },
                }}
              >
                Retirar mi consentimiento
              </Button>
            </>
          ) : (
            estado && (
              <Typography variant="body2" sx={{ ...textoSx, mt: 1.25 }}>
                Si trabajas en ASPY y quieres retirar tu consentimiento, pídelo a la administración de la fundación.
              </Typography>
            )
          )}
        </Paper>

        <Paper elevation={0} sx={tarjetaSx}>
          <Typography component="h2" sx={tituloSx}>
            Tus derechos
          </Typography>
          <Typography variant="body2" sx={textoSx}>
            Puedes pedir a ASPY una copia de tus datos, que los corrija, que los elimine, que deje de usarlos o que te los entregue para
            llevarlos a otra institución. Te responderá sin costo en un máximo de 15 días. Los canales para pedirlo están en el punto 1 de la
            política, y cómo reclamar, en el punto 10.
          </Typography>
          <Button
            onClick={() => navigate("/perfil")}
            variant="outlined"
            size="small"
            sx={{ mt: 1.5, minHeight: 40, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Ver y corregir mis datos
          </Button>
        </Paper>
      </Box>

      <Paper elevation={0} sx={tarjetaSx}>
        <Typography component="h2" sx={{ ...tituloSx, mb: 0.25 }}>
          Política de Privacidad y Tratamiento de Datos Personales
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
          Versión {VERSION_POLITICA} · {FECHA_POLITICA}
        </Typography>
        <TextoPolitica />
      </Paper>

      <Dialog open={confirmando} onClose={() => !retirando && setConfirmando(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>¿Retirar tu consentimiento?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={textoSx}>
            Tu cuenta se deshabilitará de inmediato y ya no podrás entrar. ASPY dejará de tratar tus datos, salvo los que la ley obligue a
            conservar.
          </Typography>
          <Typography variant="body2" sx={{ ...textoSx, mt: 1 }}>
            Si tienes citas pendientes, comunícate con la fundación para cancelarlas.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1, flexDirection: { xs: "column-reverse", sm: "row" }, "& > :not(style) ~ :not(style)": { ml: { xs: 0, sm: 1 } } }}>
          <Button onClick={() => setConfirmando(false)} disabled={retirando} sx={{ textTransform: "none", fontWeight: 600, color: "text.secondary", width: { xs: "100%", sm: "auto" } }}>
            No, conservar mi cuenta
          </Button>
          <Button
            onClick={retirar}
            disabled={retirando}
            variant="contained"
            sx={{
              minWidth: 150,
              minHeight: 40,
              width: { xs: "100%", sm: "auto" },
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              color: "#fff",
              bgcolor: "#C0392B",
              backgroundImage: "none",
              "&:hover": { bgcolor: "#A93226", backgroundImage: "none" },
            }}
          >
            {retirando ? <CircularProgress size={20} sx={{ color: "inherit" }} /> : "Sí, retirar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
