/**
 * Inyecta datos estructurados schema.org.
 *
 * El contenido que va aquí es editable desde el panel, así que JSON.stringify a
 * secas no basta: no escapa el signo "menor que", y un cierre de etiqueta
 * script dentro de una descripción cerraría el bloque e inyectaría markup en la
 * página. Escaparlo cierra esa vía sin alterar el dato, porque la secuencia
 * unicode es válida en JSON y el parser la devuelve tal cual.
 *
 * Los separadores de línea U+2028 y U+2029 se escapan por el mismo motivo: son
 * válidos dentro de una cadena JSON pero rompen el parser de JavaScript.
 *
 * Tanto el patrón como la barra invertida se arman por código de carácter en
 * vez de escribirse como literales o secuencias escapadas. Escritos a mano, los
 * separadores rompen el propio archivo (son saltos de línea para el parser) y
 * las barras dobles se interpretaban distinto según la herramienta que tocara
 * el archivo, dejando el escape sin efecto.
 */
const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);
const BACKSLASH = String.fromCharCode(92);

const UNSAFE = new RegExp("[<" + LINE_SEP + PARA_SEP + "]", "g");

function escapeChar(c: string): string {
  return BACKSLASH + "u" + c.charCodeAt(0).toString(16).padStart(4, "0");
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(UNSAFE, escapeChar);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export default JsonLd;
