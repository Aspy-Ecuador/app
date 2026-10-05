# 🧠 Contexto de Agentes Antigravity (Proyecto Aspy)
> **Contexto completo y actualizado del proyecto: ver `CLAUDE.md`** (arquitectura, modelo de seguridad, tema/modo oscuro, pendientes).

Este archivo sirve como memoria y contexto persistente para cualquier subagente de IA que trabaje en el proyecto. Debe actualizarse cada vez que se realicen cambios de arquitectura, reglas o estado general del proyecto.

## 📌 Estado Actual y Tareas Recientes (19 Sept 2026)
- **Frameworks:** Laravel (Backend) + React TypeScript con Material UI (Frontend).
- **Últimos Cambios:**
  - Se cambió la rama activa a `fix-version3-aspy`.
  - Se corrigió el error crítico en `ReceiptDetails.tsx` (acceso de `ref` durante render, ahora manejado con `useState`).
  - Se corrigió la advertencia de Vite (Fast Refresh) en `RoleDataContext.tsx`.
  - Se corrigieron dependencias faltantes en `UserFormUser.tsx`.
  - Se modernizó la interfaz de `WelcomePanel.tsx` incorporando animaciones, gradientes radiales y optimización de jerarquía tipográfica para soportar temas Dark/Light nativos de Material UI.

## 🛠️ Convenciones y Reglas del Proyecto
1. **Flujo Git:** Los agentes prepararán (`git commit`) los cambios pero **nunca** harán `git push` automáticamente. El usuario asume el control del push.
2. **Estilos:** Se utiliza Tailwind CSS en conjunto con `@mui/material`. Priorizar estilización a través de variables de tema (e.g. `sx` prop en MUI) para conservar el modo oscuro nativo.
3. **TypeScript:** Evitar el tipo estricto `any`. Utilizar `unknown` o tipado por interfaces en componentes React.
5. **Modo oscuro (Oct 2026):** No usar hex fijos para fondos/textos/bordes. Usar el tema (`"background.paper"`, `"text.primary"`, `"divider"`), los tonos de estado `tone.green.bg/fg/main/border` (también blue, red, amber, purple, yellow, gray) o los neutros de marca `aspy.text/muted/border/card/...`, ambos exportados de `shared-theme/themePrimitives.ts`. Los valores claro/oscuro de esos tokens viven en `colorSchemes`. Para Tailwind usar la variante `dark:` (ya sincronizada con el modo de MUI). `AppTheme` usa `forceThemeRerender` y `liftDarkStyles` para que `theme.palette.mode` funcione y el `sx` gane sobre las personalizaciones del tema. Los gráficos (MUI X Charts) y PDFs sí deben recibir hex reales.
4. **Respuesta Mobile:** Todos los paneles (`WelcomePanel`, `SignInCard`) deben usar `display: flex` y `flexDirection: column` escalable o props de breakpoints de MUI (`{ xs: 'column', md: 'row' }`).

## 📋 Deuda Técnica Pendiente
- El backend en Laravel se mantiene estable (bootea y limpia la caché sin problemas) y los términos y condiciones se registran de forma segura.
- Queda refactorizar los usos de `any` (`@typescript-eslint/no-explicit-any`) diseminados a lo largo de `/utils/utils.ts` y algunos arrays de DataGrid.
