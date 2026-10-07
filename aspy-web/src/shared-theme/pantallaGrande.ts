// Pantallas grandes (TV Full HD, 2K y 4K): todo se agranda de forma proporcional para que no
// quede una interfaz diminuta al presentar el sistema en un televisor.
//
// - `largeScreenZoom` va en el contenedor raíz de cada pantalla (landing, login/registro y panel).
// - Dentro de un contenedor con zoom, las unidades `vh` salen multiplicadas: usa `vh(n)`.
// - Las ventanas flotantes de MUI (menús, calendarios, diálogos) viven fuera de ese contenedor;
//   se agrandan en `index.css` con los MISMOS cortes y factores. Si cambias uno, cambia ambos.
const ESCALAS: [minWidth: number, zoom: number][] = [
  [1800, 1.15],
  [2400, 1.5],
  [3200, 2],
];

export const largeScreenZoom = Object.fromEntries(
  ESCALAS.map(([min, zoom]) => [`@media (min-width: ${min}px)`, { zoom }]),
) as Record<string, { zoom: number }>;

/** `n` centésimas del alto de la pantalla, corregidas para contenedores con `largeScreenZoom`. */
export const vh = (n: number) => `calc(${n} * var(--vh, 1vh))`;

/** Factor de zoom vigente según el ancho de la pantalla (1 en pantallas normales). */
export const zoomActual = () => ESCALAS.reduce((z, [min, factor]) => (window.innerWidth >= min ? factor : z), 1);

/**
 * Para componentes que calculan su tamaño en píxeles de pantalla (FullCalendar) y se descuadran
 * dentro de un contenedor con zoom: anula el zoom en el componente y lo vuelve a aplicar solo a
 * las piezas indicadas (textos y botones, que el componente no mide).
 * `extra(zoom)` permite agrandar a mano lo que tenga un tamaño fijo.
 */
export const zoomSoloEn = (selectores: string, extra?: (zoom: number) => object) =>
  Object.fromEntries(
    ESCALAS.map(([min, zoom]) => [
      `@media (min-width: ${min}px)`,
      { zoom: 1 / zoom, [selectores]: { zoom }, ...extra?.(zoom) },
    ]),
  );
