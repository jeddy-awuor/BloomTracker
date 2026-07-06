"use client";

import { Check, Trash2 } from "lucide-react";

interface TaskItemProps {
  description: string;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({
  description,
  isCompleted,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
        isCompleted
          ? "border-pink-500/20 bg-pink-950/30"
          : "border-pink-500/30 bg-pink-950/50 hover:border-pink-400/50 hover:bg-pink-950/70"
      }`}
    >
      <button
        onClick={onToggle}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          isCompleted
            ? "border-pink-400 bg-gradient-to-br from-pink-400 to-blush-500 text-white shadow-pink"
            : "border-pink-500/50 hover:border-pink-400 hover:bg-pink-500/10"
        }`}
      >
        {isCompleted && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>

      <span
        className={`flex-1 text-sm transition-all duration-200 ${
          isCompleted
            ? "text-pink-400/60 line-through"
            : "text-pink-100"
        }`}
      >
        {description}
      </span>

      <button
        onClick={onDelete}
        aria-label="Delete task"
        className="rounded-lg p-1.5 text-pink-500/40 opacity-0 transition-all hover:bg-pink-500/10 hover:text-pink-400 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
