"use client";

import Link from "next/link";
import { FolderKanban, ArrowRight } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { ProjectWithProgress } from "@/types";

interface ProjectCardProps {
  project: ProjectWithProgress;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl border border-pink-500/25 bg-gradient-to-br from-pink-950/80 to-pink-900/40 p-5 shadow-pink transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/50 hover:shadow-pink-lg">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-pink-500/10 blur-2xl transition-all group-hover:bg-pink-400/20" />

        <div className="relative">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/30 to-blush-500/20 ring-1 ring-pink-400/30">
              <FolderKanban className="h-5 w-5 text-pink-300" />
            </div>
            <ArrowRight className="h-4 w-4 text-pink-500/50 transition-transform group-hover:translate-x-1 group-hover:text-pink-300" />
          </div>

          <h3 className="mb-1 text-lg font-semibold text-pink-50 transition-colors group-hover:text-white">
            {project.title}
          </h3>

          <p className="mb-4 text-xs text-pink-400">
            {project.completedTasks} of {project.totalTasks} tasks done
          </p>

          <ProgressBar progress={project.progress} size="sm" showLabel={false} />
        </div>
      </article>
    </Link>
  );
}
