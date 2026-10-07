import * as React from 'react';
import { flushSync } from 'react-dom';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => { ready: Promise<void> };
};

/**
 * Espera a que el tema nuevo esté aplicado en <html> (MUI lo aplica tras el render).
 * Usa setTimeout y no requestAnimationFrame: durante una view transition el navegador
 * pausa el dibujado, así que los cuadros no llegan y la transición quedaría trabada.
 */
function waitForScheme(scheme: string) {
  return new Promise<void>((resolve) => {
    let tries = 0;
    const check = () => {
      const applied = document.documentElement.getAttribute('data-mui-color-scheme') === scheme;
      if (applied || tries++ > 20) resolve();
      else setTimeout(check, 10);
    };
    check();
  });
}

/**
 * Botón de modo claro/oscuro.
 * - El sol y la luna giran y se intercambian.
 * - El nuevo modo se expande en círculo desde el botón (View Transitions API).
 *   Sin soporte del navegador o con "reducir movimiento", el cambio es instantáneo.
 */
export default function ColorModeToggle({
  sx,
  onClick,
  iconSize = '1.25rem',
  ...props
}: React.ComponentProps<typeof IconButton> & { iconSize?: string }) {
  const { mode, systemMode, setMode } = useColorScheme();
  // Con modo "system" hay que mirar el modo real del SO; si no, el primer clic no hace nada
  const resolvedMode = (mode === 'system' ? systemMode : mode) ?? 'light';
  const isDark = resolvedMode === 'dark';

  const toggleMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    const next = isDark ? 'light' : 'dark';
    const doc = document as ViewTransitionDocument;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || reduced) {
      setMode(next);
      return;
    }

    // Círculo que crece desde el centro del botón hasta cubrir toda la pantalla
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = doc.startViewTransition(async () => {
      flushSync(() => setMode(next));
      await waitForScheme(next);
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {});
  };

  const iconSx = (visible: boolean) => ({
    position: 'absolute',
    fontSize: iconSize,
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
    transform: visible ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
    opacity: visible ? 1 : 0,
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  });

  return (
    <IconButton
      onClick={toggleMode}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      sx={[
        { width: '2.2rem', height: '2.2rem', position: 'relative', overflow: 'hidden' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {/* En claro se ve la luna (pasar a oscuro); en oscuro, el sol */}
      <DarkModeIcon sx={iconSx(!isDark)} />
      <LightModeIcon sx={iconSx(isDark)} />
    </IconButton>
  );
}
