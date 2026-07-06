// FINAL
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { inputRegisterUserConfig } from "@/config/userFormRegister";
import type { UserForm } from "@/typesRequest/UserForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import UserInput from "@forms/UserInput";

// Imports para la Política de Privacidad
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

interface FormRegisterProps {
  start: number;
  end: number;
  onNext: (data: UserForm) => void;
  onBack: () => void;
  onFinish: (data: UserForm) => void;
  isLast?: boolean;
  load?: boolean;
}

export default function FormRegister({
  start,
  end,
  onNext,
  onBack,
  onFinish,
  isLast,
  load,
}: FormRegisterProps) {
  const methods = useForm<UserForm>();

  // Estados para controlar la Política de Privacidad
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [openPolicy, setOpenPolicy] = useState(false);

  // Estado para saber si llegó al fondo
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  // Referencia al contenedor scrolleable del modal (para detectar si ya cabe sin scroll)
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    methods.reset({
      first_name: "",
      last_name: "",
      email: "",
      birthdate: "",
      password: "",
      password_confirmation: "",
      role_id: 3,
      phone: { number: "", type: "" },
      identification: { type: "", number: "" },
      address: {
        type: "",
        country_id: 0,
        state_id: 0,
        city_id: 0,
        primary_address: "",
        secondary_address: "",
      },
    });
  }, [methods]);

  // Observa la provincia seleccionada
  const selectedStateId = Number(
    useWatch({ control: methods.control, name: "address.state_id" }) ?? 0,
  );

  // Resetea la ciudad cuando cambia la provincia
  useEffect(() => {
    if (selectedStateId) {
      methods.setValue("address.city_id", 0);
    }
  }, [selectedStateId]);

  // Filtra ciudades según la provincia seleccionada
  const list_inputs = inputRegisterUserConfig.slice(start, end).map((input) => {
    const resolvedOptions = input.dependsOn
      ? input.options?.filter((opt) => opt.state_id === selectedStateId)
      : input.options;

    return (
      <Box key={input.key} sx={{ minWidth: 0, width: "100%" }}>
        <UserInput
          label={input.label}
          type={input.type}
          id={input.key}
          validation={
            input.key === "password_confirmation"
              ? {
                  ...input.validation,
                  validate: (value: string) =>
                    value === methods.getValues("password") ||
                    "Las contraseñas no coinciden",
                }
              : input.validation
          }
          options={resolvedOptions}
        />
      </Box>
    );
  });

  const onSubmit = methods.handleSubmit((data) => {
    if (isLast) {
      onFinish(data);
    } else {
      onNext(data);
    }
  });

  // Detecta el scroll en el modal
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Margen de 50px para asegurar que funcione bien en cualquier celular
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setIsScrolledToBottom(true);
    }
  };

  // Si el contenido ya cabe completo (no requiere scroll), habilita "Aceptar" igual.
  // Sin esto, en pantallas grandes o poco texto el evento onScroll nunca se dispara
  // y el botón queda bloqueado para siempre.
  const checkContentFit = () => {
    const el = contentRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 50) {
      setIsScrolledToBottom(true);
    }
  };

  const handleOpenPolicy = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenPolicy(true);
    setIsScrolledToBottom(false); // Resetea el estado cada vez que lo abre
  };

  // CANDADO: intercepta el clic ANTES de que el navegador alcance a togglear
  // el input nativo. Así el checkbox nunca puede marcarse "de facto"; el único
  // camino para que acceptedTerms sea true es el botón del modal tras leer todo.
  const handleCheckboxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setOpenPolicy(true);
      setIsScrolledToBottom(false);
    } else {
      setAcceptedTerms(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
            mb: 3,
            width: "100%",
            boxSizing: "border-box",
            "& > *": { minWidth: 0 },
          }}
        >
          {list_inputs}
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* COMPONENTE DE POLÍTICA DE PRIVACIDAD */}
        {isLast && (
          <Box sx={{ mb: 3, p: 2, bgcolor: "rgba(15, 110, 86, 0.04)", borderRadius: 2, border: "1px solid #E1F5EE" }}>
            <FormControlLabel
              // Evita que un clic en el <label> dispare el toggle nativo del input;
              // el único manejador válido es handleCheckboxClick sobre el propio Checkbox.
              onClick={(e) => e.preventDefault()}
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onClick={handleCheckboxClick}
                  // onChange se deja vacío a propósito: toda la lógica vive en onClick
                  // para que ningún toggle nativo pueda "ganarle" a la validación.
                  onChange={() => {}}
                  sx={{
                    color: "rgba(0, 0, 0, 0.45)",
                    "&.Mui-checked": { color: "#0F6E56" },
                    "& .MuiSvgIcon-root": { fontSize: 26 },
                    p: "6px",
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
                  He leído y acepto la{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={handleOpenPolicy}
                    sx={{
                      fontWeight: 600, color: "#0F6E56", textDecoration: "underline", textUnderlineOffset: 2,
                      "&:hover": { color: "#0a4d3c" },
                    }}
                  >
                    Política de Privacidad y el Tratamiento de Datos Personales
                  </Link>{" "}
                  de ASPY Ecuador.
                </Typography>
              }
            />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: start !== 0 ? "space-between" : "flex-end",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {start !== 0 && (
            <Button
              variant="text"
              onClick={onBack}
              startIcon={<ChevronLeftRoundedIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              Anterior
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            onClick={onSubmit}
            // Bloquea el botón si está cargando, o si es el último paso y no ha aceptado
            disabled={!!load || (isLast && !acceptedTerms)}
            startIcon={
              !load && isLast ? (
                <CheckRoundedIcon fontSize="small" />
              ) : undefined
            }
            endIcon={
              !load && !isLast ? (
                <ChevronRightRoundedIcon fontSize="small" />
              ) : undefined
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
              px: 4,
              py: 1.1,
              borderRadius: 2.5,
              fontSize: "0.92rem",
              minWidth: 140,
              background: isLast
                ? "linear-gradient(135deg, #0F6E56 0%, #1B8C6E 100%)"
                : "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
              boxShadow: isLast
                ? "0 4px 14px rgba(15,110,86,0.35)"
                : "0 4px 14px rgba(25,118,210,0.35)",
              "&:hover": {
                boxShadow: isLast
                  ? "0 6px 20px rgba(15,110,86,0.45)"
                  : "0 6px 20px rgba(25,118,210,0.45)",
              },
              "&:disabled": {
                background: "rgba(0,0,0,0.12)",
                boxShadow: "none",
              },
            }}
          >
            {load ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : isLast ? (
              "Registrarse"
            ) : (
              "Siguiente"
            )}
          </Button>
        </Box>
      </form>

      {/* VENTANA FLOTANTE DE LA POLÍTICA */}
      <Dialog
        open={openPolicy}
        onClose={() => setOpenPolicy(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: { borderRadius: 3, maxHeight: "85vh" },
          },
        }}
        // Al terminar la animación de apertura, verifica si el contenido ya cabe sin scroll
        TransitionProps={{
          onEntered: checkContentFit,
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#111827", pb: 1 }}>
          Política de Privacidad y Tratamiento de Datos Personales
          <Typography variant="caption" display="block" color="text.secondary">
            Última actualización: Julio de 2026
          </Typography>
        </DialogTitle>

        {/* ref agregado para poder medir scrollHeight/clientHeight desde checkContentFit */}
        <DialogContent
          ref={contentRef}
          dividers
          sx={{ p: { xs: 2, md: 4 } }}
          onScroll={handleScroll}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>1. Responsable del tratamiento de los datos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            La Fundación ASPY Ecuador (en adelante, "ASPY") es responsable del tratamiento de los datos personales recopilados a través de esta plataforma web y móvil. ASPY se compromete a tratar la información personal de conformidad con la legislación vigente en la República del Ecuador, especialmente con la Ley Orgánica de Protección de Datos Personales (LOPDP), garantizando la confidencialidad, integridad y seguridad de los datos.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>2. Información que recopilamos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Dependiendo del uso de la plataforma, ASPY podrá recopilar información como: Nombres y apellidos, Número de identificación, Fecha de nacimiento, Dirección, Teléfono, Correo electrónico, Información de representantes legales, Información de profesionales, Información relacionada con citas, Historial terapéutico, Diagnósticos y evaluaciones, Registros de asistencia e Información administrativa necesaria para la prestación de los servicios.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>3. Datos personales sensibles</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Debido a la naturaleza de los servicios prestados por ASPY, la plataforma podrá tratar datos sensibles relacionados con la salud de los pacientes. Estos datos serán utilizados únicamente para la prestación de los servicios terapéuticos, administrativos y de seguimiento profesional, manteniendo estrictas medidas de seguridad y confidencialidad.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>4. Finalidad del tratamiento</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los datos personales serán utilizados para: Registrar pacientes y representantes, Gestionar citas, Administrar terapias, Elaborar reportes clínicos y administrativos, Gestionar pagos y servicios, Mantener comunicación con representantes y profesionales, Cumplir obligaciones legales y Mejorar la calidad de los servicios ofrecidos.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>5. Confidencialidad</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ASPY únicamente permitirá el acceso a la información a personal autorizado que requiera conocerla para el cumplimiento de sus funciones. Todo el personal deberá mantener la confidencialidad de la información tratada.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>6. Conservación de los datos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los datos personales serán conservados únicamente durante el tiempo necesario para cumplir las finalidades descritas o mientras exista una obligación legal que así lo requiera.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>7. Derechos del titular de los datos</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los titulares de los datos personales, o sus representantes legales cuando corresponda, podrán solicitar: Acceso a sus datos, Rectificación de información incorrecta, Actualización de datos, Eliminación de información cuando proceda, Oposición al tratamiento en los casos previstos por la ley y Portabilidad de los datos cuando sea aplicable. Las solicitudes podrán dirigirse a ASPY mediante los canales oficiales de atención.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>8. Seguridad de la información</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ASPY implementa medidas técnicas y organizativas orientadas a proteger los datos personales frente a accesos no autorizados, pérdida, alteración, divulgación o destrucción.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>9. Compartición de información</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ASPY no comercializa los datos personales de sus usuarios. La información únicamente podrá compartirse cuando: Sea necesaria para la prestación de los servicios, Exista autorización del titular o su representante legal, o Sea requerida por autoridad competente conforme a la legislación ecuatoriana.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>10. Consentimiento</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Al registrarse en esta plataforma, el usuario declara haber leído la presente Política de Privacidad y autoriza expresamente a ASPY para el tratamiento de sus datos personales, incluidos los datos sensibles relacionados con la salud, cuando sean necesarios para la prestación de los servicios ofrecidos por la institución.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>11. Cambios en esta política</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ASPY podrá actualizar esta Política de Privacidad cuando sea necesario para cumplir cambios legales o mejoras en los servicios. La versión vigente estará siempre disponible dentro de la plataforma.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "background.default", justifyContent: "space-between" }}>
          <Button onClick={() => setOpenPolicy(false)} sx={{ color: "text.secondary", textTransform: "none", fontWeight: 600 }}>
            Cerrar
          </Button>
          <Button
            disabled={!isScrolledToBottom}
            onClick={() => {
              setAcceptedTerms(true);
              setOpenPolicy(false);
            }}
            variant="contained"
            // Empieza en negro (#111827) y al llegar abajo cambia suavemente a Verde (#0F6E56)
            sx={{
              bgcolor: isScrolledToBottom ? "#0F6E56" : "#111827",
              color: isScrolledToBottom ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.4s ease",
              "&:hover": {
                bgcolor: isScrolledToBottom ? "#0a4d3c" : "#111827"
              },
              "&:disabled": {
                bgcolor: "#111827",
                color: "rgba(255, 255, 255, 0.5)"
              }
            }}
          >
            {/* Si no ha bajado, le indicamos qué hacer. Si ya bajó, le permite aceptar */}
            {isScrolledToBottom ? "Entendido y Acepto" : "Desliza para aceptar ↓"}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}