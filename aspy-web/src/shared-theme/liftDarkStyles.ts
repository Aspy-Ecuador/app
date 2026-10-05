import type { Theme } from "@mui/material/styles";

/**
 * `theme.applyStyles('dark', …)` genera reglas `*:where([data-mui-color-scheme="dark"]) &`
 * que se emiten DESPUÉS de los estilos base del componente. Como tienen la misma
 * especificidad que el `sx`, en modo oscuro el tema termina pisando los colores que
 * cada pantalla define en su `sx` (botones blancos, links negros, inputs claros…).
 *
 * Este helper reescribe esos bloques: cuando el valor claro y el oscuro son de la misma
 * propiedad, el valor base pasa a ser `var(--dk-…, valorClaro)` y el bloque oscuro solo
 * define la variable. El tema se ve igual, pero un `sx` vuelve a ganar en ambos modos.
 */

type StyleObject = Record<string, unknown>;

const isObject = (v: unknown): v is StyleObject =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const varName = (path: string[], key: string) =>
  `--dk-${[...path, key].join("-").replace(/[^a-zA-Z0-9-]/g, "")}`;

function lift(styles: unknown, darkKey: string, path: string[]): unknown {
  if (Array.isArray(styles)) {
    return styles.map((s, i) => lift(s, darkKey, [...path, String(i)]));
  }
  if (!isObject(styles)) return styles;

  const out: StyleObject = {};
  for (const [k, v] of Object.entries(styles)) {
    out[k] = k === darkKey ? v : lift(v, darkKey, [...path, k]);
  }

  const dark = out[darkKey];
  if (isObject(dark)) {
    out[darkKey] = liftPair(out, dark, path);
  }
  return out;
}

// Mueve a variables los valores oscuros que tienen contraparte clara en `base`.
function liftPair(base: StyleObject, dark: StyleObject, path: string[]): StyleObject {
  const rest: StyleObject = {};
  for (const [k, darkValue] of Object.entries(dark)) {
    const lightValue = base[k];
    if (typeof darkValue === "string" && typeof lightValue === "string") {
      const name = varName(path, k);
      base[k] = `var(${name}, ${lightValue})`;
      rest[name] = darkValue;
    } else if (isObject(darkValue) && isObject(lightValue)) {
      // Selectores anidados (p. ej. '&:hover') presentes en ambos modos
      const nestedBase = { ...lightValue };
      const nestedDark = liftPair(nestedBase, darkValue, [...path, k]);
      base[k] = nestedBase;
      rest[k] = nestedDark;
    } else {
      rest[k] = darkValue;
    }
  }
  return rest;
}

const darkSelectorOf = (theme: Pick<Theme, "applyStyles">) =>
  Object.keys(theme.applyStyles("dark", { color: "inherit" }))[0];

export function liftDarkStyles<T extends object>(components: T): T {
  const result: Record<string, unknown> = {};
  for (const [name, config] of Object.entries(components)) {
    if (!isObject(config) || !isObject(config.styleOverrides)) {
      result[name] = config;
      continue;
    }
    const overrides: StyleObject = {};
    for (const [slot, style] of Object.entries(config.styleOverrides)) {
      overrides[slot] =
        typeof style === "function"
          ? (props: { theme: Theme }) => {
              const darkKey = darkSelectorOf(props.theme);
              const raw = style(props);
              return darkKey ? lift(raw, darkKey, [name, slot]) : raw;
            }
          : style;
    }
    result[name] = { ...config, styleOverrides: overrides };
  }
  return result as T;
}
