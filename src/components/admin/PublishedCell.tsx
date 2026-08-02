"use client";

import React from "react";

/**
 * Celda de estado para el campo "Activo" en los listados.
 *
 * Payload muestra los booleanos como "verdadero" / "falso", que no dice nada
 * sobre lo que significan aquí. Lo que le importa a quien administra el sitio
 * es si la ficha se ve o no en la web.
 */
export function PublishedCell({ cellData }: { cellData?: unknown }) {
  const published = cellData === true;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45rem",
        fontSize: "0.8rem",
        fontWeight: 600,
        color: published ? "var(--k-teal-on-surface, #00796b)" : "var(--k-muted, #4a5d72)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: published ? "var(--k-teal, #00a896)" : "var(--color-base-350)",
          boxShadow: published ? "0 0 6px rgba(0, 168, 150, 0.55)" : "none",
        }}
      />
      {published ? "En el sitio" : "Oculto"}
    </span>
  );
}

export default PublishedCell;
