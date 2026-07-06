export interface Project {
  id: string;
  title: string;
  createdAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  description: string;
  isCompleted: boolean;
}

export interface WeeklyTask {
  id: string;
  description: string;
  isCompleted: boolean;
  weekIdentifier: string;
  folderId?: string;
}

export interface WeeklyTaskFolder {
  id: string;
  title: string;
  createdAt: string;
}

export interface ProjectWithProgress extends Project {
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

export const STORAGE_KEYS = {
  projects: "ppt_projects",
  projectTasks: "ppt_project_tasks",
  weeklyTasks: "ppt_weekly_tasks",
  weeklyFolders: "ppt_weekly_folders",
} as const;
