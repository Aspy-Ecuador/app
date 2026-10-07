// FINAL
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { inputRegisterUserConfig } from "@/config/userFormRegister";
import type { UserForm } from "@/typesRequest/UserForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CampoRegistro from "@forms/CampoRegistro";
import { OCUPACION_OTRA, reglaOcupacionOtra } from "@/config/reglasContacto";
import ButtonBase from "@mui/material/ButtonBase";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

// Imports para la Política de Privacidad
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import DialogoPolitica from "@components/privacidad/DialogoPolitica";
import { aspy, tone } from "@shared-theme/themePrimitives";
import { authButtonSx } from "@components/auth/estilos";
import { DISPLAY_FONT } from "@components/landing/constants";

interface FormRegisterProps {
  start: number;
  end: number;
  onNext: (data: UserForm) => void;
  onBack: () => void;
  onFinish: (data: UserForm, acceptedPrivacyPolicy: boolean) => void;
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
        country_id: 1, // Ecuador (única opción)
        state_id: "" as unknown as number,
        city_id: "" as unknown as number,
        primary_address: "",
        secondary_address: "",
      },
      occupation_other: "",
    });
  }, [methods]);

  const ocupacion = Number(useWatch({ control: methods.control, name: "occupation_id" }) ?? 0);

  // Observa la provincia seleccionada
  const selectedStateId = Number(
    useWatch({ control: methods.control, name: "address.state_id" }) ?? 0,
  );

  // Resetea la ciudad cuando cambia la provincia
  useEffect(() => {
    if (selectedStateId) {
      methods.setValue("address.city_id", "" as unknown as number);
    }
  }, [selectedStateId]);

  // Ayudas cortas bajo algunos campos
  const AYUDAS: Record<string, string> = {
    "identification.number": "Solo números",
    "phone.number": "Ej.: 0991234567",
    "address.primary_address": "Calle principal y número",
    "address.secondary_address": "Intersección o referencia",
    password: "Mínimo 8 caracteres",
  };
  const ETIQUETAS: Record<string, string> = {
    email: "Correo electrónico",
    password_confirmation: "Confirmar contraseña",
  };

  // El rol no se elige: el registro público siempre crea una cuenta de cliente
  const list_inputs = inputRegisterUserConfig
    .slice(start, end)
    .filter((input) => input.key !== "role_id")
    .flatMap((input) => {
      const resolvedOptions = input.dependsOn
        ? input.options?.filter((opt) => opt.state_id === selectedStateId)
        : input.options;

      const campo = (
        <Box key={input.key} sx={{ minWidth: 0, width: "100%" }}>
          <CampoRegistro
            label={ETIQUETAS[input.key] ?? input.label}
            type={input.type}
            id={input.key}
            ayuda={AYUDAS[input.key]}
            disabled={input.key === "address.city_id" && !selectedStateId}
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

      // Ocupación "Otra": aparece un campo para escribirla
      if (input.key === "occupation_id" && ocupacion === OCUPACION_OTRA) {
        return [
          campo,
          <Box key="occupation_other" sx={{ minWidth: 0, width: "100%" }}>
            <CampoRegistro
              id="occupation_other"
              label="¿Cuál es tu ocupación?"
              type="text"
              validation={reglaOcupacionOtra}
              placeholder="Ej.: Diseñadora gráfica"
            />
          </Box>,
        ];
      }
      return [campo];
    });

  const INTRO = [
    { titulo: "Cuéntanos sobre ti", texto: "Tus datos personales. Solo los ve el equipo de la fundación." },
    { titulo: "¿Cómo te contactamos?", texto: "Tu teléfono y tu dirección, para coordinar tus citas." },
    { titulo: "Crea tu acceso", texto: "Con este correo y esta contraseña entrarás al sistema." },
  ];
  const intro = INTRO[start === 0 ? 0 : isLast ? 2 : 1];

  const onSubmit = methods.handleSubmit((data) => {
    if (isLast) {
      onFinish(data, acceptedTerms);
    } else {
      onNext(data);
    }
  });

  const handleOpenPolicy = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenPolicy(true);
  };

  // CANDADO: intercepta el clic ANTES de que el navegador alcance a togglear
  // el input nativo. Así el checkbox nunca puede marcarse "de facto"; el único
  // camino para que acceptedTerms sea true es el botón del modal tras leer todo.
  const handleCheckboxClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setOpenPolicy(true);
    } else {
      setAcceptedTerms(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <Box sx={{ mb: 3 }}>
          <Typography component="h2" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.01em", color: aspy.text }}>
            {intro.titulo}
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: "0.92rem", lineHeight: 1.5, color: aspy.muted }}>{intro.texto}</Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            columnGap: 2.5,
            rowGap: 1.25,
            mb: 2,
            width: "100%",
            boxSizing: "border-box",
            "& > *": { minWidth: 0 },
          }}
        >
          {list_inputs}
        </Box>

        {/* CONSENTIMIENTO: tarjeta que solo se marca después de leer la política completa */}
        {isLast && (
          <ButtonBase
            onClick={handleCheckboxClick}
            role="checkbox"
            aria-checked={acceptedTerms}
            focusRipple
            sx={{
              width: "100%",
              mb: 3,
              p: 2,
              gap: 1.75,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              textAlign: "left",
              borderRadius: "16px",
              border: "1.5px solid",
              borderColor: acceptedTerms ? tone.green.main : aspy.border,
              bgcolor: acceptedTerms ? tone.green.bg : aspy.surface,
              transition: "border-color 0.25s, background-color 0.25s, box-shadow 0.25s",
              "&:hover": { borderColor: tone.green.main, boxShadow: "0 6px 18px rgba(15,110,86,0.12)" },
              "&.Mui-focusVisible": { outline: "3px solid", outlineColor: tone.green.main, outlineOffset: "2px" },
            }}
          >
            <Box
              sx={{
                mt: "2px",
                flex: "none",
                display: "grid",
                placeItems: "center",
                color: acceptedTerms ? tone.green.fg : "text.disabled",
                transition: "transform 0.25s",
                transform: acceptedTerms ? "scale(1.08)" : "scale(1)",
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            >
              {acceptedTerms ? <CheckCircleRoundedIcon sx={{ fontSize: 28 }} /> : <RadioButtonUncheckedRoundedIcon sx={{ fontSize: 28 }} />}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: "text.primary", display: "flex", alignItems: "center", gap: 0.75 }}>
                <ShieldOutlinedIcon sx={{ fontSize: 17, color: tone.green.fg }} />
                {acceptedTerms ? "Aceptaste la política de privacidad" : "Acepta la política de privacidad"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5, mt: 0.25 }}>
                He leído y acepto la{" "}
                <Link
                  component="span"
                  role="button"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleOpenPolicy(e);
                  }}
                  sx={{ fontWeight: 600, color: tone.green.fg, textDecoration: "underline", textUnderlineOffset: 2, cursor: "pointer" }}
                >
                  Política de Privacidad y el Tratamiento de Datos Personales
                </Link>{" "}
                de ASPY Ecuador.
              </Typography>
              {!acceptedTerms && (
                <Typography sx={{ fontSize: "0.78rem", color: "text.disabled", mt: 0.5 }}>
                  Toca aquí para leerla: se marca cuando terminas de leerla.
                </Typography>
              )}
            </Box>
          </ButtonBase>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: start !== 0 ? "space-between" : "flex-end",
            alignItems: "center",
            gap: 1.5,
            pt: 2.5,
            borderTop: "1px solid",
            borderColor: aspy.border,
          }}
        >
          {start !== 0 && (
            <Button
              variant="text"
              onClick={onBack}
              startIcon={<ChevronLeftRoundedIcon />}
              sx={{
                minHeight: 46,
                px: 2,
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 600,
                color: aspy.muted,
                "&:hover": { color: aspy.text, bgcolor: aspy.surface },
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
            sx={{ ...authButtonSx(isLast ? "verde" : "azul"), minWidth: 150 }}
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

      {/* Política de privacidad: solo se puede aceptar después de leerla completa */}
      <DialogoPolitica
        open={openPolicy}
        onCerrar={() => setOpenPolicy(false)}
        onAceptar={() => {
          setAcceptedTerms(true);
          setOpenPolicy(false);
        }}
      />
    </FormProvider>
  );
}
