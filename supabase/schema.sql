-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- Projects
create table if not exists public.projects (
  id text primary key,
  user_id uuid references auth.users (id) on delete cascade not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- Project tasks
create table if not exists public.project_tasks (
  id text primary key,
  user_id uuid references auth.users (id) on delete cascade not null,
  project_id text references public.projects (id) on delete cascade not null,
  description text not null,
  is_completed boolean not null default false
);

-- Weekly task folders (imported plans)
create table if not exists public.weekly_task_folders (
  id text primary key,
  user_id uuid references auth.users (id) on delete cascade not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- Weekly tasks
create table if not exists public.weekly_tasks (
  id text primary key,
  user_id uuid references auth.users (id) on delete cascade not null,
  description text not null,
  is_completed boolean not null default false,
  week_identifier text not null,
  folder_id text references public.weekly_task_folders (id) on delete cascade
);

-- Indexes
create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists project_tasks_user_id_idx on public.project_tasks (user_id);
create index if not exists project_tasks_project_id_idx on public.project_tasks (project_id);
create index if not exists weekly_task_folders_user_id_idx on public.weekly_task_folders (user_id);
create index if not exists weekly_tasks_user_id_idx on public.weekly_tasks (user_id);
create index if not exists weekly_tasks_week_idx on public.weekly_tasks (week_identifier);

-- Row Level Security
alter table public.projects enable row level security;
alter table public.project_tasks enable row level security;
alter table public.weekly_task_folders enable row level security;
alter table public.weekly_tasks enable row level security;

create policy "Users manage own projects"
  on public.projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own project tasks"
  on public.project_tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own weekly folders"
  on public.weekly_task_folders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own weekly tasks"
  on public.weekly_tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
