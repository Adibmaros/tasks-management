<script setup lang="ts">
import { Plus, Pencil, Trash2, GripVertical, Layout, MoreVertical, Clock, CheckCircle2, Circle, TagIcon, Archive, ArchiveRestore, X, Timer, Play } from "lucide-vue-next";
import { useTaskTimer } from "~/composables/useTaskTimer";

// 1. Interfaces & Types
interface Tag {
  id: number;
  name: string;
  color: string | null;
}

interface Task {
  id: number;
  name: string;
  description?: string | null;
  status: "PLAN" | "DOING" | "DONE" | "ARCHIEVED";
  position: number;
  durationMinutes?: number | null;
  startedAt?: string | Date | null;
  tags?: Tag[];
}

const props = defineProps<{
  userId: number;
}>();

// 2. State Management
const tasks = ref<Task[]>([]);
const archivedTasks = ref<Task[]>([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const isDragging = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showTagModal = ref(false);
const showArchiveModal = ref(false);
const selectedTaskId = ref<number | undefined>(undefined);
const addToStatus = ref<"PLAN" | "DOING" | "DONE">("PLAN");
const editingTask = ref<Task | null>(null);
const newTaskName = ref("");
const newTaskDescription = ref("");

// Task tags cache
const taskTagsMap = ref<Record<number, Tag[]>>({});

// Drag & Drop States
const draggedTaskId = ref<number | null>(null);
const dragOverColumn = ref<"PLAN" | "DOING" | "DONE" | null>(null);
const dragOverTaskId = ref<number | null>(null);

// Realtime control
let setLocalUpdate: ((value: boolean) => void) | null = null;

const columns = [
  { status: "PLAN" as const, title: "Rencana", color: "indigo", icon: Circle },
  { status: "DOING" as const, title: "Proses", color: "amber", icon: Clock },
  { status: "DONE" as const, title: "Selesai", color: "emerald", icon: CheckCircle2 },
];

// Timer composable
const { calculateTimeLeft, formatTimeLeft, getProgressPercentage, sendNotification, requestNotificationPermission, clearNotification } = useTaskTimer();

// Timer states
const timerIntervalId = ref<NodeJS.Timeout | null>(null);
const taskTimers = ref<Record<number, number>>({});

// Duration options for modal
const durationOptions = [
  { label: "15 menit", value: 15 },
  { label: "30 menit", value: 30 },
  { label: "45 menit", value: 45 },
  { label: "1 jam", value: 60 },
  { label: "1.5 jam", value: 90 },
  { label: "2 jam", value: 120 },
  { label: "3 jam", value: 180 },
  { label: "4 jam", value: 240 },
];

const newTaskDuration = ref<number | null>(null);

// 3. Logic & Handlers

const getTasksByStatus = (status: "PLAN" | "DOING" | "DONE") => {
  return tasks.value.filter((task) => task.status === status).sort((a, b) => a.position - b.position);
};

const fetchTaskTags = async (taskId: number) => {
  try {
    const tags = await $fetch<Tag[]>(`/api/task-tags?taskId=${taskId}`);
    taskTagsMap.value[taskId] = tags;
  } catch (error) {
    taskTagsMap.value[taskId] = [];
  }
};

const fetchAllTaskTags = async () => {
  const promises = tasks.value.map((task) => fetchTaskTags(task.id));
  await Promise.all(promises);
};

const getTaskTags = (taskId: number): Tag[] => {
  return taskTagsMap.value[taskId] || [];
};

const fetchTasks = async (silent = false) => {
  try {
    if (!silent) isLoading.value = true;

    // Fetch active tasks (excluding ARCHIEVED)
    const data = await $fetch<Task[]>(`/api/tasks/user/${props.userId}`);
    tasks.value = data.filter((t) => t.status !== "ARCHIEVED");

    await fetchAllTaskTags();
  } catch (error) {
    // Error handling tanpa logging
  } finally {
    if (!silent) isLoading.value = false;
  }
};

const fetchArchivedTasks = async () => {
  try {
    const data = await $fetch<Task[]>(`/api/tasks/user/${props.userId}/archived`);
    archivedTasks.value = data;
  } catch (error) {
    archivedTasks.value = [];
  }
};

const createTask = async () => {
  if (!newTaskName.value.trim() || isSubmitting.value) return;
  isSubmitting.value = true;
  setLocalUpdate?.(true);
  try {
    const task = await $fetch<Task>("/api/tasks", {
      method: "POST",
      body: {
        name: newTaskName.value,
        description: newTaskDescription.value || null,
        status: addToStatus.value,
        userId: props.userId,
        durationMinutes: newTaskDuration.value,
      },
    });
    tasks.value.push(task);
    closeAddModal();
  } catch (error) {
    // Error handling tanpa logging
  } finally {
    isSubmitting.value = false;
  }
};

const updateTask = async () => {
  if (!editingTask.value || !newTaskName.value.trim() || isSubmitting.value) return;
  isSubmitting.value = true;
  setLocalUpdate?.(true);
  try {
    const updated = await $fetch<Task>(`/api/tasks/${editingTask.value.id}`, {
      method: "PUT",
      body: {
        name: newTaskName.value,
        description: newTaskDescription.value || null,
        durationMinutes: newTaskDuration.value,
      },
    });
    const index = tasks.value.findIndex((t) => t.id === updated.id);
    if (index !== -1) tasks.value[index] = updated;
    closeEditModal();
  } catch (error) {
    // Error handling tanpa logging
  } finally {
    isSubmitting.value = false;
  }
};

const deleteTask = async (id: number) => {
  if (!confirm("Hapus tugas ini?")) return;
  setLocalUpdate?.(true);
  try {
    await $fetch<void>(`/api/tasks/${id}`, { method: "DELETE" });
    tasks.value = tasks.value.filter((t) => t.id !== id);
    // Juga hapus dari archivedTasks jika ada
    archivedTasks.value = archivedTasks.value.filter((t) => t.id !== id);
  } catch (error) {
    // Error handling tanpa logging
  }
};

const archiveTask = async (taskId: number) => {
  if (!confirm("Arsipkan tugas ini?")) return;
  setLocalUpdate?.(true);
  try {
    await $fetch(`/api/tasks/${taskId}/archive`, { method: "PUT" });
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
  } catch (error) {
    // Error handling
  }
};

const unarchiveTask = async (taskId: number) => {
  setLocalUpdate?.(true);
  try {
    await $fetch(`/api/tasks/${taskId}/unarchive`, { method: "PUT" });
    await fetchArchivedTasks();
    await fetchTasks(true);
  } catch (error) {
    // Error handling
  }
};

const reorderTask = async (taskId: number, newStatus: "PLAN" | "DOING" | "DONE", newPosition: number) => {
  const taskIndex = tasks.value.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  const task = tasks.value[taskIndex]!;
  const oldStatus = task.status;
  const oldPosition = task.position;

  if (oldStatus === newStatus && oldPosition === newPosition) return;

  setLocalUpdate?.(true);
  const oldTasks = JSON.parse(JSON.stringify(tasks.value));

  // Optimistic Update Logic
  if (oldStatus !== newStatus) {
    tasks.value
      .filter((t) => t.status === oldStatus && t.id !== taskId)
      .sort((a, b) => a.position - b.position)
      .forEach((t, idx) => {
        t.position = idx;
      });

    task.status = newStatus;
    tasks.value
      .filter((t) => t.status === newStatus && t.id !== taskId)
      .sort((a, b) => a.position - b.position)
      .forEach((t, idx) => {
        t.position = idx >= newPosition ? idx + 1 : idx;
      });
    task.position = newPosition;
  } else {
    const columnTasks = tasks.value.filter((t) => t.status === oldStatus).sort((a, b) => a.position - b.position);
    const filtered = columnTasks.filter((t) => t.id !== taskId);
    filtered.splice(newPosition, 0, task);
    filtered.forEach((t, idx) => {
      t.position = idx;
    });
  }

  try {
    await $fetch("/api/tasks/reorder", {
      method: "POST",
      body: { taskId, newStatus, newPosition, userId: props.userId },
    });
  } catch (error) {
    tasks.value = oldTasks;
  }
};

// Timer update function
const updateTimers = () => {
  tasks.value.forEach((task) => {
    if (task.status === "DOING" && task.durationMinutes && task.startedAt) {
      const timeLeft = calculateTimeLeft({
        id: task.id,
        name: task.name,
        startedAt: task.startedAt,
        durationMinutes: task.durationMinutes,
      });
      taskTimers.value[task.id] = timeLeft;

      // Send notification when time is up
      if (timeLeft <= 0) {
        sendNotification({
          id: task.id,
          name: task.name,
          startedAt: task.startedAt,
          durationMinutes: task.durationMinutes,
        });
      }
    }
  });
};

const getTaskTimeLeft = (taskId: number): string => {
  const timeLeft = taskTimers.value[taskId];
  if (timeLeft === undefined) return "";
  return formatTimeLeft(timeLeft);
};

const getTaskProgress = (task: Task): number => {
  if (!task.startedAt || !task.durationMinutes) return 0;
  return getProgressPercentage({
    id: task.id,
    name: task.name,
    startedAt: task.startedAt,
    durationMinutes: task.durationMinutes,
  });
};

const isTaskExpired = (taskId: number): boolean => {
  const timeLeft = taskTimers.value[taskId];
  return timeLeft !== undefined && timeLeft <= 0;
};

// 4. Modal Control
const openAddModal = (status: "PLAN" | "DOING" | "DONE") => {
  addToStatus.value = status;
  newTaskDuration.value = null;
  showAddModal.value = true;
};
const closeAddModal = () => {
  showAddModal.value = false;
  newTaskName.value = "";
  newTaskDescription.value = "";
  newTaskDuration.value = null;
};
const openEditModal = (task: Task) => {
  editingTask.value = task;
  newTaskName.value = task.name;
  newTaskDescription.value = task.description || "";
  newTaskDuration.value = task.durationMinutes || null;
  showEditModal.value = true;
};
const closeEditModal = () => {
  showEditModal.value = false;
  editingTask.value = null;
  newTaskDuration.value = null;
};

const openTagModal = (taskId: number) => {
  selectedTaskId.value = taskId;
  showTagModal.value = true;
};

const closeTagModal = () => {
  showTagModal.value = false;
  selectedTaskId.value = undefined;
};

const onTagsUpdated = async () => {
  if (selectedTaskId.value) {
    await fetchTaskTags(selectedTaskId.value);
  }
};

const openArchiveModal = async () => {
  showArchiveModal.value = true;
  await fetchArchivedTasks();
};

const closeArchiveModal = () => {
  showArchiveModal.value = false;
};

// 5. Drag & Drop Handlers
const onDragStart = (e: DragEvent, taskId: number) => {
  isDragging.value = true;
  draggedTaskId.value = taskId;
  if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
};
const onDragEnd = () => {
  isDragging.value = false;
  draggedTaskId.value = null;
  dragOverColumn.value = null;
  dragOverTaskId.value = null;
};
const onDragOver = (e: DragEvent, status: "PLAN" | "DOING" | "DONE") => {
  e.preventDefault();
  dragOverColumn.value = status;
};
const onDragLeave = (e: DragEvent) => {
  const relatedTarget = e.relatedTarget as HTMLElement;
  if (!relatedTarget?.closest("[data-droppable]")) dragOverColumn.value = null;
};
const onDragOverTask = (e: DragEvent, taskId: number) => {
  e.preventDefault();
  e.stopPropagation();
  if (draggedTaskId.value !== taskId) dragOverTaskId.value = taskId;
};
const onDrop = async (e: DragEvent, status: "PLAN" | "DOING" | "DONE") => {
  e.preventDefault();
  const taskId = draggedTaskId.value;
  const targetTaskId = dragOverTaskId.value;
  if (taskId === null) return;

  const tasksInColumn = getTasksByStatus(status);
  let newPosition = tasksInColumn.length;

  if (targetTaskId !== null && targetTaskId !== taskId) {
    const targetTask = tasksInColumn.find((t) => t.id === targetTaskId);
    if (targetTask) newPosition = targetTask.position;
  }

  await reorderTask(taskId, status, newPosition);
  onDragEnd();
};

// 6. Lifecycle & Realtime
const { subscribe, unsubscribe } = useSupabaseRealtime(props.userId);

onMounted(async () => {
  await fetchTasks();
  await requestNotificationPermission();

  // Start timer interval
  timerIntervalId.value = setInterval(updateTimers, 1000);
  updateTimers();

  const result = subscribe(() => {
    if (!isDragging.value) fetchTasks(true);
  });
  if (result?.setLocalUpdate) setLocalUpdate = result.setLocalUpdate;
});

onUnmounted(() => {
  unsubscribe();
  if (timerIntervalId.value) {
    clearInterval(timerIntervalId.value);
  }
});
</script>

<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
      <div>
        <h1 class="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">Papan Tugas</h1>
        <p class="text-[10px] sm:text-xs lg:text-sm text-slate-500 font-medium">Atur alur kerja Anda dengan drag and drop.</p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Archive Button -->
        <button
          @click="openArchiveModal"
          class="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] lg:text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-1.5 lg:gap-2 transition-colors"
        >
          <Archive :size="12" class="sm:w-[14px] sm:h-[14px]" /> Arsip
        </button>
        <div class="flex items-center gap-2 bg-white p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm w-fit">
          <button class="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] lg:text-xs font-bold bg-indigo-50 text-indigo-700 rounded-md sm:rounded-lg flex items-center gap-1 sm:gap-1.5 lg:gap-2">
            <Layout :size="12" class="sm:w-[14px] sm:h-[14px]" /> Kanban
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-24">
      <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-4 border-slate-100 border-t-indigo-600"></div>
      <p class="mt-3 sm:mt-4 text-slate-500 text-[10px] sm:text-xs lg:text-sm font-semibold italic">Sinkronisasi data...</p>
    </div>

    <!-- Kanban Board -->
    <div v-else class="relative">
      <!-- Mobile scroll hint -->
      <div class="lg:hidden text-[9px] sm:text-[10px] text-slate-400 font-medium mb-2 flex items-center gap-1">
        <span>← Geser untuk melihat kolom lain →</span>
      </div>

      <!-- Scrollable container for mobile/tablet -->
      <div class="flex lg:grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x snap-mandatory scroll-smooth -mx-3 px-3 sm:-mx-4 sm:px-4 lg:mx-0 lg:px-0">
        <div
          v-for="column in columns"
          :key="column.status"
          class="flex-shrink-0 w-[260px] sm:w-[300px] lg:w-auto snap-center flex flex-col bg-slate-100/40 rounded-xl sm:rounded-2xl border border-slate-200/60 p-2.5 sm:p-3 lg:p-4 min-h-[400px] sm:min-h-[500px] lg:min-h-[650px] transition-all"
        >
          <!-- Column Header -->
          <div class="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6 px-0.5 sm:px-1">
            <div class="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <component
                :is="column.icon"
                :size="14"
                class="sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]"
                :class="{
                  'text-indigo-500': column.status === 'PLAN',
                  'text-amber-500': column.status === 'DOING',
                  'text-emerald-500': column.status === 'DONE',
                }"
              />
              <h3 class="font-bold text-slate-700 text-[10px] sm:text-xs lg:text-sm uppercase tracking-wider lg:tracking-widest">{{ column.title }}</h3>
              <span class="px-1 sm:px-1.5 lg:px-2 py-0.5 bg-white border border-slate-200 text-slate-500 text-[8px] sm:text-[9px] lg:text-[10px] font-black rounded-md shadow-sm">
                {{ getTasksByStatus(column.status).length }}
              </span>
            </div>
            <button @click="openAddModal(column.status)" class="p-1 sm:p-1.5 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200 rounded-md sm:rounded-lg transition-all shadow-sm">
              <Plus :size="12" class="sm:w-[14px] sm:h-[14px] lg:w-4 lg:h-4" />
            </button>
          </div>

          <!-- Droppable Area -->
          <div
            data-droppable
            class="flex-1 space-y-2 sm:space-y-3 lg:space-y-4 rounded-lg sm:rounded-xl transition-all duration-300 overflow-y-auto"
            :class="{ 'bg-indigo-50/50 ring-2 ring-indigo-300 ring-dashed': dragOverColumn === column.status }"
            @dragover="onDragOver($event, column.status)"
            @dragleave="onDragLeave"
            @drop="onDrop($event, column.status)"
          >
            <!-- Empty State -->
            <div v-if="getTasksByStatus(column.status).length === 0" class="border-2 border-dashed border-slate-200 rounded-xl sm:rounded-2xl py-6 sm:py-8 lg:py-12 flex flex-col items-center justify-center opacity-40">
              <p class="text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tarik tugas ke sini</p>
            </div>

            <!-- Task Cards -->
            <div
              v-for="task in getTasksByStatus(column.status)"
              :key="task.id"
              draggable="true"
              @dragstart="onDragStart($event, task.id)"
              @dragend="onDragEnd"
              @dragover="onDragOverTask($event, task.id)"
              class="group bg-white p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 relative overflow-hidden"
              :class="{
                'opacity-30 scale-95': draggedTaskId === task.id,
                'ring-2 ring-indigo-500': dragOverTaskId === task.id && draggedTaskId !== task.id,
                'border-red-300 bg-red-50/30': isTaskExpired(task.id),
                'border-slate-200 hover:border-indigo-200': !isTaskExpired(task.id),
              }"
            >
              <!-- Status Bar -->
              <div
                class="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5"
                :class="{
                  'bg-indigo-500': column.status === 'PLAN' && !isTaskExpired(task.id),
                  'bg-amber-500': column.status === 'DOING' && !isTaskExpired(task.id),
                  'bg-emerald-500': column.status === 'DONE',
                  'bg-red-500 animate-pulse': isTaskExpired(task.id),
                }"
              ></div>

              <!-- Task Content -->
              <div class="flex items-start justify-between gap-2">
                <h4 class="font-bold text-slate-800 text-xs sm:text-sm lg:text-[15px] leading-snug flex-1">{{ task.name }}</h4>
                <div class="flex gap-0.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="openTagModal(task.id)" class="p-1 sm:p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                    <TagIcon :size="12" class="sm:w-[14px] sm:h-[14px]" />
                  </button>
                  <button @click.stop="openEditModal(task)" class="p-1 sm:p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Pencil :size="12" class="sm:w-[14px] sm:h-[14px]" />
                  </button>
                  <button @click.stop="archiveTask(task.id)" class="p-1 sm:p-1.5 text-slate-400 hover:text-amber-600 transition-colors" title="Arsipkan">
                    <Archive :size="12" class="sm:w-[14px] sm:h-[14px]" />
                  </button>
                  <button @click.stop="deleteTask(task.id)" class="p-1 sm:p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 :size="12" class="sm:w-[14px] sm:h-[14px]" />
                  </button>
                </div>
              </div>

              <p v-if="task.description" class="text-[10px] sm:text-[11px] lg:text-xs text-slate-500 mt-1 sm:mt-1.5 lg:mt-2 line-clamp-2 font-medium leading-relaxed">
                {{ task.description }}
              </p>

              <!-- Timer Display for DOING tasks -->
              <div v-if="column.status === 'DOING' && task.durationMinutes && task.startedAt" class="mt-2 sm:mt-2.5">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-1">
                    <Timer :size="10" class="sm:w-3 sm:h-3" :class="isTaskExpired(task.id) ? 'text-red-500' : 'text-amber-500'" />
                    <span class="text-[9px] sm:text-[10px] font-bold" :class="isTaskExpired(task.id) ? 'text-red-600' : 'text-amber-600'">
                      {{ getTaskTimeLeft(task.id) }}
                    </span>
                  </div>
                  <span class="text-[8px] sm:text-[9px] text-slate-400">{{ task.durationMinutes }}m</span>
                </div>
                <!-- Progress Bar -->
                <div class="h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-1000 rounded-full" :class="isTaskExpired(task.id) ? 'bg-red-500' : 'bg-amber-400'" :style="{ width: `${Math.min(100, getTaskProgress(task))}%` }"></div>
                </div>
              </div>

              <!-- Duration Badge for non-DOING tasks with duration -->
              <div v-else-if="task.durationMinutes" class="mt-2 sm:mt-2.5">
                <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] sm:text-[9px] font-medium">
                  <Timer :size="8" class="sm:w-[10px] sm:h-[10px]" />
                  {{ task.durationMinutes }}m
                </span>
              </div>

              <!-- Task Tags -->
              <div v-if="getTaskTags(task.id).length" class="mt-2 sm:mt-2.5 lg:mt-3 flex flex-wrap gap-1 sm:gap-1.5">
                <span v-for="tag in getTaskTags(task.id)" :key="tag.id" class="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] lg:text-[11px] font-bold text-white shadow-sm" :style="{ backgroundColor: tag.color || '#3B82F6' }">
                  {{ tag.name }}
                </span>
              </div>

              <!-- Task Footer -->
              <div class="mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-2.5 lg:pt-3 border-t border-slate-50 flex items-center justify-between">
                <div class="flex items-center gap-1 sm:gap-1.5 text-slate-300">
                  <GripVertical :size="10" class="sm:w-3 sm:h-3" />
                  <span class="text-[8px] sm:text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-400">Task-{{ task.id }}</span>
                </div>
                <div class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                  <MoreVertical :size="8" class="sm:w-[10px] sm:h-[10px] lg:w-3 lg:h-3 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddModal || showEditModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="showAddModal ? closeAddModal() : closeEditModal()"></div>
          <div class="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-md overflow-hidden border border-slate-200 max-h-[90vh] sm:max-h-none" @click.stop>
            <div class="px-5 sm:px-8 py-5 sm:py-6 overflow-y-auto">
              <!-- Modal Header -->
              <h2 class="text-lg sm:text-xl font-black text-slate-900 mb-1">
                {{ showAddModal ? "Buat Tugas Baru" : "Edit Tugas" }}
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6 font-medium">
                {{ showAddModal ? `Menambahkan ke kolom ${addToStatus}` : "Perbarui detail tugas Anda" }}
              </p>

              <!-- Form -->
              <form @submit.prevent="showAddModal ? createTask() : updateTask()" class="space-y-4 sm:space-y-5">
                <div>
                  <label class="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1.5 sm:mb-2">Nama Tugas</label>
                  <input
                    v-model="newTaskName"
                    type="text"
                    required
                    :disabled="isSubmitting"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Contoh: Desain Landing Page"
                  />
                </div>
                <div>
                  <label class="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1.5 sm:mb-2">Deskripsi (Opsional)</label>
                  <textarea
                    v-model="newTaskDescription"
                    rows="3"
                    :disabled="isSubmitting"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800 text-sm sm:text-base resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Jelaskan detail tugas ini..."
                  ></textarea>
                </div>

                <!-- Duration Selector -->
                <div>
                  <label class="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1.5 sm:mb-2">
                    <Timer :size="10" class="inline mr-1" />
                    Durasi (Opsional)
                  </label>
                  <div class="flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                      v-for="opt in durationOptions"
                      :key="opt.value"
                      type="button"
                      @click="newTaskDuration = newTaskDuration === opt.value ? null : opt.value"
                      :disabled="isSubmitting"
                      class="px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl border transition-all"
                      :class="newTaskDuration === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                  <p v-if="newTaskDuration" class="mt-2 text-[10px] sm:text-xs text-indigo-600 font-medium">⏱️ Timer akan dimulai saat tugas dipindah ke "Proses"</p>
                </div>

                <!-- Buttons -->
                <div class="flex gap-2 sm:gap-3 pt-3 sm:pt-4 pb-2 sm:pb-0">
                  <button
                    type="button"
                    @click="showAddModal ? closeAddModal() : closeEditModal()"
                    :disabled="isSubmitting"
                    class="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl sm:rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    <svg v-if="isSubmitting" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ isSubmitting ? "Menyimpan..." : showAddModal ? "Simpan Tugas" : "Perbarui" }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Archive Modal -->
      <Transition name="modal">
        <div v-if="showArchiveModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" @click="closeArchiveModal">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg overflow-hidden border border-slate-200 max-h-[85vh] sm:max-h-[80vh]" @click.stop>
            <div class="px-5 sm:px-8 py-5 sm:py-6">
              <!-- Modal Header -->
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Archive :size="20" class="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 class="text-lg sm:text-xl font-black text-slate-900">Tugas Terarsip</h2>
                    <p class="text-xs sm:text-sm text-slate-500 font-medium">{{ archivedTasks.length }} tugas diarsipkan</p>
                  </div>
                </div>
                <button @click="closeArchiveModal" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <X :size="20" class="sm:w-6 sm:h-6" />
                </button>
              </div>

              <!-- Archived Tasks List -->
              <div class="overflow-y-auto max-h-[60vh] space-y-2 sm:space-y-3">
                <div v-if="archivedTasks.length === 0" class="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                  <Archive class="mx-auto text-slate-200 mb-2 w-8 h-8" />
                  <p class="text-xs text-slate-400 font-medium">Belum ada tugas yang diarsipkan.</p>
                </div>

                <div v-for="task in archivedTasks" :key="task.id" class="flex items-center justify-between p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-700 text-sm truncate">{{ task.name }}</h4>
                    <p v-if="task.description" class="text-xs text-slate-500 truncate mt-0.5">{{ task.description }}</p>
                  </div>
                  <div class="flex items-center gap-1 ml-3">
                    <button @click="unarchiveTask(task.id)" class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Kembalikan">
                      <ArchiveRestore :size="16" />
                    </button>
                    <button @click="deleteTask(task.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus permanen">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Tag Modal -->
      <Transition name="modal">
        <div v-if="showTagModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" @click="closeTagModal">
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div class="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg overflow-hidden border border-slate-200 max-h-[85vh] sm:max-h-[80vh]" @click.stop>
            <div class="px-5 sm:px-8 py-5 sm:py-6 overflow-y-auto max-h-[85vh] sm:max-h-[80vh]">
              <!-- Modal Header -->
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h2 class="text-lg sm:text-xl font-black text-slate-900">Kelola Tag</h2>
                  <p class="text-xs sm:text-sm text-slate-500 font-medium">Task ID: {{ selectedTaskId }}</p>
                </div>
                <button @click="closeTagModal" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- HandleTags Component -->
              <HandleTags :user-id="userId" :task-id="selectedTaskId" @tags-updated="onTagsUpdated" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.modal-leave-active {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
