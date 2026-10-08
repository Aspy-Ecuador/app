// Texto de la política de privacidad, listo para mostrar (ventana de consentimiento y página
// "Privacidad y mis datos"). Los datos de contacto de la fundación salen de Sanity → Contacto.
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useLandingContent } from "@/content/landing/useLandingContent";
import { formatPhoneEc } from "@/content/landing/format";
import { seccionesPolitica } from "./seccionesPolitica";

export default function TextoPolitica() {
  const { contact } = useLandingContent();
  const secciones = seccionesPolitica({
    direccion: contact.address.trim(),
    telefono: formatPhoneEc(contact.phone || contact.whatsapp),
    correo: contact.email.trim(),
  });

  return (
    <>
      {secciones.map((seccion) => (
        <Box key={seccion.titulo} component="section" sx={{ mb: 2.5 }}>
          <Typography component="h3" variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75, color: "text.primary" }}>
            {seccion.titulo}
          </Typography>
          {seccion.parrafos.map((texto) => (
            <Typography key={texto} variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
              {texto}
            </Typography>
          ))}
          {seccion.lista && (
            <Box component="ul" sx={{ m: 0, mb: 1, pl: 2.5, color: "text.secondary" }}>
              {seccion.lista.map((item) => (
                <Typography key={item} component="li" variant="body2" sx={{ mb: 0.5, lineHeight: 1.6 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          )}
          {seccion.cierre?.map((texto) => (
            <Typography key={texto} variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
              {texto}
            </Typography>
          ))}
        </Box>
      ))}
    </>
  );
}
