import React from "react";

/**
 * Marca de KATEMI en el panel, en reemplazo del logo de Payload.
 *
 * Reutiliza el mismo símbolo del rayo que usa la barra del sitio, para que el
 * panel y la página pública se lean como un solo producto.
 */

function Bolt({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

/**
 * Marca reducida: la que aparece junto a las migas de pan.
 *
 * Payload le da un hueco fijo de 18x18 (16 en pantallas chicas), así que el
 * fondo redondeado se dibuja dentro del propio viewBox y el svg ocupa el 100%
 * del espacio disponible. Con un tamaño fijo en píxeles el símbolo se salía
 * del contenedor y quedaba recortado.
 */
export function Icon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="KATEMI"
      style={{ display: "block", overflow: "visible" }}
    >
      <rect width="24" height="24" rx="5" fill="var(--k-navy, #0b1d3a)" />
      <path
        d="M10.6 5.4 6.9 12.3h3.2l-1.1 5.3 4.9-7.2h-3.3z"
        fill="#fff"
        stroke="#fff"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Marca completa: la de la pantalla de acceso. */
export function Logo() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        color: "var(--k-navy, #0b1d3a)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "var(--k-navy, #0b1d3a)",
          color: "#fff",
        }}
      >
        <Bolt size={24} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
        <strong style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
          KATEMI
        </strong>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--k-teal, #00a896)",
          }}
        >
          Ingeniería y Construcción
        </span>
      </span>
    </span>
  );
}

export default Logo;
