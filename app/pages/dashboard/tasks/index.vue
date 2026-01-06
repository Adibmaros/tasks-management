<script setup>
import { Tags, X } from "lucide-vue-next";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { user } = useUserSession();

const userId = computed(() => user.value?.id);
const showTagsModal = ref(false);

const openTagsModal = () => {
  showTagsModal.value = true;
  // Mencegah scroll pada body saat modal buka
  document.body.style.overflow = "hidden";
};

const closeTagsModal = () => {
  showTagsModal.value = false;
  // Mengembalikan scroll body
  document.body.style.overflow = "auto";
};
</script>

<template>
  <div class="w-full min-h-screen bg-slate-50/50">
    <div v-if="userId" class="px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Ruang Kerja</h1>
          <p class="text-xs sm:text-sm text-slate-500">Kelola tugas dan tag Anda secara efisien.</p>
        </div>

        <button
          @click="openTagsModal"
          class="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl sm:rounded-2xl hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 transition-all active:scale-95 group"
        >
          <Tags :size="16" class="sm:w-[18px] sm:h-[18px] group-hover:rotate-12 transition-transform duration-300" />
          <span>Kelola Tags</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[60vh]">
        <DraggableList :user-id="Number(userId)" />
      </div>
    </div>

    <div v-else class="fixed inset-0 flex flex-col items-center justify-center bg-white z-[200] px-4">
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-100 rounded-full"></div>
        <div class="absolute w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
        <Tags :size="20" class="sm:w-6 sm:h-6 text-indigo-600 animate-pulse" />
      </div>
      <p class="mt-4 sm:mt-6 text-slate-500 font-bold tracking-wide text-sm sm:text-base">Menyiapkan ruang kerja...</p>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showTagsModal" class="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm" @click="closeTagsModal" />
      </Transition>

      <Transition name="modal">
        <div v-if="showTagsModal && userId" class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          <div class="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-[2.5rem] shadow-2xl pointer-events-auto max-h-[85vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-white/20" @click.stop>
            <div class="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 shrink-0">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                  <Tags :size="20" class="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-black text-slate-900 leading-none mb-0.5 sm:mb-1">Kelola Tags</h2>
                  <p class="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-tighter">Personalisasi Label Anda</p>
                </div>
              </div>
              <button @click="closeTagsModal" class="p-2 sm:p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl sm:rounded-2xl transition-all active:scale-90">
                <X :size="20" class="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
              <HandleTags :user-id="Number(userId)" />
            </div>

            <div class="p-3 sm:p-4 bg-slate-50/50 border-t border-slate-100 text-center sm:hidden shrink-0">
              <div class="w-10 sm:w-12 h-1 bg-slate-300 rounded-full mx-auto mb-1 sm:mb-2"></div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Scrollbar Custom */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Backdrop Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal Animation (Slide up on Mobile, Scale on Desktop) */
.modal-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 640px) {
  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(100%);
  }
}

@media (min-width: 641px) {
  .modal-enter-from,
  .modal-leave-to {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
}
</style>
