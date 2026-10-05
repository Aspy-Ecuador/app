import { createTheme, alpha } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module "@mui/material/styles" {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface PaletteColor extends ColorRange {}

  // Habilita los tipos de variables CSS (theme.vars, forceThemeRerender…)
  interface CssThemeVariables {
    enabled: true;
  }

  interface Palette {
    baseShadow: string;
    tones: Record<ToneName, Tone>;
    aspy: AspyPalette;
  }

  interface PaletteOptions {
    baseShadow?: string;
    tones?: Record<ToneName, Tone>;
    aspy?: AspyPalette;
  }
}

// Prefijo de las variables CSS que genera MUI (ver AppTheme.tsx)
export const CSS_VAR_PREFIX = "template";

export const paletteVar = (path: string) =>
  `var(--${CSS_VAR_PREFIX}-palette-${path.replace(/\./g, "-")})`;

// ─── Tonos de estado (chips, badges, botones suaves) ─────────────
// bg: fondo suave · fg: texto/ícono · main: color sólido · border: borde suave
type Tone = { bg: string; fg: string; main: string; border: string };
type ToneName =
  | "green"
  | "blue"
  | "red"
  | "amber"
  | "purple"
  | "yellow"
  | "gray";

const tonesLight: Record<ToneName, Tone> = {
  green: { bg: "#E1F5EE", fg: "#0F6E56", main: "#1D9E75", border: "#9FE1CB" },
  blue: { bg: "#E6F1FB", fg: "#185FA5", main: "#378ADD", border: "#B5D4F4" },
  red: { bg: "#FCEBEB", fg: "#A32D2D", main: "#E24B4A", border: "#F7C1C1" },
  amber: { bg: "#FAEEDA", fg: "#854F0B", main: "#BA7517", border: "#FAC775" },
  purple: { bg: "#EEEDFE", fg: "#534AB7", main: "#7F77DD", border: "#AFA9EC" },
  yellow: { bg: "#FAFBE6", fg: "#8A8810", main: "#B9B716", border: "#E5E77A" },
  gray: { bg: "#F5F5F5", fg: "#616161", main: "#9E9E9E", border: "#E0E0E0" },
};

const tonesDark: Record<ToneName, Tone> = {
  green: {
    bg: "rgba(29, 158, 117, 0.16)",
    fg: "#5DCAA5",
    main: "#1D9E75",
    border: "rgba(29, 158, 117, 0.45)",
  },
  blue: {
    bg: "rgba(55, 138, 221, 0.16)",
    fg: "#85B7EB",
    main: "#378ADD",
    border: "rgba(55, 138, 221, 0.45)",
  },
  red: {
    bg: "rgba(226, 75, 74, 0.16)",
    fg: "#F09595",
    main: "#E24B4A",
    border: "rgba(226, 75, 74, 0.45)",
  },
  amber: {
    bg: "rgba(239, 159, 39, 0.16)",
    fg: "#F5C26B",
    main: "#EF9F27",
    border: "rgba(239, 159, 39, 0.45)",
  },
  purple: {
    bg: "rgba(127, 119, 221, 0.18)",
    fg: "#B4AEF0",
    main: "#7F77DD",
    border: "rgba(127, 119, 221, 0.5)",
  },
  yellow: {
    bg: "rgba(229, 231, 122, 0.12)",
    fg: "#E5E77A",
    main: "#B9B716",
    border: "rgba(229, 231, 122, 0.4)",
  },
  gray: {
    bg: "rgba(255, 255, 255, 0.06)",
    fg: "#B4BAC2",
    main: "#8A9099",
    border: "rgba(255, 255, 255, 0.16)",
  },
};

/** Referencias CSS a los tonos; cambian solas entre modo claro y oscuro. */
export const tone = Object.fromEntries(
  (Object.keys(tonesLight) as ToneName[]).map((name) => [
    name,
    {
      bg: paletteVar(`tones.${name}.bg`),
      fg: paletteVar(`tones.${name}.fg`),
      main: paletteVar(`tones.${name}.main`),
      border: paletteVar(`tones.${name}.border`),
    },
  ]),
) as Record<ToneName, Tone>;

// ─── Neutros de marca (landing, perfiles, tarjetas con estilo Aspy) ──
type AspyPalette = {
  text: string;
  muted: string;
  border: string;
  surface: string;
  card: string;
  navBg: string;
  blueLight: string;
  pinkLight: string;
  yellowLight: string;
};

const aspyLight: AspyPalette = {
  text: "#1A1A2E",
  muted: "#5E6E7A",
  border: "#E2EBF0",
  surface: "#FAFBFC",
  card: "#FFFFFF",
  navBg: "rgba(255, 255, 255, 0.96)",
  blueLight: "#D6F0F8",
  pinkLight: "#FCE8ED",
  yellowLight: "#FDF4D0",
};

const aspyDark: AspyPalette = {
  text: "#EEF2F6",
  muted: "#9AA8B4",
  border: "rgba(255, 255, 255, 0.09)",
  surface: "#0E1621",
  card: "#15202C",
  navBg: "rgba(14, 22, 33, 0.92)",
  blueLight: "rgba(91, 184, 212, 0.16)",
  pinkLight: "rgba(232, 160, 176, 0.16)",
  yellowLight: "rgba(240, 200, 74, 0.14)",
};

/** Referencias CSS a los neutros de marca; cambian solas entre modo claro y oscuro. */
export const aspy = Object.fromEntries(
  (Object.keys(aspyLight) as (keyof AspyPalette)[]).map((key) => [
    key,
    paletteVar(`aspy.${key}`),
  ]),
) as AspyPalette;

const defaultTheme = createTheme();

export const brand = {
  50: "hsl(210, 100%, 95%)",
  100: "hsl(210, 100%, 92%)",
  200: "hsl(210, 100%, 80%)",
  300: "hsl(210, 100%, 65%)",
  400: "hsl(210, 98%, 48%)",
  500: "hsl(210, 98%, 42%)",
  600: "hsl(210, 98%, 55%)",
  700: "hsl(210, 100%, 35%)",
  800: "hsl(210, 100%, 16%)",
  900: "hsl(210, 100%, 21%)",
};

export const gray = {
  50: "hsl(220, 35%, 97%)",
  100: "hsl(220, 30%, 94%)",
  200: "hsl(220, 20%, 88%)",
  300: "hsl(220, 20%, 80%)",
  400: "hsl(220, 20%, 65%)",
  500: "hsl(220, 20%, 42%)",
  600: "hsl(220, 20%, 35%)",
  700: "hsl(220, 20%, 25%)",
  800: "hsl(220, 30%, 6%)",
  900: "hsl(220, 35%, 3%)",
};

export const green = {
  50: "hsl(120, 80%, 98%)",
  100: "hsl(120, 75%, 94%)",
  200: "hsl(120, 75%, 87%)",
  300: "hsl(120, 61%, 77%)",
  400: "hsl(120, 44%, 53%)",
  500: "hsl(120, 59%, 30%)",
  600: "hsl(120, 70%, 25%)",
  700: "hsl(120, 75%, 16%)",
  800: "hsl(120, 84%, 10%)",
  900: "hsl(120, 87%, 6%)",
};

export const orange = {
  50: "hsl(45, 100%, 97%)",
  100: "hsl(45, 92%, 90%)",
  200: "hsl(45, 94%, 80%)",
  300: "hsl(45, 90%, 65%)",
  400: "hsl(45, 90%, 40%)",
  500: "hsl(45, 90%, 35%)",
  600: "hsl(45, 91%, 25%)",
  700: "hsl(45, 94%, 20%)",
  800: "hsl(45, 95%, 16%)",
  900: "hsl(45, 93%, 12%)",
};

export const red = {
  50: "hsl(0, 100%, 97%)",
  100: "hsl(0, 92%, 90%)",
  200: "hsl(0, 94%, 80%)",
  300: "hsl(0, 90%, 65%)",
  400: "hsl(0, 90%, 40%)",
  500: "hsl(0, 90%, 30%)",
  600: "hsl(0, 91%, 25%)",
  700: "hsl(0, 94%, 18%)",
  800: "hsl(0, 95%, 12%)",
  900: "hsl(0, 93%, 6%)",
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: "#F4F6F8",
        paper: "hsl(0, 0%, 100%)",
      },
      tones: tonesLight,
      aspy: aspyLight,
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[700],
      },
      info: {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      },
      warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[700],
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: "hsl(220, 10%, 4%)", // Negro casi puro con subtono neutro
        paper: "hsl(220, 10%, 8%)", // Gris súper oscuro
      },
      tones: tonesDark,
      aspy: aspyDark,
      text: {
        primary: "hsl(0, 0%, 100%)",
        secondary: gray[400],
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
    },
  },
};

export const typography = {
  fontFamily: "Inter, sans-serif",
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

export const shape = {
  borderRadius: 8,
};

// @ts-ignore
const defaultShadows: Shadows = [
  "none",
  "var(--template-palette-baseShadow)",
  ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
