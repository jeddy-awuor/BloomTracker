"use client";

import Link from "next/link";
import {
  FolderKanban,
  CalendarCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import MotivationQuote from "@/components/MotivationQuote";
import { useProjects, useWeeklyTasks } from "@/hooks/useData";

export default function DashboardPage() {
  const { projects, isHydrated: projectsHydrated } = useProjects();
  const {
    completedCount,
    totalCount,
    isHydrated: weeklyHydrated,
    currentWeek,
  } = useWeeklyTasks();

  if (!projectsHydrated || !weeklyHydrated) {
    return <LoadingSpinner />;
  }

  const totalProjectTasks = projects.reduce((sum, p) => sum + p.totalTasks, 0);
  const completedProjectTasks = projects.reduce(
    (sum, p) => sum + p.completedTasks,
    0
  );
  const overallProgress =
    totalProjectTasks === 0
      ? 0
      : Math.round((completedProjectTasks / totalProjectTasks) * 100);

  const weeklyProgress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div>
      <PageHeader
        title="Welcome back, lovely!"
        description="Your personal productivity hub — track projects and weekly goals in one place."
      />

      <MotivationQuote />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-pink-500/25 bg-pink-950/50 p-5 shadow-pink">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500/20">
              <FolderKanban className="h-4 w-4 text-pink-300" />
            </div>
            <span className="text-sm text-pink-400">Active Projects</span>
          </div>
          <p className="text-3xl font-bold text-pink-50">{projects.length}</p>
        </div>

        <div className="rounded-2xl border border-pink-500/25 bg-pink-950/50 p-5 shadow-pink">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500/20">
              <TrendingUp className="h-4 w-4 text-pink-300" />
            </div>
            <span className="text-sm text-pink-400">Project Progress</span>
          </div>
          <p className="mb-2 text-3xl font-bold text-pink-50">
            {overallProgress}%
          </p>
          <ProgressBar progress={overallProgress} size="sm" showLabel={false} />
        </div>

        <div className="rounded-2xl border border-pink-500/25 bg-pink-950/50 p-5 shadow-pink sm:col-span-2 lg:col-span-1">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500/20">
              <CalendarCheck className="h-4 w-4 text-pink-300" />
            </div>
            <span className="text-sm text-pink-400">This Week</span>
          </div>
          <p className="mb-1 text-3xl font-bold text-pink-50">
            {completedCount}/{totalCount}
          </p>
          <p className="text-xs text-pink-500">tasks completed</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-pink-500/25 bg-pink-950/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-pink-100">Recent Projects</h3>
            <Link
              href="/projects"
              className="text-xs text-pink-400 hover:text-pink-300"
            >
              View all →
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-sm text-pink-500">
              No projects yet. Start one in Projects!
            </p>
          ) : (
            <ul className="space-y-3">
              {projects.slice(0, 4).map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="block rounded-xl border border-pink-500/20 bg-pink-950/30 p-3 transition-all hover:border-pink-400/40"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-pink-100">
                        {project.title}
                      </span>
                      <span className="text-xs text-pink-400">
                        {project.progress}%
                      </span>
                    </div>
                    <ProgressBar
                      progress={project.progress}
                      size="sm"
                      showLabel={false}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-pink-500/25 bg-pink-950/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-pink-100">Weekly Overview</h3>
            <Link
              href="/weekly"
              className="text-xs text-pink-400 hover:text-pink-300"
            >
              Manage →
            </Link>
          </div>
          <div className="mb-4 flex items-center gap-2 text-sm text-pink-400">
            <Sparkles className="h-4 w-4 text-pink-300" />
            <span>{currentWeek}</span>
          </div>
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-pink-50">
              {completedCount}
            </span>
            <span className="text-pink-400">of {totalCount} completed</span>
          </div>
          <ProgressBar progress={weeklyProgress} />
        </section>
      </div>
    </div>
  );
}
