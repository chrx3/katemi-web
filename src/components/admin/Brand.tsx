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

/** Marca reducida: la que aparece junto a las migas de pan. */
export function Icon() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        borderRadius: 6,
        background: "var(--k-navy, #0b1d3a)",
        color: "#fff",
      }}
    >
      <Bolt size={15} />
    </span>
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
