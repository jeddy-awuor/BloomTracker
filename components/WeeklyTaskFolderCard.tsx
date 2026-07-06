"use client";

import { useState } from "react";
import { ChevronDown, FolderOpen, Trash2 } from "lucide-react";
import TaskItem from "./TaskItem";
import ProgressBar from "./ProgressBar";
import { WeeklyFolderGroup } from "@/hooks/useData";

interface WeeklyTaskFolderCardProps {
  group: WeeklyFolderGroup;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export default function WeeklyTaskFolderCard({
  group,
  onToggleTask,
  onDeleteTask,
  onDeleteFolder,
}: WeeklyTaskFolderCardProps) {
  const [expanded, setExpanded] = useState(true);
  const progress =
    group.totalCount === 0
      ? 0
      : Math.round((group.completedCount / group.totalCount) * 100);

  const handleDeleteFolder = () => {
    if (
      confirm(
        `Delete folder "${group.folder.title}" and all its tasks across every week?`
      )
    ) {
      onDeleteFolder(group.folder.id);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-pink-500/30 bg-pink-950/40">
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/30 to-blush-500/20 ring-1 ring-pink-400/30">
            <FolderOpen className="h-4 w-4 text-pink-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-pink-50">
              {group.folder.title}
            </p>
            <p className="text-xs text-pink-400">
              {group.completedCount} of {group.totalCount} this week
            </p>
          </div>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-pink-400 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>

        <button
          onClick={handleDeleteFolder}
          aria-label="Delete folder"
          className="rounded-lg p-2 text-pink-500/50 transition-all hover:bg-pink-500/10 hover:text-pink-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pb-4">
        <ProgressBar progress={progress} size="sm" showLabel={false} />
      </div>

      {expanded && (
        <div className="space-y-2 border-t border-pink-500/20 bg-pink-950/30 p-4">
          {group.tasks.map((task) => (
            <TaskItem
              key={task.id}
              description={task.description}
              isCompleted={task.isCompleted}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
