"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { parseTaskText } from "@/lib/parseTasks";
import { offsetWeekIdentifier } from "@/lib/utils";
import { useProjects, useWeeklyTasks } from "@/hooks/useData";

type ImportMode = "weekly-by-week" | "weekly-current" | "project";

const PLACEHOLDER = `Week 1: Architecture & State Management
Your goal this week is to set up the skeleton...

[ ] Task 1: Project Setup & Dependencies: Create an empty project...
[ ] Task 2: Hilt DI Initialization: Create your custom Application class...
[x] Task 3: Define UI States: Create a sealed class for PaymentUiState

Week 2: Jetpack Compose UI
[ ] Task 5: The Cart Screen: Build a simple composable...`;

export default function TaskImporter() {
  const router = useRouter();
  const { addProject, addProjectTasksBulk } = useProjects();
  const { currentWeek, createFolder, addWeeklyTasksBulk } = useWeeklyTasks();

  const [text, setText] = useState("");
  const [mode, setMode] = useState<ImportMode>("weekly-by-week");
  const [projectTitle, setProjectTitle] = useState("");
  const [folderTitle, setFolderTitle] = useState("");
  const [imported, setImported] = useState<number | null>(null);

  const parsed = useMemo(() => parseTaskText(text), [text]);

  const handleImport = () => {
    if (parsed.totalTasks === 0) return;

    if (mode === "project") {
      const title =
        projectTitle.trim() ||
        parsed.sections[0]?.weekTitle ||
        "Imported Project";
      const project = addProject(title);

      const tasks = parsed.sections.flatMap((section) =>
        section.tasks.map((task) => ({
          description: section.weekTitle
            ? `[Week ${section.weekNumber ?? "?"}] ${task.description}`
            : task.description,
          isCompleted: task.isCompleted,
        }))
      );

      addProjectTasksBulk(project.id, tasks);
      setImported(tasks.length);
      router.push(`/projects/${project.id}`);
      return;
    }

    const folder = createFolder(
      folderTitle.trim() ||
        parsed.sections[0]?.weekTitle ||
        "Imported Plan"
    );

    const weeklyTasks =
      mode === "weekly-by-week"
        ? parsed.sections.flatMap((section) => {
            const offset =
              section.weekNumber !== null ? section.weekNumber - 1 : 0;
            const weekId = offsetWeekIdentifier(currentWeek, offset);
            return section.tasks.map((task) => ({
              description: task.description,
              isCompleted: task.isCompleted,
              weekIdentifier: weekId,
            }));
          })
        : parsed.sections.flatMap((section) =>
            section.tasks.map((task) => ({
              description: section.weekTitle
                ? `[${section.weekTitle}] ${task.description}`
                : task.description,
              isCompleted: task.isCompleted,
              weekIdentifier: currentWeek,
            }))
          );

    addWeeklyTasksBulk(weeklyTasks, folder.id);
    setImported(weeklyTasks.length);
    setText("");
    router.push("/weekly");
  };

  if (imported !== null) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-pink-400/30 bg-pink-950/40 px-8 py-12 text-center">
        <CheckCircle2 className="mb-4 h-12 w-12 text-pink-400" />
        <h3 className="mb-2 text-lg font-semibold text-pink-50">
          {imported} tasks imported!
        </h3>
        <p className="text-sm text-pink-400">Redirecting you now...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-pink-500/25 bg-pink-950/40 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20">
            <FileText className="h-5 w-5 text-pink-300" />
          </div>
          <div>
            <h3 className="font-semibold text-pink-100">Paste your plan</h3>
            <p className="text-xs text-pink-400">
              Supports Week headers and{" "}
              <code className="rounded bg-pink-500/10 px-1">[ ]</code> /{" "}
              <code className="rounded bg-pink-500/10 px-1">[x]</code> checkboxes
            </p>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          rows={14}
          className="w-full resize-y rounded-xl border border-pink-500/30 bg-pink-950/60 px-4 py-3 text-sm leading-relaxed text-pink-50 placeholder-pink-500/40 outline-none transition-all focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
        />
      </div>

      <div className="rounded-2xl border border-pink-500/25 bg-pink-950/40 p-6">
        <h3 className="mb-4 font-semibold text-pink-100">Import as</h3>
        <div className="space-y-2">
          {(
            [
              {
                value: "weekly-by-week" as const,
                label: "Weekly tasks (by week)",
                hint: "Week 1 → this week, Week 2 → next week. Saved in a deletable folder.",
              },
              {
                value: "weekly-current" as const,
                label: "Weekly tasks (all this week)",
                hint: "Every task lands in the current week, grouped in a folder.",
              },
              {
                value: "project" as const,
                label: "New project",
                hint: "Creates a project with all tasks inside",
              },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-all ${
                mode === option.value
                  ? "border-pink-400/50 bg-pink-500/15 ring-1 ring-pink-400/20"
                  : "border-pink-500/20 hover:border-pink-400/30"
              }`}
            >
              <input
                type="radio"
                name="import-mode"
                value={option.value}
                checked={mode === option.value}
                onChange={() => setMode(option.value)}
                className="mt-1 accent-pink-400"
              />
              <div>
                <p className="text-sm font-medium text-pink-100">
                  {option.label}
                </p>
                <p className="text-xs text-pink-400">{option.hint}</p>
              </div>
            </label>
          ))}
        </div>

        {mode === "project" ? (
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="Project name (optional — uses first week title)"
            className="mt-4 w-full rounded-xl border border-pink-500/30 bg-pink-950/50 px-4 py-2.5 text-sm text-pink-50 placeholder-pink-500/50 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        ) : (
          <input
            type="text"
            value={folderTitle}
            onChange={(e) => setFolderTitle(e.target.value)}
            placeholder="Folder name (optional — e.g. M-Pesa Learning Plan)"
            className="mt-4 w-full rounded-xl border border-pink-500/30 bg-pink-950/50 px-4 py-2.5 text-sm text-pink-50 placeholder-pink-500/50 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
          />
        )}
      </div>

      {parsed.totalTasks > 0 && (
        <div className="rounded-2xl border border-pink-500/25 bg-pink-950/30 p-6">
          <h3 className="mb-3 text-sm font-semibold text-pink-200">
            Preview — {parsed.totalTasks} task
            {parsed.totalTasks !== 1 ? "s" : ""} found
          </h3>
          <div className="max-h-48 space-y-3 overflow-y-auto">
            {parsed.sections.map((section, i) => (
              <div key={i}>
                {section.weekTitle && (
                  <p className="mb-1 text-xs font-medium text-pink-400">
                    Week {section.weekNumber}: {section.weekTitle}
                  </p>
                )}
                <ul className="space-y-1 pl-2">
                  {section.tasks.map((task, j) => (
                    <li
                      key={j}
                      className={`text-xs ${task.isCompleted ? "text-pink-500/60 line-through" : "text-pink-300"}`}
                    >
                      {task.isCompleted ? "✓" : "○"} {task.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={parsed.totalTasks === 0}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-blush-500 py-3.5 text-sm font-semibold text-white shadow-pink transition-all hover:from-pink-400 hover:to-blush-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Sparkles className="h-4 w-4" />
        Generate {parsed.totalTasks > 0 ? `${parsed.totalTasks} Tasks` : "Tasks"}
      </button>
    </div>
  );
}
