"use client";

import { useState } from "react";
import {
  PLACEHOLDER_IMAGES,
  type PlaceholderKind,
  resolveImage,
} from "@/lib/image-placeholders";

interface ImageWithFallbackProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "src" | "onError" | "alt"
  > {
  src?: string | null;
  alt: string;
  fallbackKind?: PlaceholderKind;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackKind = "generic",
  className,
  ...props
}: ImageWithFallbackProps) {
  const fallback = PLACEHOLDER_IMAGES[fallbackKind];
  const resolved = resolveImage(src, fallbackKind);

  // Solo se guarda en estado el hecho de que la imagen falló al cargar. La URL
  // se deriva durante el render: sincronizarla con un efecto provocaba un
  // render extra en cada cambio de props y dejaba un frame con la imagen
  // anterior.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const currentSrc = failedSrc === resolved ? fallback : resolved;

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (resolved !== fallback) setFailedSrc(resolved);
      }}
    />
  );
}
