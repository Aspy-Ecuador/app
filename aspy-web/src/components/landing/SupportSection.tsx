// Aliados y donaciones. Cada bloque aparece solo si tiene contenido.
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import type { DonationAccount, LandingContent } from "@/content/landing/types";
import { responsiveImg } from "@/content/landing/images";
import { C, DISPLAY_FONT, focusRing } from "./constants";
import { Reveal, Section, SectionHeader } from "./shared";

const etiquetaSx = { fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted } as const;
const valorSx = { m: 0, fontWeight: 600, color: C.black, overflowWrap: "anywhere" } as const;

/** Texto limpio de un dato que viene del CMS (puede faltar o no ser texto si no pasó por el Studio). */
const texto = (valor: unknown): string => (typeof valor === "string" ? valor.trim() : "");

/** Los datos de una cuenta en el orden en que los pide el banco para transferir. */
function datosDeCuenta(cuenta: DonationAccount): { etiqueta: string; valor: string; enlace?: string }[] {
  const tipo = cuenta.accountType === "corriente" ? "Corriente" : cuenta.accountType === "ahorros" ? "Ahorros" : "";
  return [
    { etiqueta: "Tipo de cuenta", valor: tipo },
    { etiqueta: "Número de cuenta", valor: texto(cuenta.accountNumber) },
    { etiqueta: "Titular", valor: texto(cuenta.holderName) },
    { etiqueta: cuenta.holderIdType === "cedula" ? "Cédula" : "RUC", valor: texto(cuenta.holderId) },
    { etiqueta: "Correo", valor: texto(cuenta.email), enlace: texto(cuenta.email) ? `mailto:${texto(cuenta.email)}` : undefined },
  ].filter((d) => d.valor !== "");
}

export default function SupportSection({ content }: { content: LandingContent["support"] }) {
  const { partners, donation } = content;
  // Una cuenta sin banco o sin número no sirve para transferir: no se muestra
  const cuentas = donation.accounts.filter((c) => texto(c?.bank) && texto(c?.accountNumber));
  const hayDatos = cuentas.length > 0 || donation.details.length > 0;
  const hasDonation = hayDatos || Boolean(donation.cta?.href);
  if (partners.length === 0 && !hasDonation) return null;
  // Con varias cuentas (o cuentas y otros datos) los datos van debajo, a todo el ancho; con una sola ficha, al lado
  const fichas = cuentas.length + (donation.details.length > 0 ? 1 : 0);
  const alLado = fichas === 1;
  const tarjetaSx = { m: 0, p: 3, borderRadius: "20px", bgcolor: C.card, border: "1px solid", borderColor: C.border, minWidth: 0 } as const;

  return (
    <Section id="aliados" label="Aliados y donaciones" sx={{ bgcolor: C.card }}>
      <Reveal>
        <SectionHeader eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
      </Reveal>

      {partners.length > 0 && (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
          {partners.map((p, i) => {
            const hasLogo = Boolean(p.logo?.src);
            const inner = hasLogo ? (
              <Box
                component="img"
                {...responsiveImg(p.logo!.src, "160px", [320, 640])}
                alt={p.logo!.alt || p.name}
                loading="lazy"
                decoding="async"
                sx={{ maxHeight: 56, maxWidth: "100%", width: "auto", objectFit: "contain", display: "block" }}
              />
            ) : (
              <>
                <HandshakeRoundedIcon sx={{ color: C.blueDark, fontSize: 24, flexShrink: 0 }} />
                <Typography component="span" sx={{ fontWeight: 700, color: C.black, lineHeight: 1.3 }}>{p.name}</Typography>
              </>
            );
            const cardSx = {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.25,
              // Tamaño parejo para que logos anchos y cuadrados se vean uniformes
              width: { xs: 150, sm: 190 },
              height: { xs: 84, sm: 100 },
              px: 2.5,
              borderRadius: "18px",
              // Los logos casi siempre están pensados para fondo blanco: recuadro blanco también en modo oscuro
              bgcolor: hasLogo ? "#FFFFFF" : C.offWhite,
              border: "1px solid",
              borderColor: hasLogo ? "rgba(26,26,46,0.08)" : C.border,
              boxShadow: hasLogo ? "0 6px 18px rgba(18,38,58,0.06)" : "none",
              textAlign: "center",
              textDecoration: "none",
              transition: "border-color 0.2s, transform 0.2s",
              "&:hover": { borderColor: `${C.blue}88`, transform: "translateY(-2px)" },
              ...focusRing,
            };
            return (
              <li key={p.name}>
                <Reveal delay={i * 0.06}>
                  {p.url ? (
                    <Box component="a" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name} title={p.name} sx={cardSx}>
                      {inner}
                    </Box>
                  ) : (
                    <Box title={p.name} sx={cardSx}>{inner}</Box>
                  )}
                </Reveal>
              </li>
            );
          })}
        </Box>
      )}

      {hasDonation && (
        <Reveal sx={{ mt: partners.length ? { xs: 6, md: 8 } : 0 }}>
          <Box
            sx={{
              maxWidth: alLado ? 880 : 1040,
              mx: "auto",
              p: { xs: 3, sm: 3.5, md: 5 },
              borderRadius: "28px",
              background: `linear-gradient(135deg, ${C.blueLight}, ${C.pinkLight} 55%, ${C.yellowLight})`,
              border: "1px solid",
              borderColor: C.border,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: alLado ? "1.1fr 0.9fr" : "1fr" },
              gap: { xs: 3, md: alLado ? 5 : 3.5 },
              alignItems: "center",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <VolunteerActivismRoundedIcon sx={{ fontSize: 40, color: C.pinkDark, mb: 1.5 }} />
              <Typography component="h3" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.8rem" }, color: C.black, mb: 1.25 }}>
                {donation.title}
              </Typography>
              <Typography sx={{ color: C.muted, lineHeight: 1.8, maxWidth: 640 }}>{donation.description}</Typography>
              {donation.cta?.href && (
                <Box
                  component="a"
                  href={donation.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "inline-flex",
                    mt: 3,
                    px: 3,
                    py: 1.3,
                    borderRadius: 50,
                    fontWeight: 700,
                    color: "#fff",
                    textDecoration: "none",
                    background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`,
                    ...focusRing,
                  }}
                >
                  {donation.cta.label}
                </Box>
              )}
            </Box>

            {hayDatos && (
              <Box
                sx={{
                  display: "grid",
                  // Las fichas se reparten solas: una por línea en el celular, hasta tres en pantallas anchas
                  gridTemplateColumns: alLado ? "1fr" : { xs: "1fr", sm: "repeat(auto-fit, minmax(250px, 1fr))" },
                  gap: 2,
                  minWidth: 0,
                }}
              >
                {cuentas.map((cuenta, i) => (
                  <Box key={`${cuenta.bank}-${cuenta.accountNumber}-${i}`} component="article" aria-label={`Cuenta para donar: ${cuenta.bank}`} sx={tarjetaSx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
                      <Box sx={{ width: 38, height: 38, borderRadius: "12px", display: "grid", placeItems: "center", flex: "none", bgcolor: C.blueLight, color: C.blueDark }}>
                        <AccountBalanceRoundedIcon sx={{ fontSize: 21 }} />
                      </Box>
                      <Typography component="h4" sx={{ m: 0, fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: "1.08rem", lineHeight: 1.25, color: C.black, overflowWrap: "anywhere" }}>
                        {cuenta.bank}
                      </Typography>
                    </Box>
                    <Box component="dl" sx={{ m: 0 }}>
                      {datosDeCuenta(cuenta).map((d) => (
                        <Box key={d.etiqueta} sx={{ "&:not(:last-of-type)": { mb: 1.5 } }}>
                          <Typography component="dt" sx={etiquetaSx}>
                            {d.etiqueta}
                          </Typography>
                          <Typography component="dd" sx={{ ...valorSx, ...(d.etiqueta === "Número de cuenta" ? { fontSize: "1.1rem", letterSpacing: "0.03em" } : {}) }}>
                            {d.enlace ? (
                              <Box component="a" href={d.enlace} sx={{ color: C.blueDark, textDecorationThickness: "1px", borderRadius: "4px", ...focusRing }}>
                                {d.valor}
                              </Box>
                            ) : (
                              d.valor
                            )}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}

                {donation.details.length > 0 && (
                  <Box component="dl" sx={tarjetaSx}>
                    {donation.details.map((d) => (
                      <Box key={d.label} sx={{ "&:not(:last-of-type)": { mb: 1.75 } }}>
                        <Typography component="dt" sx={etiquetaSx}>
                          {d.label}
                        </Typography>
                        <Typography component="dd" sx={valorSx}>
                          {d.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Reveal>
      )}
    </Section>
  );
}
