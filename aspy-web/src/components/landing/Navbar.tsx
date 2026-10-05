// aspy-web/src/components/landing/Navbar.tsx
import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import type { LandingContent } from "@/content/landing/types";
import { C, NAV_ITEMS, NAV_HEIGHT, focusRing, scrollTo } from "./constants";
import { BrandMark } from "./shared";

interface StoredUser {
  firstName?: string;
  name?: string;
  lastName?: string;
}

function getStoredUser(): StoredUser | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const raw = localStorage.getItem("authenticatedUser");
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

function getInitial(user: StoredUser): string {
  return (user.firstName ?? user.name ?? "U")[0].toUpperCase();
}

function getDisplayName(user: StoredUser): string {
  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`;
  return user.firstName ?? user.name ?? "Mi cuenta";
}

/** Botón principal reutilizable (pill con degradado de marca). */
const primaryPill = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  px: 2.25,
  py: 1,
  borderRadius: 50,
  fontSize: "0.875rem",
  fontWeight: 700,
  color: "#fff",
  textDecoration: "none",
  background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
  boxShadow: `0 6px 18px ${C.blue}40`,
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": { transform: "translateY(-1px)", boxShadow: `0 10px 24px ${C.blue}55` },
  ...focusRing,
};

interface NavbarProps {
  navigation: LandingContent["navigation"];
  logo: LandingContent["site"]["logo"];
  /** Muestra los botones de ingreso/agenda o el chip de usuario. Default: true */
  showAuthButton?: boolean;
}

export default function Navbar({ navigation, logo, showAuthButton = true }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authUser] = useState<StoredUser | null>(getStoredUser);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToSection = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setDrawerOpen(false);
    setTimeout(() => scrollTo(id), drawerOpen ? 250 : 0);
  };

  const light = !scrolled; // sobre el hero oscuro el texto es claro

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
          bgcolor: scrolled ? C.navBg : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.08)" : "none",
          borderBottom: "1px solid",
          borderColor: scrolled ? C.border : "transparent",
        }}
      >
        <Box
          component="nav"
          aria-label="Principal"
          sx={{
            maxWidth: 1180,
            mx: "auto",
            px: { xs: 2.5, sm: 4, md: 5 },
            height: NAV_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            component="a"
            href="#hero"
            onClick={(e: MouseEvent) => goToSection(e, "hero")}
            aria-label="Ir al inicio"
            sx={{ textDecoration: "none", borderRadius: 2, ...focusRing }}
          >
            <BrandMark logo={logo} height={isMobile ? 62 : 76} />
          </Box>

          {!isMobile && (
            <Box component="ul" sx={{ display: "flex", alignItems: "center", gap: 0.25, listStyle: "none", m: 0, p: 0 }}>
              {NAV_ITEMS.map(({ key, id }) => (
                <li key={id}>
                  <Box
                    component="a"
                    href={`#${id}`}
                    onClick={(e: MouseEvent) => goToSection(e, id)}
                    sx={{
                      display: "block",
                      px: 1.5,
                      py: 0.875,
                      borderRadius: 2,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      color: light ? "rgba(255,255,255,0.85)" : C.muted,
                      transition: "color 0.18s, background-color 0.18s",
                      "&:hover": {
                        color: light ? "#fff" : C.black,
                        bgcolor: light ? "rgba(255,255,255,0.12)" : `${C.blue}1A`,
                      },
                      ...focusRing,
                    }}
                  >
                    {navigation.labels[key]}
                  </Box>
                </li>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {showAuthButton && !isMobile &&
              (authUser ? (
                <Box
                  component={RouterLink}
                  to="/dashboard"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pl: 0.75,
                    pr: 1.75,
                    py: 0.625,
                    borderRadius: 50,
                    textDecoration: "none",
                    background: light ? "rgba(255,255,255,0.15)" : C.blueLight,
                    border: `1.5px solid ${light ? "rgba(255,255,255,0.45)" : `${C.blue}88`}`,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-1px)" },
                    ...focusRing,
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${C.blue}, ${C.pink})`,
                      display: "grid",
                      placeItems: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {getInitial(authUser)}
                  </Box>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: light ? "#fff" : C.blueDark,
                      maxWidth: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getDisplayName(authUser)}
                  </Typography>
                  <DashboardRoundedIcon sx={{ fontSize: 15, color: light ? "rgba(255,255,255,0.7)" : C.blue }} />
                </Box>
              ) : (
                <>
                  <Box
                    component={RouterLink}
                    to="/login"
                    sx={{
                      px: 1.75,
                      py: 1,
                      borderRadius: 50,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      color: light ? "#fff" : C.black,
                      "&:hover": { bgcolor: light ? "rgba(255,255,255,0.12)" : `${C.blue}1A` },
                      ...focusRing,
                    }}
                  >
                    {navigation.loginLabel}
                  </Box>
                  <Box component={RouterLink} to="/register" sx={primaryPill}>
                    <EventAvailableRoundedIcon sx={{ fontSize: 17 }} />
                    {navigation.ctaLabel}
                  </Box>
                </>
              ))}

            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir menú"
                sx={{
                  color: light ? "#fff" : C.black,
                  borderColor: light ? "rgba(255,255,255,0.35)" : C.border,
                  bgcolor: light ? "rgba(255,255,255,0.08)" : "transparent",
                }}
              >
                <MenuRoundedIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* Menú móvil */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, bgcolor: C.darkBg, px: 3, py: 3, backgroundImage: "none" } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
          <BrandMark logo={logo} height={64} />
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar menú"
            sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)", bgcolor: "transparent" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {NAV_ITEMS.map(({ key, id }) => (
            <li key={id}>
              <Box
                component="a"
                href={`#${id}`}
                onClick={(e: MouseEvent) => goToSection(e, id)}
                sx={{
                  display: "block",
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.8)",
                  "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                  ...focusRing,
                }}
              >
                {navigation.labels[key]}
              </Box>
            </li>
          ))}
        </Box>

        {showAuthButton && (
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 1.25 }}>
            {authUser ? (
              <Box component={RouterLink} to="/dashboard" sx={{ ...primaryPill, justifyContent: "center", py: 1.4 }}>
                <DashboardRoundedIcon sx={{ fontSize: 18 }} />
                Ir a mi panel
              </Box>
            ) : (
              <>
                <Box component={RouterLink} to="/register" sx={{ ...primaryPill, justifyContent: "center", py: 1.4 }}>
                  <EventAvailableRoundedIcon sx={{ fontSize: 18 }} />
                  {navigation.ctaLabel}
                </Box>
                <Box
                  component={RouterLink}
                  to="/login"
                  sx={{
                    textAlign: "center",
                    py: 1.3,
                    borderRadius: 50,
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    fontWeight: 600,
                    textDecoration: "none",
                    ...focusRing,
                  }}
                >
                  {navigation.loginLabel}
                </Box>
              </>
            )}
          </Box>
        )}
      </Drawer>
    </>
  );
}
