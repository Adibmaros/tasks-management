<script setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { user } = useUserSession();

// DEBUG: Log user data
watchEffect(() => {
  console.log("👤 User session:", user.value);
  console.log("👤 User ID:", user.value?.id);
});

const userId = computed(() => user.value?.id);
</script>

<template>
  <div class="w-full">
    <!-- DEBUG: Tampilkan userId -->
    <div class="p-2 bg-yellow-100 text-yellow-800 text-xs mb-2">DEBUG - userId: {{ userId }} | user: {{ user }}</div>

    <DraggableList v-if="userId" :user-id="Number(userId)" />

    <div v-else class="flex flex-col items-center justify-center py-32">
      <div class="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600"></div>
      <p class="mt-4 text-slate-500 font-medium">Menyiapkan ruang kerja...</p>
    </div>
  </div>
</template>
