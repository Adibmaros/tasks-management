export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          name: string;
          email: string;
          password: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          password: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          password?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      tasks: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          status: "PLAN" | "DOING" | "DONE";
          position: number;
          createdAt: string;
          updatedAt: string;
          userId: number;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          status?: "PLAN" | "DOING" | "DONE";
          position: number;
          createdAt?: string;
          updatedAt?: string;
          userId: number;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          status?: "PLAN" | "DOING" | "DONE";
          position?: number;
          createdAt?: string;
          updatedAt?: string;
          userId?: number;
        };
      };
      tags: {
        Row: {
          id: number;
          name: string;
          color: string | null;
          createdAt: string;
          userId: number;
        };
        Insert: {
          id?: number;
          name: string;
          color?: string | null;
          createdAt?: string;
          userId: number;
        };
        Update: {
          id?: number;
          name?: string;
          color?: string | null;
          createdAt?: string;
          userId?: number;
        };
      };
      task_tags: {
        Row: {
          taskId: number;
          tagId: number;
        };
        Insert: {
          taskId: number;
          tagId: number;
        };
        Update: {
          taskId?: number;
          tagId?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      Status: "PLAN" | "DOING" | "DONE";
    };
  };
};
