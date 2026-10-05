// Número que cuenta desde 0 hasta su valor cuando entra en pantalla.
// Acepta textos como "+1.200", "98%" o "10 años": anima solo la parte numérica
// y deja el prefijo/sufijo tal cual (resaltados con `affixColor`).
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

interface ParsedValue {
  prefix: string;
  number: number;
  decimals: number;
  suffix: string;
}

/** Separa "+1.200 personas" en prefijo "+", número 1200 y sufijo " personas". */
function parseValue(value: string): ParsedValue | null {
  const m = value.match(/^(\D*?)(\d[\d.,]*)(.*)$/);
  if (!m) return null;
  const [, prefix, raw, suffix] = m;
  // "1.200" o "1,200" con grupos de 3 → separador de miles; "4,5" → decimal
  const thousands = /^\d{1,3}([.,]\d{3})+$/.test(raw);
  const normalized = thousands ? raw.replace(/[.,]/g, "") : raw.replace(",", ".");
  const number = Number(normalized);
  if (!Number.isFinite(number)) return null;
  const decimals = thousands ? 0 : (normalized.split(".")[1]?.length ?? 0);
  return { prefix, number, decimals, suffix };
}

const format = (n: number, decimals: number) =>
  n.toLocaleString("es-EC", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export default function CountUp({
  value,
  affixColor,
  durationMs = 1600,
}: {
  value: string;
  affixColor?: string;
  durationMs?: number;
}) {
  const parsed = parseValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [current, setCurrent] = useState(() => (parsed && !reduced ? 0 : parsed?.number ?? 0));

  useEffect(() => {
    if (!parsed || reduced) return;
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3); // desacelera al final
          setCurrent(parsed.number * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // Solo depende del texto del valor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!parsed) return <span>{value}</span>;

  return (
    <span ref={ref} aria-label={value}>
      {parsed.prefix && (
        <Box component="span" aria-hidden sx={{ color: affixColor }}>
          {parsed.prefix}
        </Box>
      )}
      <span aria-hidden>{format(current, parsed.decimals)}</span>
      {parsed.suffix && (
        <Box
          component="span"
          aria-hidden
          // Símbolos cortos ("%", "+") casi del tamaño del número; palabras más pequeñas
          sx={{ color: affixColor, fontSize: parsed.suffix.trim().length <= 1 ? "0.85em" : "0.55em", ml: 0.25 }}
        >
          {parsed.suffix}
        </Box>
      )}
    </span>
  );
}
