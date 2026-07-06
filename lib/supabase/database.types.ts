export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
        };
      };
      project_tasks: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          description: string;
          is_completed: boolean;
        };
        Insert: {
          id: string;
          user_id: string;
          project_id: string;
          description: string;
          is_completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          description?: string;
          is_completed?: boolean;
        };
      };
      weekly_task_folders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
        };
      };
      weekly_tasks: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          is_completed: boolean;
          week_identifier: string;
          folder_id: string | null;
        };
        Insert: {
          id: string;
          user_id: string;
          description: string;
          is_completed?: boolean;
          week_identifier: string;
          folder_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          description?: string;
          is_completed?: boolean;
          week_identifier?: string;
          folder_id?: string | null;
        };
      };
    };
  };
}
