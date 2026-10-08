// Ventana con la Política de Privacidad y el consentimiento. La usan el registro público
// (FormRegister) y el primer ingreso de las cuentas que creó la fundación (ConsentimientoPendiente).
// Para aceptar hay que leerla hasta el final y marcar, una por una, las casillas que están ahí.
// Si cambias el texto (seccionesPolitica.ts) o las casillas, sube la versión en `config/politica.ts` y en el backend.
import { useRef, useState, type ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { vh } from "@shared-theme/pantallaGrande";
import { FECHA_POLITICA, VERSION_POLITICA, type Consentimiento, type Declaracion } from "@/config/politica";
import TextoPolitica from "./TextoPolitica";
import CasillasConsentimiento from "./CasillasConsentimiento";
import { armarConsentimiento, CONSENTIMIENTO_VACIO, queFalta, type EstadoConsentimiento, type ModoRepresentante } from "./consentimiento";

interface DialogoPoliticaProps {
  open: boolean;
  onCerrar: () => void;
  onAceptar: (consentimiento: Consentimiento) => void;
  /** Declaraciones que debe aceptar esta persona (dependen de su rol). */
  declaraciones: Declaracion[];
  /** Si el consentimiento debe o puede darlo un representante legal (depende de la edad). */
  representante?: ModoRepresentante;
  /** Texto del botón de la izquierda. */
  textoCerrar?: string;
  /** Primer ingreso: no se cierra con Escape ni tocando fuera; solo se sale aceptando o con el botón de la izquierda. */
  obligatorio?: boolean;
  /** Explicación que va arriba del texto (por qué aparece la ventana). */
  aviso?: ReactNode;
  aceptando?: boolean;
  error?: string;
}

export default function DialogoPolitica({
  open,
  onCerrar,
  onAceptar,
  declaraciones,
  representante = "no",
  textoCerrar = "Cerrar",
  obligatorio = false,
  aviso,
  aceptando = false,
  error,
}: DialogoPoliticaProps) {
  const [leida, setLeida] = useState(false);
  const [estado, setEstado] = useState<EstadoConsentimiento>(CONSENTIMIENTO_VACIO);
  const contenido = useRef<HTMLDivElement | null>(null);

  // Margen de 50 px para que funcione bien en cualquier celular
  const alFondo = (el: HTMLElement) => el.scrollHeight - el.scrollTop <= el.clientHeight + 50;

  const consentimiento = armarConsentimiento(estado, declaraciones, representante);
  const listo = leida && consentimiento !== null;

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!obligatorio) onCerrar();
      }}
      disableEscapeKeyDown={obligatorio}
      maxWidth="md"
      fullWidth
      scroll="paper"
      slotProps={{ paper: { sx: { borderRadius: 3, maxHeight: vh(88) } } }}
      TransitionProps={{
        // Cada vez que se abre hay que volver a leerla y a marcar las casillas
        onEnter: () => {
          setLeida(false);
          setEstado(CONSENTIMIENTO_VACIO);
        },
        // Si el texto ya cabe completo (pantallas grandes) no hay nada que deslizar: se habilita igual.
        // Sin esto el evento de scroll nunca llega y el botón quedaría bloqueado para siempre.
        onEntered: () => {
          if (contenido.current && alFondo(contenido.current)) setLeida(true);
        },
      }}
    >
      {/* En celular el título es más chico: en tres líneas grandes le quitaba espacio al texto */}
      <DialogTitle sx={{ fontWeight: 800, color: "text.primary", pb: 1, fontSize: { xs: "1.05rem", sm: "1.25rem" }, lineHeight: 1.3 }}>
        Política de Privacidad y Tratamiento de Datos Personales
        <Typography variant="caption" display="block" color="text.secondary">
          Versión {VERSION_POLITICA} · {FECHA_POLITICA}
        </Typography>
      </DialogTitle>

      <DialogContent
        ref={contenido}
        dividers
        sx={{ p: { xs: 2, md: 4 } }}
        onScroll={(e) => {
          if (alFondo(e.currentTarget)) setLeida(true);
        }}
      >
        {aviso && (
          <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
            {aviso}
          </Alert>
        )}
        <TextoPolitica />
        <CasillasConsentimiento declaraciones={declaraciones} modo={representante} estado={estado} onCambio={setEstado} deshabilitado={aceptando} />
        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      {/* En celular los botones van uno sobre otro (aceptar arriba), para que quepan en cualquier ancho */}
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          bgcolor: "background.default",
          justifyContent: "space-between",
          flexDirection: { xs: "column-reverse", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1,
          "& > :not(style) ~ :not(style)": { ml: { xs: 0, sm: 1 } },
        }}
      >
        <Button onClick={onCerrar} disabled={aceptando} sx={{ whiteSpace: "nowrap", color: "text.secondary", textTransform: "none", fontWeight: 600 }}>
          {textoCerrar}
        </Button>
        <Button
          disabled={!listo || aceptando}
          onClick={() => consentimiento && onAceptar(consentimiento)}
          variant="contained"
          // Empieza en el color del texto y, cuando todo está completo, cambia suavemente a verde
          sx={{
            minWidth: 210,
            minHeight: { xs: 44, sm: 36 },
            whiteSpace: "nowrap",
            backgroundImage: "none", // el tema pinta los botones con un degradado que taparía el verde
            bgcolor: listo ? "#0F6E56" : "text.primary",
            color: listo ? "#ffffff" : "background.paper",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            transition: "all 0.4s ease",
            "&:hover": { backgroundImage: "none", bgcolor: listo ? "#0F6E56" : "text.primary" },
            "&:disabled": { bgcolor: "text.primary", color: "background.paper", opacity: 0.6 },
          }}
        >
          {aceptando ? (
            <CircularProgress size={20} sx={{ color: "inherit" }} />
          ) : listo ? (
            "Acepto"
          ) : leida ? (
            queFalta(estado, declaraciones, representante)
          ) : (
            "Desliza para leerla ↓"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
