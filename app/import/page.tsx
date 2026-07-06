"use client";

import PageHeader from "@/components/PageHeader";
import TaskImporter from "@/components/TaskImporter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProjects, useWeeklyTasks } from "@/hooks/useData";

export default function ImportPage() {
  const { isHydrated: projectsHydrated } = useProjects();
  const { isHydrated: weeklyHydrated } = useWeeklyTasks();

  if (!projectsHydrated || !weeklyHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <PageHeader
        title="Import from Text"
        description="Paste a weekly plan, syllabus, or checklist — BloomTrack will turn it into tasks automatically."
      />
      <TaskImporter />
    </div>
  );
}
