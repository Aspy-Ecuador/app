// Ventana con la Política de Privacidad. La usan el registro público (FormRegister) y el primer
// ingreso de las cuentas que creó la fundación (ConsentimientoPendiente).
// Candado: el botón de aceptar solo se habilita después de leerla hasta el final.
// Si cambias el texto, sube la versión en `config/politica.ts` y en el backend.
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

const SECCIONES: [titulo: string, texto: string][] = [
  [
    "1. Responsable del tratamiento de los datos",
    'La Fundación ASPY Ecuador (en adelante, "ASPY") es responsable del tratamiento de los datos personales recopilados a través de esta plataforma web y móvil. ASPY se compromete a tratar la información personal de conformidad con la legislación vigente en la República del Ecuador, especialmente con la Ley Orgánica de Protección de Datos Personales (LOPDP), garantizando la confidencialidad, integridad y seguridad de los datos.',
  ],
  [
    "2. Información que recopilamos",
    "Dependiendo del uso de la plataforma, ASPY podrá recopilar información como: Nombres y apellidos, Número de identificación, Fecha de nacimiento, Dirección, Teléfono, Correo electrónico, Información de representantes legales, Información de profesionales, Información relacionada con citas, Historial terapéutico, Diagnósticos y evaluaciones, Registros de asistencia e Información administrativa necesaria para la prestación de los servicios.",
  ],
  [
    "3. Datos personales sensibles",
    "Debido a la naturaleza de los servicios prestados por ASPY, la plataforma podrá tratar datos sensibles relacionados con la salud de los pacientes. Estos datos serán utilizados únicamente para la prestación de los servicios terapéuticos, administrativos y de seguimiento profesional, manteniendo estrictas medidas de seguridad y confidencialidad.",
  ],
  [
    "4. Finalidad del tratamiento",
    "Los datos personales serán utilizados para: Registrar pacientes y representantes, Gestionar citas, Administrar terapias, Elaborar reportes clínicos y administrativos, Gestionar pagos y servicios, Mantener comunicación con representantes y profesionales, Cumplir obligaciones legales y Mejorar la calidad de los servicios ofrecidos.",
  ],
  [
    "5. Confidencialidad",
    "ASPY únicamente permitirá el acceso a la información a personal autorizado que requiera conocerla para el cumplimiento de sus funciones. Todo el personal deberá mantener la confidencialidad de la información tratada.",
  ],
  [
    "6. Conservación de los datos",
    "Los datos personales serán conservados únicamente durante el tiempo necesario para cumplir las finalidades descritas o mientras exista una obligación legal que así lo requiera.",
  ],
  [
    "7. Derechos del titular de los datos",
    "Los titulares de los datos personales, o sus representantes legales cuando corresponda, podrán solicitar: Acceso a sus datos, Rectificación de información incorrecta, Actualización de datos, Eliminación de información cuando proceda, Oposición al tratamiento en los casos previstos por la ley y Portabilidad de los datos cuando sea aplicable. Las solicitudes podrán dirigirse a ASPY mediante los canales oficiales de atención.",
  ],
  [
    "8. Seguridad de la información",
    "ASPY implementa medidas técnicas y organizativas orientadas a proteger los datos personales frente a accesos no autorizados, pérdida, alteración, divulgación o destrucción.",
  ],
  [
    "9. Compartición de información",
    "ASPY no comercializa los datos personales de sus usuarios. La información únicamente podrá compartirse cuando: Sea necesaria para la prestación de los servicios, Exista autorización del titular o su representante legal, o Sea requerida por autoridad competente conforme a la legislación ecuatoriana.",
  ],
  [
    "10. Consentimiento",
    "Al registrarse en esta plataforma, el usuario declara haber leído la presente Política de Privacidad y autoriza expresamente a ASPY para el tratamiento de sus datos personales, incluidos los datos sensibles relacionados con la salud, cuando sean necesarios para la prestación de los servicios ofrecidos por la institución.",
  ],
  [
    "11. Cambios en esta política",
    "ASPY podrá actualizar esta Política de Privacidad cuando sea necesario para cumplir cambios legales o mejoras en los servicios. La versión vigente estará siempre disponible dentro de la plataforma.",
  ],
];

interface DialogoPoliticaProps {
  open: boolean;
  onCerrar: () => void;
  onAceptar: () => void;
  /** Texto del botón de la izquierda. */
  textoCerrar?: string;
  /** Primer ingreso: no se cierra con Escape ni tocando fuera; solo se sale aceptando o con el botón de la izquierda. */
  obligatorio?: boolean;
  /** Explicación que va arriba del texto (por qué aparece la ventana). */
  aviso?: ReactNode;
  aceptando?: boolean;
  error?: string;
}

export default function DialogoPolitica({ open, onCerrar, onAceptar, textoCerrar = "Cerrar", obligatorio = false, aviso, aceptando = false, error }: DialogoPoliticaProps) {
  const [leida, setLeida] = useState(false);
  const contenido = useRef<HTMLDivElement | null>(null);

  // Margen de 50 px para que funcione bien en cualquier celular
  const alFondo = (el: HTMLElement) => el.scrollHeight - el.scrollTop <= el.clientHeight + 50;

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
      slotProps={{ paper: { sx: { borderRadius: 3, maxHeight: vh(85) } } }}
      TransitionProps={{
        // Cada vez que se abre hay que volver a leerla
        onEnter: () => setLeida(false),
        // Si el texto ya cabe completo (pantallas grandes) no hay nada que deslizar: se habilita igual.
        // Sin esto el evento de scroll nunca llega y el botón quedaría bloqueado para siempre.
        onEntered: () => {
          if (contenido.current && alFondo(contenido.current)) setLeida(true);
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "text.primary", pb: 1 }}>
        Política de Privacidad y Tratamiento de Datos Personales
        <Typography variant="caption" display="block" color="text.secondary">
          Última actualización: Julio de 2026
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
          <Alert severity="info" sx={{ mb: 1, borderRadius: 2 }}>
            {aviso}
          </Alert>
        )}
        {SECCIONES.map(([titulo, texto]) => (
          <div key={titulo}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
              {titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {texto}
            </Typography>
          </div>
        ))}
        {error && (
          <Alert severity="error" sx={{ mt: 1, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: "background.default", justifyContent: "space-between", gap: 1 }}>
        <Button onClick={onCerrar} disabled={aceptando} sx={{ color: "text.secondary", textTransform: "none", fontWeight: 600 }}>
          {textoCerrar}
        </Button>
        <Button
          disabled={!leida || aceptando}
          onClick={onAceptar}
          variant="contained"
          // Empieza en el color del texto y, al llegar abajo, cambia suavemente a verde
          sx={{
            minWidth: 190,
            backgroundImage: "none", // el tema pinta los botones con un degradado que taparía el verde
            bgcolor: leida ? "#0F6E56" : "text.primary",
            color: leida ? "#ffffff" : "background.paper",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            transition: "all 0.4s ease",
            "&:hover": { backgroundImage: "none", bgcolor: leida ? "#0F6E56" : "text.primary" },
            "&:disabled": { bgcolor: "text.primary", color: "background.paper", opacity: 0.6 },
          }}
        >
          {aceptando ? <CircularProgress size={20} sx={{ color: "inherit" }} /> : leida ? "Entendido y Acepto" : "Desliza para aceptar ↓"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
