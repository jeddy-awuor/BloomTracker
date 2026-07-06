import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  Project,
  ProjectTask,
  WeeklyTask,
  WeeklyTaskFolder,
  STORAGE_KEYS,
} from "@/types";

const MIGRATION_FLAG = "ppt_migrated_to_supabase";

function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function hasLocalData(): boolean {
  if (typeof window === "undefined") return false;
  const projects = readLocalStorage<Project[]>(STORAGE_KEYS.projects, []);
  const projectTasks = readLocalStorage<ProjectTask[]>(
    STORAGE_KEYS.projectTasks,
    []
  );
  const weeklyTasks = readLocalStorage<WeeklyTask[]>(
    STORAGE_KEYS.weeklyTasks,
    []
  );
  const weeklyFolders = readLocalStorage<WeeklyTaskFolder[]>(
    STORAGE_KEYS.weeklyFolders,
    []
  );
  return (
    projects.length > 0 ||
    projectTasks.length > 0 ||
    weeklyTasks.length > 0 ||
    weeklyFolders.length > 0
  );
}

export function isMigrationComplete(userId: string): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(`${MIGRATION_FLAG}_${userId}`) === "true";
}

export function resetMigrationFlag(userId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`${MIGRATION_FLAG}_${userId}`);
}

function markMigrationComplete(userId: string): void {
  window.localStorage.setItem(`${MIGRATION_FLAG}_${userId}`, "true");
}

export async function migrateLocalToSupabase(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
  if (isMigrationComplete(userId)) {
    return;
  }

  if (!hasLocalData()) {
    markMigrationComplete(userId);
    return;
  }

  const projects = readLocalStorage<Project[]>(STORAGE_KEYS.projects, []);
  const projectTasks = readLocalStorage<ProjectTask[]>(
    STORAGE_KEYS.projectTasks,
    []
  );
  const weeklyTasks = readLocalStorage<WeeklyTask[]>(
    STORAGE_KEYS.weeklyTasks,
    []
  );
  const weeklyFolders = readLocalStorage<WeeklyTaskFolder[]>(
    STORAGE_KEYS.weeklyFolders,
    []
  );

  if (projects.length > 0) {
    const { error } = await supabase.from("projects").upsert(
      projects.map((p) => ({
        id: p.id,
        user_id: userId,
        title: p.title,
        created_at: p.createdAt,
      }))
    );
    if (error) throw error;
  }

  if (projectTasks.length > 0) {
    const { error } = await supabase.from("project_tasks").upsert(
      projectTasks.map((t) => ({
        id: t.id,
        user_id: userId,
        project_id: t.projectId,
        description: t.description,
        is_completed: t.isCompleted,
      }))
    );
    if (error) throw error;
  }

  if (weeklyFolders.length > 0) {
    const { error } = await supabase.from("weekly_task_folders").upsert(
      weeklyFolders.map((f) => ({
        id: f.id,
        user_id: userId,
        title: f.title,
        created_at: f.createdAt,
      }))
    );
    if (error) throw error;
  }

  if (weeklyTasks.length > 0) {
    const { error } = await supabase.from("weekly_tasks").upsert(
      weeklyTasks.map((t) => ({
        id: t.id,
        user_id: userId,
        description: t.description,
        is_completed: t.isCompleted,
        week_identifier: t.weekIdentifier,
        folder_id: t.folderId ?? null,
      }))
    );
    if (error) throw error;
  }

  markMigrationComplete(userId);
}
