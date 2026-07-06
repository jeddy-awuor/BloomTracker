"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import * as db from "@/lib/supabase/data";
import { migrateLocalToSupabase, hasLocalData } from "@/lib/supabase/migrate";
import {
  Project,
  ProjectTask,
  ProjectWithProgress,
  WeeklyTask,
  WeeklyTaskFolder,
  STORAGE_KEYS,
} from "@/types";
import { generateId, getWeekIdentifier } from "@/lib/utils";

export interface WeeklyFolderGroup {
  folder: WeeklyTaskFolder;
  tasks: WeeklyTask[];
  completedCount: number;
  totalCount: number;
}

function useSupabaseMode() {
  const { user, isConfigured, isLoading: authLoading } = useAuth();
  const useCloud = isConfigured && !!user;
  return { user, useCloud, isReady: !authLoading || !isConfigured };
}

export function useProjects() {
  const { user, useCloud, isReady } = useSupabaseMode();

  const [localProjects, setLocalProjects, projectsHydrated] = useLocalStorage<
    Project[]
  >(STORAGE_KEYS.projects, []);
  const [localProjectTasks, setLocalProjectTasks, tasksHydrated] =
    useLocalStorage<ProjectTask[]>(STORAGE_KEYS.projectTasks, []);

  const [cloudProjects, setCloudProjects] = useState<Project[]>([]);
  const [cloudProjectTasks, setCloudProjectTasks] = useState<ProjectTask[]>([]);
  const [cloudHydrated, setCloudHydrated] = useState(false);

  useEffect(() => {
    if (!useCloud || !user) {
      setCloudHydrated(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        await migrateLocalToSupabase(supabase, user!.id);
        const [projects, tasks] = await Promise.all([
          db.fetchProjects(supabase),
          db.fetchProjectTasks(supabase),
        ]);
        if (!cancelled) {
          const useLocalFallback =
            projects.length === 0 &&
            tasks.length === 0 &&
            hasLocalData();
          if (!useLocalFallback) {
            setCloudProjects(projects);
            setCloudProjectTasks(tasks);
          }
          setCloudHydrated(true);
        }
      } catch (error) {
        console.error("Failed to load projects from Supabase:", error);
        if (!cancelled) {
          setCloudHydrated(true);
        }
      }
    }

    setCloudHydrated(false);
    load();

    return () => {
      cancelled = true;
    };
  }, [useCloud, user]);

  const projects = useCloud && cloudHydrated && cloudProjects.length === 0 && localProjects.length > 0
    ? localProjects
    : useCloud
      ? cloudProjects
      : localProjects;
  const projectTasks = useCloud && cloudHydrated && cloudProjectTasks.length === 0 && localProjectTasks.length > 0
    ? localProjectTasks
    : useCloud
      ? cloudProjectTasks
      : localProjectTasks;
  const isHydrated = useCloud
    ? isReady && cloudHydrated
    : isReady && projectsHydrated && tasksHydrated;

  const projectsWithProgress: ProjectWithProgress[] = useMemo(() => {
    return projects.map((project) => {
      const tasks = projectTasks.filter((t) => t.projectId === project.id);
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.isCompleted).length;
      const progress =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      return {
        ...project,
        progress,
        totalTasks,
        completedTasks,
      };
    });
  }, [projects, projectTasks]);

  const setProjects = useCloud ? setCloudProjects : setLocalProjects;
  const setProjectTasks = useCloud ? setCloudProjectTasks : setLocalProjectTasks;

  const syncError = useCallback((action: string, error: unknown) => {
    console.error(`Supabase ${action} failed:`, error);
  }, []);

  const addProject = (title: string) => {
    const newProject: Project = {
      id: generateId(),
      title: title.trim(),
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);

    if (useCloud && user) {
      db.insertProject(createClient(), user.id, newProject).catch((e) =>
        syncError("addProject", e)
      );
    }

    return newProject;
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setProjectTasks((prev) => prev.filter((t) => t.projectId !== projectId));

    if (useCloud && user) {
      db.deleteProject(createClient(), projectId).catch((e) =>
        syncError("deleteProject", e)
      );
    }
  };

  const getProjectById = (projectId: string) =>
    projectsWithProgress.find((p) => p.id === projectId);

  const getTasksForProject = (projectId: string) =>
    projectTasks.filter((t) => t.projectId === projectId);

  const addProjectTask = (projectId: string, description: string) => {
    const newTask: ProjectTask = {
      id: generateId(),
      projectId,
      description: description.trim(),
      isCompleted: false,
    };
    setProjectTasks((prev) => [...prev, newTask]);

    if (useCloud && user) {
      db.insertProjectTask(createClient(), user.id, newTask).catch((e) =>
        syncError("addProjectTask", e)
      );
    }

    return newTask;
  };

  const addProjectTasksBulk = (
    projectId: string,
    tasks: { description: string; isCompleted: boolean }[]
  ) => {
    const newTasks: ProjectTask[] = tasks.map((t) => ({
      id: generateId(),
      projectId,
      description: t.description.trim(),
      isCompleted: t.isCompleted,
    }));
    setProjectTasks((prev) => [...prev, ...newTasks]);

    if (useCloud && user) {
      db.insertProjectTasks(createClient(), user.id, newTasks).catch((e) =>
        syncError("addProjectTasksBulk", e)
      );
    }

    return newTasks;
  };

  const toggleProjectTask = (taskId: string) => {
    let nextCompleted = false;
    setProjectTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          nextCompleted = !t.isCompleted;
          return { ...t, isCompleted: nextCompleted };
        }
        return t;
      })
    );

    if (useCloud && user) {
      db.updateProjectTask(createClient(), taskId, nextCompleted).catch((e) =>
        syncError("toggleProjectTask", e)
      );
    }
  };

  const deleteProjectTask = (taskId: string) => {
    setProjectTasks((prev) => prev.filter((t) => t.id !== taskId));

    if (useCloud && user) {
      db.deleteProjectTask(createClient(), taskId).catch((e) =>
        syncError("deleteProjectTask", e)
      );
    }
  };

  return {
    projects: projectsWithProgress,
    isHydrated,
    addProject,
    deleteProject,
    getProjectById,
    getTasksForProject,
    addProjectTask,
    addProjectTasksBulk,
    toggleProjectTask,
    deleteProjectTask,
  };
}

export function useWeeklyTasks() {
  const { user, useCloud, isReady } = useSupabaseMode();
  const currentWeek = getWeekIdentifier();

  const [localWeeklyTasks, setLocalWeeklyTasks, tasksHydrated] = useLocalStorage<
    WeeklyTask[]
  >(STORAGE_KEYS.weeklyTasks, []);
  const [localFolders, setLocalFolders, foldersHydrated] = useLocalStorage<
    WeeklyTaskFolder[]
  >(STORAGE_KEYS.weeklyFolders, []);

  const [cloudWeeklyTasks, setCloudWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [cloudFolders, setCloudFolders] = useState<WeeklyTaskFolder[]>([]);
  const [cloudHydrated, setCloudHydrated] = useState(false);

  useEffect(() => {
    if (!useCloud || !user) {
      setCloudHydrated(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const supabase = createClient();
        await migrateLocalToSupabase(supabase, user!.id);
        const [tasks, folders] = await Promise.all([
          db.fetchWeeklyTasks(supabase),
          db.fetchWeeklyFolders(supabase),
        ]);
        if (!cancelled) {
          const useLocalFallback =
            tasks.length === 0 &&
            folders.length === 0 &&
            hasLocalData();
          if (!useLocalFallback) {
            setCloudWeeklyTasks(tasks);
            setCloudFolders(folders);
          }
          setCloudHydrated(true);
        }
      } catch (error) {
        console.error("Failed to load weekly tasks from Supabase:", error);
        if (!cancelled) {
          setCloudHydrated(true);
        }
      }
    }

    setCloudHydrated(false);
    load();

    return () => {
      cancelled = true;
    };
  }, [useCloud, user]);

  const weeklyTasks =
    useCloud && cloudHydrated && cloudWeeklyTasks.length === 0 && localWeeklyTasks.length > 0
      ? localWeeklyTasks
      : useCloud
        ? cloudWeeklyTasks
        : localWeeklyTasks;
  const folders =
    useCloud && cloudHydrated && cloudFolders.length === 0 && localFolders.length > 0
      ? localFolders
      : useCloud
        ? cloudFolders
        : localFolders;
  const isHydrated = useCloud
    ? isReady && cloudHydrated
    : isReady && tasksHydrated && foldersHydrated;

  const setWeeklyTasks = useCloud ? setCloudWeeklyTasks : setLocalWeeklyTasks;
  const setFolders = useCloud ? setCloudFolders : setLocalFolders;

  const syncError = useCallback((action: string, error: unknown) => {
    console.error(`Supabase ${action} failed:`, error);
  }, []);

  const currentWeekTasks = useMemo(
    () => weeklyTasks.filter((t) => t.weekIdentifier === currentWeek),
    [weeklyTasks, currentWeek]
  );

  const folderGroups: WeeklyFolderGroup[] = useMemo(() => {
    const folderIds = new Set(
      currentWeekTasks.filter((t) => t.folderId).map((t) => t.folderId!)
    );

    return folders
      .filter((f) => folderIds.has(f.id))
      .map((folder) => {
        const tasks = currentWeekTasks.filter((t) => t.folderId === folder.id);
        const completedCount = tasks.filter((t) => t.isCompleted).length;
        return {
          folder,
          tasks,
          completedCount,
          totalCount: tasks.length,
        };
      });
  }, [currentWeekTasks, folders]);

  const looseTasks = useMemo(
    () => currentWeekTasks.filter((t) => !t.folderId),
    [currentWeekTasks]
  );

  const completedCount = currentWeekTasks.filter((t) => t.isCompleted).length;
  const totalCount = currentWeekTasks.length;

  const createFolder = (title: string) => {
    const folder: WeeklyTaskFolder = {
      id: generateId(),
      title: title.trim() || "Imported Plan",
      createdAt: new Date().toISOString(),
    };
    setFolders((prev) => [folder, ...prev]);

    if (useCloud && user) {
      db.insertWeeklyFolder(createClient(), user.id, folder).catch((e) =>
        syncError("createFolder", e)
      );
    }

    return folder;
  };

  const deleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setWeeklyTasks((prev) => prev.filter((t) => t.folderId !== folderId));

    if (useCloud && user) {
      db.deleteWeeklyFolder(createClient(), folderId).catch((e) =>
        syncError("deleteFolder", e)
      );
    }
  };

  const addWeeklyTask = (description: string) => {
    const newTask: WeeklyTask = {
      id: generateId(),
      description: description.trim(),
      isCompleted: false,
      weekIdentifier: currentWeek,
    };
    setWeeklyTasks((prev) => [...prev, newTask]);

    if (useCloud && user) {
      db.insertWeeklyTask(createClient(), user.id, newTask).catch((e) =>
        syncError("addWeeklyTask", e)
      );
    }

    return newTask;
  };

  const addWeeklyTasksBulk = (
    tasks: {
      description: string;
      isCompleted: boolean;
      weekIdentifier: string;
    }[],
    folderId?: string
  ) => {
    const newTasks: WeeklyTask[] = tasks.map((t) => ({
      id: generateId(),
      description: t.description.trim(),
      isCompleted: t.isCompleted,
      weekIdentifier: t.weekIdentifier,
      ...(folderId ? { folderId } : {}),
    }));
    setWeeklyTasks((prev) => [...prev, ...newTasks]);

    if (useCloud && user) {
      db.insertWeeklyTasks(createClient(), user.id, newTasks).catch((e) =>
        syncError("addWeeklyTasksBulk", e)
      );
    }

    return newTasks;
  };

  const toggleWeeklyTask = (taskId: string) => {
    let nextCompleted = false;
    setWeeklyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          nextCompleted = !t.isCompleted;
          return { ...t, isCompleted: nextCompleted };
        }
        return t;
      })
    );

    if (useCloud && user) {
      db.updateWeeklyTask(createClient(), taskId, nextCompleted).catch((e) =>
        syncError("toggleWeeklyTask", e)
      );
    }
  };

  const deleteWeeklyTask = (taskId: string) => {
    setWeeklyTasks((prev) => prev.filter((t) => t.id !== taskId));

    if (useCloud && user) {
      db.deleteWeeklyTask(createClient(), taskId).catch((e) =>
        syncError("deleteWeeklyTask", e)
      );
    }
  };

  return {
    currentWeek,
    tasks: currentWeekTasks,
    folderGroups,
    looseTasks,
    completedCount,
    totalCount,
    isHydrated,
    createFolder,
    deleteFolder,
    addWeeklyTask,
    addWeeklyTasksBulk,
    toggleWeeklyTask,
    deleteWeeklyTask,
  };
}
