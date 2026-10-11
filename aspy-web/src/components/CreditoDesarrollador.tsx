// "Desarrollado por Carlos Salazar", con el ícono de GitHub enlazado a su perfil.
// Va en el menú lateral del sistema y en el pie del sitio web; ambos tienen fondo oscuro en los dos
// modos, así que el texto es claro. El tamaño y los márgenes los pone cada lugar con `sx`.
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";

const DESARROLLADOR = {
  nombre: "Carlos Salazar",
  usuario: "Carlossv03",
  perfil: "https://github.com/Carlossv03",
} as const;

export default function CreditoDesarrollador({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Box
      component="p"
      sx={[{ m: 0, display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: "0.4em", fontSize: "0.82rem", lineHeight: 1.4, color: "rgba(255,255,255,0.5)" }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      Desarrollado por
      <Box
        component="a"
        href={DESARROLLADOR.perfil}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${DESARROLLADOR.nombre} en GitHub (${DESARROLLADOR.usuario}), se abre en otra pestaña`}
        title={`GitHub: ${DESARROLLADOR.usuario}`}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35em",
          fontWeight: 600,
          color: "rgba(255,255,255,0.8)",
          textDecoration: "none",
          borderRadius: "6px",
          "&:hover": { color: "#fff", textDecoration: "underline" },
          "&:focus-visible": { outline: "2px solid #4BA3D3", outlineOffset: "2px" },
        }}
      >
        <GitHubIcon sx={{ fontSize: "1.25em" }} />
        {DESARROLLADOR.nombre}
      </Box>
    </Box>
  );
}
