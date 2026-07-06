"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";

interface AddItemFormProps {
  placeholder: string;
  onAdd: (value: string) => void;
  buttonLabel?: string;
}

export default function AddItemForm({
  placeholder,
  onAdd,
  buttonLabel = "Add",
}: AddItemFormProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-xl border border-pink-500/30 bg-pink-950/50 px-4 py-2.5 text-sm text-pink-50 placeholder-pink-500/50 outline-none transition-all focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-blush-500 px-4 py-2.5 text-sm font-medium text-white shadow-pink transition-all hover:from-pink-400 hover:to-blush-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">{buttonLabel}</span>
      </button>
    </form>
  );
}
