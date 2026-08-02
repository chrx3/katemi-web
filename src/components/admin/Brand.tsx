import React from "react";

/**
 * Marca de KATEMI en el panel, en reemplazo de la de Payload.
 *
 * Usa el logotipo real de la empresa. El archivo original venía en PNG con
 * fondo negro opaco, así que se generaron variantes con transparencia bajo
 * /brand: el logotipo completo y el perro salchicha aislado, que funciona como
 * marca cuadrada donde no cabe el nombre.
 */

/**
 * Marca reducida, junto a las migas de pan.
 *
 * Payload le da un hueco fijo de 18x18 px (16 en pantallas chicas), así que la
 * imagen ocupa el 100% del espacio en vez de un tamaño fijo, que se salía del
 * contenedor y quedaba recortado.
 */
export function Icon() {
  return (
    // El panel no pasa por el optimizador de imágenes de Next, así que aquí va
    // una <img> normal.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/katemi-mark.png"
      alt="KATEMI"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
}

/** Marca completa, en la pantalla de acceso. */
export function Logo() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem 1.75rem",
        borderRadius: 12,
        background: "var(--k-navy, #0b1d3a)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/katemi-wordmark.png"
        alt="KATEMI E.I.R.L. — Ingeniería y Construcción"
        style={{ display: "block", height: 52, width: "auto" }}
      />
    </span>
  );
}

export default Logo;
