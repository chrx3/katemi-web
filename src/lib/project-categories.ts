/**
 * Categorías de proyecto: un solo vocabulario.
 *
 * El valor guardado está en inglés y en minúscula ("retail", "commercial"),
 * pero se mostraba crudo en las tarjetas mientras el filtro usaba etiquetas en
 * español. El mismo dato aparecía con dos nombres distintos según la página.
 */
export const PROJECT_CATEGORIES = [
  { value: "retail", label: "Retail" },
  { value: "commercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "services", label: "Servicios" },
] as const;

export type ProjectCategoryValue = (typeof PROJECT_CATEGORIES)[number]["value"];

const LABELS = new Map<string, string>(
  PROJECT_CATEGORIES.map((c) => [c.value, c.label]),
);

/** Devuelve la etiqueta en español; si el valor no se reconoce, lo deja pasar. */
export function categoryLabel(value?: string | null): string {
  if (!value) return "";
  return LABELS.get(value) ?? value;
}
