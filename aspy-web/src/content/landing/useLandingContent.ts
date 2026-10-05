import { useEffect, useState } from "react";
import { defaultLandingContent } from "./defaultContent";
import {
  fetchLandingContent,
  mergeLandingContent,
  readCachedRemote,
  sanityEnabled,
  writeCachedRemote,
} from "./sanity";
import type { LandingContent } from "./types";

/**
 * Contenido de la landing.
 * - Sin `VITE_SANITY_PROJECT_ID`: devuelve el contenido local (`defaultContent.ts`).
 * - Con Sanity configurado: muestra primero la última versión guardada en este
 *   navegador (o la local) y la actualiza con lo publicado en Sanity.
 */
export function useLandingContent(): LandingContent {
  const [content, setContent] = useState<LandingContent>(() => {
    const cached = sanityEnabled ? readCachedRemote() : null;
    return cached ? mergeLandingContent(defaultLandingContent, cached) : defaultLandingContent;
  });

  useEffect(() => {
    if (!sanityEnabled) return;
    const controller = new AbortController();
    fetchLandingContent(controller.signal)
      .then((remote) => {
        if (!remote) return;
        setContent(mergeLandingContent(defaultLandingContent, remote));
        writeCachedRemote(remote);
      })
      .catch(() => {
        // Sin conexión o Sanity caído: se queda el contenido local/cacheado
      });
    return () => controller.abort();
  }, []);

  return content;
}
