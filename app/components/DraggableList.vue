<script setup lang="ts">
import { Plus, Pencil, Trash2, GripVertical, Layout, MoreVertical, Clock, CheckCircle2, Circle } from "lucide-vue-next";

// 1. Interfaces & Types
interface Task {
  id: number;
  name: string;
  description?: string | null;
  status: "PLAN" | "DOING" | "DONE";
  position: number;
}

const props = defineProps<{
  userId: number;
}>();

// 2. State Management
const tasks = ref<Task[]>([]);
const isLoading = ref(true);
const isDragging = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const addToStatus = ref<"PLAN" | "DOING" | "DONE">("PLAN");
const editingTask = ref<Task | null>(null);
const newTaskName = ref("");
const newTaskDescription = ref("");

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

// 3. Logic & Handlers

const getTasksByStatus = (status: "PLAN" | "DOING" | "DONE") => {
  return tasks.value.filter((task) => task.status === status).sort((a, b) => a.position - b.position);
};

const fetchTasks = async (silent = false) => {
  try {
    if (!silent) isLoading.value = true;

    const data = await $fetch<Task[]>(`/api/tasks/user/${props.userId}`);

    tasks.value = data;
  } catch (error) {
    // Error handling tanpa logging
  } finally {
    if (!silent) isLoading.value = false;
  }
};

const createTask = async () => {
  if (!newTaskName.value.trim()) return;
  setLocalUpdate?.(true);
  try {
    const task = await $fetch<Task>("/api/tasks", {
      method: "POST",
      body: {
        name: newTaskName.value,
        description: newTaskDescription.value || null,
        status: addToStatus.value,
        userId: props.userId,
      },
    });
    tasks.value.push(task);
    closeAddModal();
  } catch (error) {
    // Error handling tanpa logging
  }
};

const updateTask = async () => {
  if (!editingTask.value || !newTaskName.value.trim()) return;
  setLocalUpdate?.(true);
  try {
    const updated = await $fetch<Task>(`/api/tasks/${editingTask.value.id}`, {
      method: "PUT",
      body: {
        name: newTaskName.value,
        description: newTaskDescription.value || null,
      },
    });
    const index = tasks.value.findIndex((t) => t.id === updated.id);
    if (index !== -1) tasks.value[index] = updated;
    closeEditModal();
  } catch (error) {
    // Error handling tanpa logging
  }
};

const deleteTask = async (id: number) => {
  if (!confirm("Hapus tugas ini?")) return;
  setLocalUpdate?.(true);
  try {
    await $fetch<void>(`/api/tasks/${id}`, { method: "DELETE" });
    tasks.value = tasks.value.filter((t) => t.id !== id);
  } catch (error) {
    // Error handling tanpa logging
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

// 4. Modal Control
const openAddModal = (status: "PLAN" | "DOING" | "DONE") => {
  addToStatus.value = status;
  showAddModal.value = true;
};
const closeAddModal = () => {
  showAddModal.value = false;
  newTaskName.value = "";
  newTaskDescription.value = "";
};
const openEditModal = (task: Task) => {
  editingTask.value = task;
  newTaskName.value = task.name;
  newTaskDescription.value = task.description || "";
  showEditModal.value = true;
};
const closeEditModal = () => {
  showEditModal.value = false;
  editingTask.value = null;
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

  const result = subscribe(() => {
    if (!isDragging.value) fetchTasks(true);
  });
  if (result?.setLocalUpdate) setLocalUpdate = result.setLocalUpdate;
});

onUnmounted(() => unsubscribe());
</script>

<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Papan Tugas</h1>
        <p class="text-sm text-slate-500 font-medium">Atur alur kerja Anda dengan drag and drop.</p>
      </div>
      <div class="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
        <button class="px-4 py-2 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-lg flex items-center gap-2"><Layout :size="14" /> Kanban</button>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-indigo-600"></div>
      <p class="mt-4 text-slate-500 text-sm font-semibold italic">Sinkronisasi data...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div v-for="column in columns" :key="column.status" class="flex flex-col bg-slate-100/40 rounded-2xl border border-slate-200/60 p-4 min-h-[650px] transition-all">
        <div class="flex items-center justify-between mb-6 px-1">
          <div class="flex items-center gap-3">
            <component
              :is="column.icon"
              :size="18"
              :class="{
                'text-indigo-500': column.status === 'PLAN',
                'text-amber-500': column.status === 'DOING',
                'text-emerald-500': column.status === 'DONE',
              }"
            />
            <h3 class="font-bold text-slate-700 text-sm uppercase tracking-widest">{{ column.title }}</h3>
            <span class="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-black rounded-md shadow-sm">
              {{ getTasksByStatus(column.status).length }}
            </span>
          </div>
          <button @click="openAddModal(column.status)" class="p-1.5 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200 rounded-lg transition-all shadow-sm">
            <Plus :size="16" />
          </button>
        </div>

        <div
          data-droppable
          class="flex-1 space-y-4 rounded-xl transition-all duration-300"
          :class="{ 'bg-indigo-50/50 ring-2 ring-indigo-300 ring-dashed': dragOverColumn === column.status }"
          @dragover="onDragOver($event, column.status)"
          @dragleave="onDragLeave"
          @drop="onDrop($event, column.status)"
        >
          <div v-if="getTasksByStatus(column.status).length === 0" class="border-2 border-dashed border-slate-200 rounded-2xl py-12 flex flex-col items-center justify-center opacity-40">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tarik tugas ke sini</p>
          </div>

          <div
            v-for="task in getTasksByStatus(column.status)"
            :key="task.id"
            draggable="true"
            @dragstart="onDragStart($event, task.id)"
            @dragend="onDragEnd"
            @dragover="onDragOverTask($event, task.id)"
            class="group bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-indigo-200 transition-all duration-200 relative overflow-hidden"
            :class="{
              'opacity-30 scale-95': draggedTaskId === task.id,
              'ring-2 ring-indigo-500': dragOverTaskId === task.id && draggedTaskId !== task.id,
            }"
          >
            <div
              class="absolute left-0 top-0 bottom-0 w-1.5"
              :class="{
                'bg-indigo-500': column.status === 'PLAN',
                'bg-amber-500': column.status === 'DOING',
                'bg-emerald-500': column.status === 'DONE',
              }"
            ></div>

            <div class="flex items-start justify-between gap-3">
              <h4 class="font-bold text-slate-800 text-[15px] leading-snug flex-1">{{ task.name }}</h4>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click.stop="openEditModal(task)" class="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Pencil :size="14" />
                </button>
                <button @click.stop="deleteTask(task.id)" class="p-1 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>

            <p v-if="task.description" class="text-xs text-slate-500 mt-2 line-clamp-2 font-medium leading-relaxed">
              {{ task.description }}
            </p>

            <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-slate-300">
                <GripVertical :size="12" />
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Task-{{ task.id }}</span>
              </div>
              <div class="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                <MoreVertical :size="12" class="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddModal || showEditModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200" @click.stop>
            <div class="px-8 py-6">
              <h2 class="text-xl font-black text-slate-900 mb-1">
                {{ showAddModal ? "Buat Tugas Baru" : "Edit Tugas" }}
              </h2>
              <p class="text-sm text-slate-500 mb-6 font-medium">
                {{ showAddModal ? `Menambahkan ke kolom ${addToStatus}` : "Perbarui detail tugas Anda" }}
              </p>

              <form @submit.prevent="showAddModal ? createTask() : updateTask()" class="space-y-5">
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nama Tugas</label>
                  <input
                    v-model="newTaskName"
                    type="text"
                    required
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800"
                    placeholder="Contoh: Desain Landing Page"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Deskripsi (Opsional)</label>
                  <textarea
                    v-model="newTaskDescription"
                    rows="4"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-800"
                    placeholder="Jelaskan detail tugas ini..."
                  ></textarea>
                </div>

                <div class="flex gap-3 pt-4">
                  <button type="button" @click="showAddModal ? closeAddModal() : closeEditModal()" class="flex-1 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors">Batal</button>
                  <button type="submit" class="flex-1 px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">
                    {{ showAddModal ? "Simpan Tugas" : "Perbarui" }}
                  </button>
                </div>
              </form>
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
  transform: scale(0.9) translateY(20px);
}

/* Scrollbar Styling for Kanban */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

* {
  font-family: "Plus Jakarta Sans", sans-serif;
}
</style>
