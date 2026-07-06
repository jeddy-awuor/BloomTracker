"use client";

import { CalendarCheck } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import TaskItem from "@/components/TaskItem";
import AddItemForm from "@/components/AddItemForm";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProgressBar from "@/components/ProgressBar";
import WeeklyTaskFolderCard from "@/components/WeeklyTaskFolderCard";
import MotivationQuote from "@/components/MotivationQuote";
import { useWeeklyTasks } from "@/hooks/useData";
import { formatWeekLabel } from "@/lib/utils";

export default function WeeklyTasksPage() {
  const {
    currentWeek,
    folderGroups,
    looseTasks,
    completedCount,
    totalCount,
    isHydrated,
    addWeeklyTask,
    toggleWeeklyTask,
    deleteWeeklyTask,
    deleteFolder,
  } = useWeeklyTasks();

  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const isEmpty = folderGroups.length === 0 && looseTasks.length === 0;

  return (
    <div>
      <PageHeader
        title="Weekly Tasks"
        description="General chores and goals for the week — not tied to any project."
      />

      <MotivationQuote compact className="mb-6" />

      <div className="mb-8 rounded-2xl border border-pink-500/25 bg-gradient-to-br from-pink-950/60 to-pink-900/30 p-6 shadow-pink">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20">
            <CalendarCheck className="h-5 w-5 text-pink-300" />
          </div>
          <div>
            <p className="text-sm text-pink-400">{formatWeekLabel(currentWeek)}</p>
            <p className="text-2xl font-bold text-pink-50">
              {completedCount} of {totalCount} completed
            </p>
          </div>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <div className="mb-6">
        <AddItemForm
          placeholder="Add a weekly task..."
          onAdd={addWeeklyTask}
          buttonLabel="Add Task"
        />
      </div>

      {isEmpty ? (
        <EmptyState
          icon={<CalendarCheck className="h-8 w-8 text-pink-400" />}
          title="No weekly tasks"
          description="Add chores, habits, or goals for this week above — or import a plan from Import Text."
        />
      ) : (
        <div className="space-y-6">
          {folderGroups.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-medium text-pink-400">
                Imported plans
              </h3>
              {folderGroups.map((group) => (
                <WeeklyTaskFolderCard
                  key={group.folder.id}
                  group={group}
                  onToggleTask={toggleWeeklyTask}
                  onDeleteTask={deleteWeeklyTask}
                  onDeleteFolder={deleteFolder}
                />
              ))}
            </section>
          )}

          {looseTasks.length > 0 && (
            <section className="space-y-2">
              {folderGroups.length > 0 && (
                <h3 className="text-sm font-medium text-pink-400">
                  General tasks
                </h3>
              )}
              {looseTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  description={task.description}
                  isCompleted={task.isCompleted}
                  onToggle={() => toggleWeeklyTask(task.id)}
                  onDelete={() => deleteWeeklyTask(task.id)}
                />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
