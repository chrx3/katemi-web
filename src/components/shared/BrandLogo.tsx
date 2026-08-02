import Image from "next/image";

/**
 * Logotipo de KATEMI.
 *
 * Se reemplaza el rayo genérico de lucide por la marca real: el logotipo con
 * el perro salchicha sobre la "T". El original venía como PNG con fondo negro
 * opaco, así que se generaron dos variantes con transparencia —una para fondos
 * oscuros y otra para claros— conservando el naranja del perro.
 *
 * La barra del sitio es transparente sobre el hero y blanca al hacer scroll,
 * por eso hace falta la variante que corresponda en cada caso.
 */
export default function BrandLogo({
  variant = "light",
  height = 28,
  className,
  priority = false,
}: {
  /** "light" para fondos oscuros; "dark" para fondos claros. */
  variant?: "light" | "dark";
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const src =
    variant === "dark"
      ? "/brand/katemi-wordmark-dark.png"
      : "/brand/katemi-wordmark.png";

  // Proporción del archivo original (770x285).
  const width = Math.round((height * 770) / 285);

  return (
    <Image
      src={src}
      alt="KATEMI E.I.R.L."
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={{ height, width, flexShrink: 0 }}
    />
  );
}
