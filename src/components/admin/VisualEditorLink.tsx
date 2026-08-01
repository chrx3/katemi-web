import React from "react";

/**
 * Entrada al editor visual desde el menú del panel.
 *
 * El editor vive fuera del route group de Payload porque necesita los estilos
 * del sitio para que la vista previa se vea igual que la página real, así que
 * se enlaza con un <a> normal en vez de con navegación interna del panel.
 */
export function VisualEditorLink() {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <a
        href="/editor-visual"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.65rem 0.85rem",
          borderRadius: "4px",
          background: "var(--theme-elevation-100)",
          color: "var(--theme-elevation-800)",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "0.85rem",
        }}
      >
        <span aria-hidden="true">🎨</span>
        Editor visual
      </a>
    </div>
  );
}

export default VisualEditorLink;
