export const PLACEHOLDER_IMAGES = {
  service: "/placeholders/service.svg",
  project: "/placeholders/project.svg",
  about: "/placeholders/about.svg",
  generic: "/placeholders/generic.svg",
} as const;

export type PlaceholderKind = keyof typeof PLACEHOLDER_IMAGES;

function firstValidUrl(...candidates: Array<string | undefined | null>): string {
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value) return value;
  }
  return "";
}

export function normalizeImageList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[")) {
      try {
        return normalizeImageList(JSON.parse(trimmed) as unknown);
      } catch {
        // Treat as a single URL below.
      }
    }

    if (trimmed.includes("\n")) {
      return trimmed
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }

    return [trimmed];
  }

  return [];
}

export function resolveServiceImage(imageUrl?: string | null): string {
  return firstValidUrl(imageUrl) || PLACEHOLDER_IMAGES.service;
}

export function resolveProjectImage(
  imageUrl?: string | null,
  images?: unknown,
): string {
  const fromGallery = normalizeImageList(images).find(Boolean);
  return firstValidUrl(imageUrl, fromGallery) || PLACEHOLDER_IMAGES.project;
}

export function resolveAboutImage(imageUrl?: string | null): string {
  return firstValidUrl(imageUrl) || PLACEHOLDER_IMAGES.about;
}

export function resolveImage(
  imageUrl?: string | null,
  kind: PlaceholderKind = "generic",
): string {
  return firstValidUrl(imageUrl) || PLACEHOLDER_IMAGES[kind];
}
