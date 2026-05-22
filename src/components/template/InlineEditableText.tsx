"use client";

import { useEffect, useRef, useState } from "react";

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  editingClassName?: string;
  multiline?: boolean;
  placeholder?: string;
}

export default function InlineEditableText({
  value,
  onChange,
  className,
  editingClassName,
  multiline = false,
  placeholder,
}: InlineEditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [editing]);

  const commit = () => {
    onChange(draft);
    setEditing(false);
  };

  const baseEditClass = `text-inherit outline-none bg-transparent border-0 border-b-2 border-[#00A896]/60 caret-[#00A896] ${editingClassName || ""}`;

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={(node) => { inputRef.current = node; }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); commit(); }
            if (e.key === "Escape") { e.preventDefault(); setDraft(value); setEditing(false); }
          }}
          rows={Math.max(2, draft.split("\n").length + 1)}
          className={`${className || ""} ${baseEditClass} resize-none`}
        />
      );
    }

    return (
      <input
        ref={(node) => { inputRef.current = node; }}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          if (e.key === "Escape") { e.preventDefault(); setDraft(value); setEditing(false); }
        }}
        style={{ width: `${Math.max(20, draft.length + 4)}ch` }}
        className={`${className || ""} ${baseEditClass}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => { setDraft(value); setEditing(true); }}
      title="Click para editar"
      className={`relative text-left rounded-sm outline-none hover:ring-2 hover:ring-[#00A896]/50 focus:ring-2 focus:ring-[#00A896]/60 transition ${className || ""}`}
    >
      {value || placeholder || "Sin texto"}
    </button>
  );
}
