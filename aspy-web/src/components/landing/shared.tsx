// Piezas compartidas por las secciones de la landing.
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { FaTiktok } from "react-icons/fa";
import type { LandingImage, SocialNetwork } from "@/content/landing/types";
import { responsiveImg } from "@/content/landing/images";
import { C, DISPLAY_FONT, NAV_HEIGHT } from "./constants";

export function SocialIcon({ network, size = 18 }: { network: SocialNetwork; size?: number }) {
  if (network === "tiktok") return <FaTiktok size={size - 2} aria-hidden />;
  const Icon = {
    instagram: InstagramIcon,
    facebook: FacebookIcon,
    youtube: YouTubeIcon,
    linkedin: LinkedInIcon,
  }[network];
  return <Icon sx={{ fontSize: size }} aria-hidden />;
}

// ─── Marca ───────────────────────────────────────────────────────
/** Logo oficial de la fundación (con contorno blanco: sirve en fondos claros y oscuros). */
export function BrandMark({ logo, height = 48 }: { logo: LandingImage; height?: number }) {
  return (
    <Box
      component="img"
      {...responsiveImg(logo.src, `${Math.round(height * 1.6)}px`, [960])}
      alt={logo.alt}
      sx={{ display: "block", height, width: "auto" }}
    />
  );
}

// ─── Aparición al hacer scroll ───────────────────────────────────
export function Reveal({
  children,
  delay = 0,
  sx,
}: {
  children: ReactNode;
  delay?: number;
  sx?: SxProps<Theme>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Box
      ref={ref}
      sx={[
        {
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(28px)",
          transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

// ─── Sección y encabezado ────────────────────────────────────────
export function Section({
  id,
  children,
  sx,
  label,
}: {
  id?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
  /** Nombre accesible de la sección (lectores de pantalla). */
  label?: string;
}) {
  return (
    <Box
      component="section"
      id={id}
      aria-label={label}
      sx={[
        { py: { xs: 9, md: 12 }, scrollMarginTop: NAV_HEIGHT },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2.5, sm: 4, md: 5 } }}>{children}</Box>
    </Box>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  const centered = align === "center";
  return (
    <Box sx={{ textAlign: align, mb: { xs: 5, md: 7 }, maxWidth: centered ? 640 : "none", mx: centered ? "auto" : 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, justifyContent: centered ? "center" : "flex-start", mb: 1.5 }}>
        {[C.blue, C.pink, C.yellow].map((c) => (
          <Box key={c} sx={{ width: 18, height: 4, borderRadius: 2, bgcolor: c }} />
        ))}
        <Typography
          component="span"
          sx={{ ml: 0.5, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: light ? C.yellow : C.blueDark }}
        >
          {eyebrow}
        </Typography>
      </Box>
      <Typography
        component="h2"
        sx={{
          fontFamily: DISPLAY_FONT,
          fontWeight: 800,
          fontSize: { xs: "1.85rem", md: "2.5rem" },
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: light ? "#fff" : C.black,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ mt: 1.75, fontSize: { xs: "1rem", md: "1.08rem" }, lineHeight: 1.75, color: light ? "rgba(255,255,255,0.75)" : C.muted }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
