interface TimerTask {
  id: number;
  name: string;
  startedAt: string | Date;
  durationMinutes: number;
}

export function useTaskTimer() {
  const notifiedTasks = useState<Set<number>>("notifiedTasks", () => new Set());

  const calculateTimeLeft = (task: TimerTask): number => {
    if (!task.startedAt || !task.durationMinutes) return -1;

    const startTime = new Date(task.startedAt).getTime();
    const deadline = startTime + task.durationMinutes * 60 * 1000;
    const now = Date.now();

    return Math.max(0, deadline - now);
  };

  const formatTimeLeft = (milliseconds: number): string => {
    if (milliseconds <= 0) return "Waktu habis!";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}j ${minutes}m ${seconds}d`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}d`;
    }
    return `${seconds}d`;
  };

  const getProgressPercentage = (task: TimerTask): number => {
    if (!task.startedAt || !task.durationMinutes) return 0;

    const startTime = new Date(task.startedAt).getTime();
    const totalDuration = task.durationMinutes * 60 * 1000;
    const elapsed = Date.now() - startTime;

    return Math.min(100, (elapsed / totalDuration) * 100);
  };

  const sendNotification = (task: TimerTask) => {
    if (notifiedTasks.value.has(task.id)) return;

    notifiedTasks.value.add(task.id);

    // Browser notification
    if (import.meta.client && "Notification" in window && Notification.permission === "granted") {
      new Notification("⏰ Waktu Habis!", {
        body: `Tugas "${task.name}" telah melewati batas waktu!`,
        icon: "/favicon.ico",
        tag: `task-${task.id}`,
      });
    }

    // Play sound (optional)
    if (import.meta.client) {
      try {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {
        // Ignore audio errors
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (import.meta.client && "Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const clearNotification = (taskId: number) => {
    notifiedTasks.value.delete(taskId);
  };

  return {
    calculateTimeLeft,
    formatTimeLeft,
    getProgressPercentage,
    sendNotification,
    requestNotificationPermission,
    clearNotification,
    notifiedTasks,
  };
}
