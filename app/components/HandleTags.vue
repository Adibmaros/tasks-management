<script setup>
import { Tags, Plus, X, Pencil, Trash2, Check, Loader2 } from "lucide-vue-next";

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  taskId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["tagsUpdated"]);

// --- STATE MANAGEMENT ---
const allTags = ref([]); // Semua tag milik user
const taskTags = ref([]); // Tag yang nempel di task ini
const pending = ref(true); // Loading fetching awal
const isActionLoading = ref(false); // Loading untuk tombol CRUD
const editingTag = ref(null);
const newTag = ref({ name: "", color: "#3B82F6" });

const colors = ["#EF4444", "#F97316", "#EAB308", "#84CC16", "#22C55E", "#14B8A6", "#3B82F6", "#8B5CF6", "#EC4899"];

// --- FETCH LOGIC ---
async function loadData() {
  pending.value = true;
  try {
    // Jalankan fetch secara paralel untuk efisiensi
    const [allTagsRes, taskTagsRes] = await Promise.all([$fetch(`/api/tags/user/${props.userId}`), props.taskId ? $fetch(`/api/task-tags?taskId=${props.taskId}`) : Promise.resolve([])]);

    allTags.value = allTagsRes || [];
    taskTags.value = taskTagsRes || [];
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    pending.value = false;
  }
}

// Cek apakah tag sudah ada di task ini
const isTagAssigned = (tagId) => taskTags.value.some((t) => t.id === tagId);

// --- TASK-TAG ASSIGNMENT ---
async function toggleTagAssignment(tag) {
  if (!props.taskId) return;
  isActionLoading.value = true;

  const assigned = isTagAssigned(tag.id);
  try {
    if (assigned) {
      // DELETE sesuai handler: /api/task-tags?taskId=X&tagId=Y
      await $fetch(`/api/task-tags?taskId=${props.taskId}&tagId=${tag.id}`, { method: "DELETE" });
    } else {
      // POST sesuai handler: body { taskId, tagId }
      await $fetch("/api/task-tags", {
        method: "POST",
        body: { taskId: props.taskId, tagId: tag.id },
      });
    }
    // Refresh hanya data task-tags
    taskTags.value = await $fetch(`/api/task-tags?taskId=${props.taskId}`);
    emit("tagsUpdated");
  } catch (e) {
    console.error("Assignment error:", e);
  } finally {
    isActionLoading.value = false;
  }
}

// --- CRUD TAGS ---
async function createTag() {
  if (!newTag.value.name.trim()) return;
  isActionLoading.value = true;
  try {
    await $fetch("/api/tags", {
      method: "POST",
      body: { ...newTag.value, userId: props.userId },
    });
    newTag.value = { name: "", color: "#3B82F6" };
    await loadData();
  } finally {
    isActionLoading.value = false;
  }
}

async function updateTag() {
  if (!editingTag.value?.name.trim()) return;
  isActionLoading.value = true;
  try {
    await $fetch(`/api/tags/${editingTag.value.id}`, {
      method: "PUT",
      body: { name: editingTag.value.name, color: editingTag.value.color },
    });
    editingTag.value = null;
    await loadData();
    emit("tagsUpdated");
  } finally {
    isActionLoading.value = false;
  }
}

async function deleteTag(id) {
  if (!confirm("Hapus tag ini? Ini akan menghapus tag dari semua tugas.")) return;
  isActionLoading.value = true;
  try {
    await $fetch(`/api/tags/${id}`, { method: "DELETE" });
    await loadData();
    emit("tagsUpdated");
  } finally {
    isActionLoading.value = false;
  }
}

// --- LIFECYCLE ---
onMounted(() => loadData());

// Watch jika taskId berubah (misal pindah antar modal task)
watch(
  () => props.taskId,
  () => loadData()
);
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <div v-if="pending" class="space-y-3 sm:space-y-4 animate-pulse">
      <div class="h-20 sm:h-24 bg-slate-100 rounded-xl sm:rounded-2xl"></div>
      <div class="space-y-2">
        <div v-for="i in 3" :key="i" class="h-10 sm:h-12 bg-slate-50 rounded-lg sm:rounded-xl"></div>
      </div>
    </div>

    <div v-else class="space-y-4 sm:space-y-6">
      <div v-if="taskId" class="p-3 sm:p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl sm:rounded-2xl">
        <h3 class="text-[10px] sm:text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2"><Check :size="12" class="sm:w-[14px] sm:h-[14px]" /> Tag di Tugas Ini</h3>
        <div class="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            v-for="tag in allTags"
            :key="tag.id"
            @click="toggleTagAssignment(tag)"
            :disabled="isActionLoading"
            class="group relative px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shadow-sm"
            :class="isTagAssigned(tag.id) ? 'text-white translate-y-[-2px]' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-300'"
            :style="isTagAssigned(tag.id) ? { backgroundColor: tag.color } : {}"
          >
            <span v-if="isTagAssigned(tag.id)" class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></span>
            {{ tag.name }}
          </button>
          <p v-if="!allTags.length" class="text-[10px] sm:text-xs text-slate-400 italic">Belum ada pilihan tag.</p>
        </div>
      </div>

      <div class="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm space-y-3 sm:space-y-4">
        <div class="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
          <div class="w-1 sm:w-1.5 h-3 sm:h-4 bg-indigo-500 rounded-full"></div>
          <h3 class="text-xs sm:text-sm font-bold text-slate-700">Buat Tag Master</h3>
        </div>

        <div class="space-y-2 sm:space-y-3">
          <input
            v-model="newTag.name"
            type="text"
            placeholder="Nama tag..."
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xs sm:text-sm font-medium"
            @keyup.enter="createTag"
          />

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div class="flex flex-wrap gap-1 sm:gap-1.5">
              <button
                v-for="c in colors"
                :key="c"
                class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-transform hover:scale-110"
                :class="newTag.color === c ? 'border-slate-800' : 'border-transparent'"
                :style="{ backgroundColor: c }"
                @click="newTag.color = c"
              ></button>
            </div>

            <button
              @click="createTag"
              :disabled="isActionLoading || !newTag.name.trim()"
              class="w-full sm:w-auto px-3 sm:px-4 py-2 bg-indigo-600 text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50"
            >
              <Loader2 v-if="isActionLoading" class="animate-spin w-3 h-3 sm:w-[14px] sm:h-[14px]" />
              <Plus v-else :size="12" class="sm:w-[14px] sm:h-[14px]" />
              Tambah
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-2 sm:space-y-3">
        <h3 class="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1">Manajemen Semua Tag</h3>

        <div v-if="allTags.length" class="grid gap-1.5 sm:gap-2">
          <div v-for="tag in allTags" :key="tag.id" class="group flex items-center justify-between p-2.5 sm:p-3 bg-white border border-slate-200 rounded-lg sm:rounded-xl hover:border-indigo-200 transition-all">
            <div v-if="editingTag?.id === tag.id" class="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input v-model="editingTag.name" class="flex-1 px-2 py-1 border rounded text-xs sm:text-sm" />
              <div class="flex items-center justify-between sm:justify-start gap-1">
                <div class="flex gap-0.5 sm:gap-1">
                  <button v-for="c in colors" :key="c" class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full" :style="{ backgroundColor: c }" @click="editingTag.color = c"></button>
                </div>
                <div class="flex gap-0.5">
                  <button @click="updateTag" class="text-emerald-500 p-1"><Check :size="16" class="sm:w-[18px] sm:h-[18px]" /></button>
                  <button @click="editingTag = null" class="text-slate-400 p-1"><X :size="16" class="sm:w-[18px] sm:h-[18px]" /></button>
                </div>
              </div>
            </div>

            <template v-else>
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-inner" :style="{ backgroundColor: tag.color }"></div>
                <span class="text-xs sm:text-sm font-bold text-slate-700">{{ tag.name }}</span>
              </div>
              <div class="flex gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="editingTag = { ...tag }" class="p-1 sm:p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-md sm:rounded-lg transition-all">
                  <Pencil :size="12" class="sm:w-[14px] sm:h-[14px]" />
                </button>
                <button @click="deleteTag(tag.id)" class="p-1 sm:p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md sm:rounded-lg transition-all">
                  <Trash2 :size="12" class="sm:w-[14px] sm:h-[14px]" />
                </button>
              </div>
            </template>
          </div>
        </div>

        <div v-else class="text-center py-8 sm:py-10 border-2 border-dashed border-slate-100 rounded-xl sm:rounded-2xl">
          <Tags class="mx-auto text-slate-200 mb-2 w-6 h-6 sm:w-8 sm:h-8" />
          <p class="text-[10px] sm:text-xs text-slate-400 font-medium">Belum ada tag dibuat.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
