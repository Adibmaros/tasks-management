import type { RealtimeChannel } from "@supabase/supabase-js";

export const useSupabaseRealtime = (userId: number) => {
  let tasksChannel: RealtimeChannel | null = null;
  let isLocalUpdate = false;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const setLocalUpdate = (value: boolean) => {
    isLocalUpdate = value;
    // Auto reset after 2 seconds
    if (value) {
      setTimeout(() => {
        isLocalUpdate = false;
      }, 2000);
    }
  };

  const subscribe = (onTaskChange: (payload: any) => void, onTagChange?: (payload: any) => void) => {
    try {
      const supabase = useSupabaseClient();

      if (!supabase) {
        console.warn("Supabase client not available, realtime disabled");
        return { setLocalUpdate };
      }

      tasksChannel = supabase
        .channel(`tasks-user-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tasks",
            filter: `userId=eq.${userId}`,
          },
          (payload: any) => {
            // Skip jika ini adalah local update
            if (isLocalUpdate) {
              console.log("Skipping realtime update (local update in progress)");
              return;
            }

            // Debounce untuk menghindari multiple fetch
            if (debounceTimer) {
              clearTimeout(debounceTimer);
            }
            debounceTimer = setTimeout(() => {
              console.log("Realtime task update:", payload.eventType);
              onTaskChange(payload);
            }, 500);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "task_tags",
          },
          (payload: any) => {
            if (isLocalUpdate) return;

            if (debounceTimer) {
              clearTimeout(debounceTimer);
            }
            debounceTimer = setTimeout(() => {
              console.log("Realtime task_tags update:", payload.eventType);
              onTaskChange(payload);
            }, 500);
          }
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
        });

      return { setLocalUpdate };
    } catch (error) {
      console.warn("Failed to setup realtime subscription:", error);
      return { setLocalUpdate };
    }
  };

  const unsubscribe = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    try {
      const supabase = useSupabaseClient();
      if (tasksChannel) {
        supabase?.removeChannel(tasksChannel);
        tasksChannel = null;
      }
    } catch (error) {
      console.warn("Failed to unsubscribe:", error);
    }
  };

  return {
    subscribe,
    unsubscribe,
  };
};
