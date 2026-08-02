import React from "react";

/**
 * Unifilar al pie del tablero lateral.
 *
 * Es el mismo motivo del hero del sitio —nodos unidos por trazos finos— pero
 * dibujado a mano y sin repetición: un patrón regular se lee como retícula de
 * plantilla, no como un diagrama. Va anclado abajo para no competir con los
 * enlaces, y marcado como decorativo para los lectores de pantalla.
 */
export function NavDiagram() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        opacity: 0.5,
        lineHeight: 0,
      }}
    >
      <svg
        width="100%"
        height="190"
        viewBox="0 0 260 190"
        fill="none"
        preserveAspectRatio="xMinYMax slice"
      >
        <g stroke="#00D4FF" strokeOpacity="0.22" strokeWidth="1">
          <path d="M18 150 L64 118 L120 132 L166 96 L228 110" />
          <path d="M64 118 L58 172" />
          <path d="M120 132 L134 178" />
          <path d="M166 96 L212 62" />
          <path d="M18 150 L10 96" />
        </g>
        <g fill="#00D4FF" fillOpacity="0.5">
          <circle cx="18" cy="150" r="2.5" />
          <circle cx="64" cy="118" r="2.5" />
          <circle cx="120" cy="132" r="2.5" />
          <circle cx="166" cy="96" r="2.5" />
          <circle cx="228" cy="110" r="2.5" />
          <circle cx="58" cy="172" r="1.8" />
          <circle cx="134" cy="178" r="1.8" />
          <circle cx="212" cy="62" r="1.8" />
          <circle cx="10" cy="96" r="1.8" />
        </g>
      </svg>
    </div>
  );
}

export default NavDiagram;
