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

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={(node) => {
            inputRef.current = node;
          }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setDraft(value);
              setEditing(false);
            }
          }}
          rows={4}
          className={`w-full border-b-2 border-[#00A896] bg-white/95 p-1 outline-none text-inherit ${editingClassName || ""}`}
        />
      );
    }

    return (
      <input
        ref={(node) => {
          inputRef.current = node;
        }}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            setDraft(value);
            setEditing(false);
          }
        }}
        className={`border-b-2 border-[#00A896] bg-transparent p-0 outline-none text-inherit ${editingClassName || ""}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      title="Click para editar"
      className={`relative text-left rounded-sm outline-none hover:ring-2 hover:ring-[#00A896]/50 focus:ring-2 focus:ring-[#00A896]/60 transition ${className || ""}`}
    >
      {value || placeholder || "Sin texto"}
    </button>
  );
}
