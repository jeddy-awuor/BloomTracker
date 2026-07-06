"use client";

import { FolderKanban } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import AddItemForm from "@/components/AddItemForm";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProjects } from "@/hooks/useData";

export default function ProjectsPage() {
  const { projects, isHydrated, addProject } = useProjects();

  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Organize your work into beautiful project boards."
      >
        <AddItemForm
          placeholder="New project name..."
          onAdd={addProject}
          buttonLabel="Create"
        />
      </PageHeader>

      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-8 w-8 text-pink-400" />}
          title="No projects yet"
          description="Create your first project above to start tracking tasks and progress."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
