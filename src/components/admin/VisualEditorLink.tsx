import React from "react";

/**
 * Entrada al editor visual desde el tablero lateral.
 *
 * El editor vive fuera del route group de Payload —necesita los estilos del
 * sitio para que la vista previa se vea igual que la página real— así que se
 * enlaza con un <a> normal. Se presenta como la acción principal del panel
 * porque es por donde se edita el contenido a diario.
 */
export function VisualEditorLink() {
  return (
    <a
      href="/editor-visual"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        margin: "0 0 1.25rem",
        padding: "0.7rem 0.85rem",
        borderRadius: "6px",
        background: "var(--k-teal, #00a896)",
        color: "#fff",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: "0.82rem",
        letterSpacing: "0.01em",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
      Editar el sitio
    </a>
  );
}

export default VisualEditorLink;
