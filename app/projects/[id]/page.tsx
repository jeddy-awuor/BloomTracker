"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import TaskItem from "@/components/TaskItem";
import AddItemForm from "@/components/AddItemForm";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useProjects } from "@/hooks/useData";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const {
    isHydrated,
    getProjectById,
    getTasksForProject,
    addProjectTask,
    toggleProjectTask,
    deleteProjectTask,
    deleteProject,
  } = useProjects();

  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  const project = getProjectById(id);
  const tasks = getTasksForProject(id);

  if (!project) {
    return (
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-pink-100">
          Project not found
        </h2>
        <Link
          href="/projects"
          className="text-sm text-pink-400 hover:text-pink-300"
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  const handleDeleteProject = () => {
    if (confirm(`Delete "${project.title}" and all its tasks?`)) {
      deleteProject(id);
      router.push("/projects");
    }
  };

  return (
    <div>
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-pink-400 transition-colors hover:text-pink-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <PageHeader title={project.title}>
        <button
          onClick={handleDeleteProject}
          className="flex items-center gap-2 rounded-xl border border-pink-500/30 px-4 py-2 text-sm text-pink-400 transition-all hover:border-pink-400/50 hover:bg-pink-500/10 hover:text-pink-300"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </PageHeader>

      <div className="mb-8 rounded-2xl border border-pink-500/25 bg-pink-950/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-pink-400">
            {project.completedTasks} of {project.totalTasks} tasks completed
          </span>
          <span className="text-2xl font-bold text-pink-50">
            {project.progress}%
          </span>
        </div>
        <ProgressBar progress={project.progress} size="lg" showLabel={false} />
      </div>

      <div className="mb-6">
        <AddItemForm
          placeholder="Add a task to this project..."
          onAdd={(desc) => addProjectTask(id, desc)}
          buttonLabel="Add Task"
        />
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<span className="text-2xl">✨</span>}
          title="No tasks yet"
          description="Add your first task above to start making progress on this project."
        />
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              description={task.description}
              isCompleted={task.isCompleted}
              onToggle={() => toggleProjectTask(task.id)}
              onDelete={() => deleteProjectTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
