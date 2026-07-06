import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  Project,
  ProjectTask,
  WeeklyTask,
  WeeklyTaskFolder,
} from "@/types";

type Client = SupabaseClient<Database>;

export async function fetchProjects(supabase: Client): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
  }));
}

export async function fetchProjectTasks(
  supabase: Client
): Promise<ProjectTask[]> {
  const { data, error } = await supabase.from("project_tasks").select("*");

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    description: row.description,
    isCompleted: row.is_completed,
  }));
}

export async function fetchWeeklyTasks(
  supabase: Client
): Promise<WeeklyTask[]> {
  const { data, error } = await supabase.from("weekly_tasks").select("*");

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    description: row.description,
    isCompleted: row.is_completed,
    weekIdentifier: row.week_identifier,
    ...(row.folder_id ? { folderId: row.folder_id } : {}),
  }));
}

export async function fetchWeeklyFolders(
  supabase: Client
): Promise<WeeklyTaskFolder[]> {
  const { data, error } = await supabase
    .from("weekly_task_folders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
  }));
}

export async function insertProject(
  supabase: Client,
  userId: string,
  project: Project
): Promise<void> {
  const { error } = await supabase.from("projects").insert({
    id: project.id,
    user_id: userId,
    title: project.title,
    created_at: project.createdAt,
  });
  if (error) throw error;
}

export async function deleteProject(
  supabase: Client,
  projectId: string
): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);
  if (error) throw error;
}

export async function insertProjectTask(
  supabase: Client,
  userId: string,
  task: ProjectTask
): Promise<void> {
  const { error } = await supabase.from("project_tasks").insert({
    id: task.id,
    user_id: userId,
    project_id: task.projectId,
    description: task.description,
    is_completed: task.isCompleted,
  });
  if (error) throw error;
}

export async function insertProjectTasks(
  supabase: Client,
  userId: string,
  tasks: ProjectTask[]
): Promise<void> {
  if (tasks.length === 0) return;
  const { error } = await supabase.from("project_tasks").insert(
    tasks.map((task) => ({
      id: task.id,
      user_id: userId,
      project_id: task.projectId,
      description: task.description,
      is_completed: task.isCompleted,
    }))
  );
  if (error) throw error;
}

export async function updateProjectTask(
  supabase: Client,
  taskId: string,
  isCompleted: boolean
): Promise<void> {
  const { error } = await supabase
    .from("project_tasks")
    .update({ is_completed: isCompleted })
    .eq("id", taskId);
  if (error) throw error;
}

export async function deleteProjectTask(
  supabase: Client,
  taskId: string
): Promise<void> {
  const { error } = await supabase
    .from("project_tasks")
    .delete()
    .eq("id", taskId);
  if (error) throw error;
}

export async function insertWeeklyFolder(
  supabase: Client,
  userId: string,
  folder: WeeklyTaskFolder
): Promise<void> {
  const { error } = await supabase.from("weekly_task_folders").insert({
    id: folder.id,
    user_id: userId,
    title: folder.title,
    created_at: folder.createdAt,
  });
  if (error) throw error;
}

export async function deleteWeeklyFolder(
  supabase: Client,
  folderId: string
): Promise<void> {
  const { error } = await supabase
    .from("weekly_task_folders")
    .delete()
    .eq("id", folderId);
  if (error) throw error;
}

export async function insertWeeklyTask(
  supabase: Client,
  userId: string,
  task: WeeklyTask
): Promise<void> {
  const { error } = await supabase.from("weekly_tasks").insert({
    id: task.id,
    user_id: userId,
    description: task.description,
    is_completed: task.isCompleted,
    week_identifier: task.weekIdentifier,
    folder_id: task.folderId ?? null,
  });
  if (error) throw error;
}

export async function insertWeeklyTasks(
  supabase: Client,
  userId: string,
  tasks: WeeklyTask[]
): Promise<void> {
  if (tasks.length === 0) return;
  const { error } = await supabase.from("weekly_tasks").insert(
    tasks.map((task) => ({
      id: task.id,
      user_id: userId,
      description: task.description,
      is_completed: task.isCompleted,
      week_identifier: task.weekIdentifier,
      folder_id: task.folderId ?? null,
    }))
  );
  if (error) throw error;
}

export async function updateWeeklyTask(
  supabase: Client,
  taskId: string,
  isCompleted: boolean
): Promise<void> {
  const { error } = await supabase
    .from("weekly_tasks")
    .update({ is_completed: isCompleted })
    .eq("id", taskId);
  if (error) throw error;
}

export async function deleteWeeklyTask(
  supabase: Client,
  taskId: string
): Promise<void> {
  const { error } = await supabase
    .from("weekly_tasks")
    .delete()
    .eq("id", taskId);
  if (error) throw error;
}
