<script setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { user } = useUserSession();
</script>

<template>
  <div v-if="user" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
    <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Selamat datang, {{ user.name }}! 👋</h1>
      <p class="text-xs sm:text-sm lg:text-base text-slate-600 mb-6 sm:mb-8">Kelola tugas dan proyek Anda dengan mudah.</p>

      <NuxtLink to="/dashboard/tasks" class="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base">
        <span>📋</span>
        Lihat Semua Tugas
      </NuxtLink>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-indigo-600 border-t-transparent"></div>
      <p class="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">Memuat data...</p>
    </div>
  </div>
</template>
