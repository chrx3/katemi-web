"use client";

import { useEffect, useState } from "react";
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
  const [currentSrc, setCurrentSrc] = useState(() =>
    resolveImage(src, fallbackKind),
  );

  useEffect(() => {
    setCurrentSrc(resolveImage(src, fallbackKind));
  }, [src, fallbackKind]);

  const handleError = () => {
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
