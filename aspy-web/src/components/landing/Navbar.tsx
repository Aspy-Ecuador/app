// aspy-web/src/components/landing/Navbar.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { C, NAV, scrollTo } from "./constants";

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

interface NavbarProps {
  /** Muestra el botón de login o chip de usuario. Default: true */
  showAuthButton?: boolean;
}

export default function Navbar({ showAuthButton = true }: NavbarProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authUser, setAuthUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAuthUser(getStoredUser());
  }, []);

  const handleNav = (id: string) => {
    setDrawerOpen(false);
    setTimeout(() => scrollTo(id), drawerOpen ? 300 : 0);
  };

  const goToPanel = () => navigate("/");

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
          bgcolor: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.08)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, md: 5 },
            py: { xs: 1.5, md: scrolled ? 1.25 : 1.75 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "padding 0.3s ease",
          }}
        >
          {/* Logo */}
          <Box
            onClick={() => scrollTo("hero")}
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                background: `linear-gradient(135deg, ${C.blue}, ${C.pink})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FavoriteRoundedIcon sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.1rem",
                color: scrolled ? C.black : "#fff",
                letterSpacing: "-0.02em",
                transition: "color 0.3s",
              }}
            >
              Fundación{" "}
              <Box component="span" sx={{ color: C.blue }}>
                Aspy
              </Box>
            </Typography>
          </Box>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {NAV.map((item) => (
                <Box
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  sx={{
                    px: 1.75,
                    py: 0.875,
                    borderRadius: 2,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: scrolled ? C.muted : "rgba(255,255,255,0.85)",
                    transition: "all 0.18s",
                    "&:hover": {
                      color: scrolled ? C.black : "#fff",
                      bgcolor: scrolled
                        ? "rgba(0,0,0,0.05)"
                        : "rgba(255,255,255,0.12)",
                    },
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Box>
          )}

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {showAuthButton && (
              authUser ? (
                /* ── Con sesión: chip con nombre ── */
                <Box
                  onClick={goToPanel}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: { xs: 1.25, md: 1.75 },
                    py: { xs: 0.6, md: 0.75 },
                    borderRadius: 50,
                    cursor: "pointer",
                    background: scrolled ? C.blueLight : "rgba(255,255,255,0.15)",
                    border: scrolled
                      ? `1.5px solid ${C.blue}88`
                      : "1.5px solid rgba(255,255,255,0.45)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: scrolled ? C.blueLight : "rgba(255,255,255,0.25)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${C.blue}, ${C.pink})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {getInitial(authUser)}
                  </Box>
                  {!isMobile && (
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: scrolled ? C.blueDark : "#fff",
                        maxWidth: 120,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {getDisplayName(authUser)}
                    </Typography>
                  )}
                  {!isMobile && (
                    <DashboardRoundedIcon
                      sx={{ fontSize: 15, color: scrolled ? C.blue : "rgba(255,255,255,0.7)" }}
                    />
                  )}
                </Box>
              ) : (
                /* ── Sin sesión: botón login ── */
                <Box
                  onClick={() => navigate("/login")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 0.75, md: 0.875 },
                    borderRadius: 2,
                    cursor: "pointer",
                    fontSize: { xs: "0.78rem", md: "0.875rem" },
                    fontWeight: 600,
                    background: scrolled
                      ? `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`
                      : "rgba(255,255,255,0.18)",
                    color: "#fff",
                    border: scrolled ? "none" : "1.5px solid rgba(255,255,255,0.5)",
                    backdropFilter: scrolled ? "none" : "blur(4px)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: `0 6px 20px ${C.blue}55`,
                      background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                      border: "none",
                    },
                  }}
                >
                  <LoginRoundedIcon sx={{ fontSize: 16 }} />
                  {!isMobile && "Ingresar al sistema"}
                </Box>
              )
            )}

            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: scrolled ? C.black : "#fff" }}
              >
                <MenuRoundedIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: C.darkBg, px: 3, py: 4 },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#fff", mb: 3 }}>
          Fundación{" "}
          <Box component="span" sx={{ color: C.blue }}>
            Aspy
          </Box>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {NAV.map((item) => (
            <Box
              key={item.id}
              onClick={() => handleNav(item.id)}
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 500,
                color: "rgba(255,255,255,0.75)",
                transition: "all 0.15s",
                "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>

        {/* Drawer bottom — solo si showAuthButton */}
        {showAuthButton && (
          authUser ? (
            <Box
              onClick={() => { setDrawerOpen(false); goToPanel(); }}
              sx={{
                mt: 4,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                background: `${C.blue}22`,
                border: `1px solid ${C.blue}44`,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.blue}, ${C.pink})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {getInitial(authUser)}
              </Box>
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
                  {getDisplayName(authUser)}
                </Typography>
                <Typography sx={{ color: C.blue, fontSize: "0.75rem" }}>
                  Ir al panel →
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              onClick={() => { setDrawerOpen(false); navigate("/login"); }}
              sx={{
                mt: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                py: 1.5,
                borderRadius: 2,
                cursor: "pointer",
                background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              <LoginRoundedIcon sx={{ fontSize: 18 }} />
              Ingresar al sistema
            </Box>
          )
        )}
      </Drawer>
    </>
  );
}