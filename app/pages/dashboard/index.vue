<script setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard", // Menggunakan layout dashboard
});

const { user } = useUserSession();
</script>

<template>
  <div v-if="user" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
    <!-- Welcome Section -->
    <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Selamat datang, {{ user.name }}! 👋</h1>
      <p class="text-xs sm:text-sm lg:text-base text-slate-600 mb-4 sm:mb-6">Kelola tugas dan proyek Anda dengan mudah.</p>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 lg:mt-8">
        <!-- Card 1: Total Tugas -->
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-indigo-200">
          <h3 class="text-xs sm:text-sm font-semibold text-indigo-900 mb-0.5 sm:mb-1">Total Tugas</h3>
          <p class="text-2xl sm:text-3xl font-bold text-indigo-600">24</p>
          <p class="text-[10px] sm:text-xs text-indigo-600 mt-1 sm:mt-2">+3 tugas baru minggu ini</p>
        </div>

        <!-- Card 2: Selesai -->
        <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-emerald-200">
          <h3 class="text-xs sm:text-sm font-semibold text-emerald-900 mb-0.5 sm:mb-1">Selesai</h3>
          <p class="text-2xl sm:text-3xl font-bold text-emerald-600">18</p>
          <p class="text-[10px] sm:text-xs text-emerald-600 mt-1 sm:mt-2">75% completion rate</p>
        </div>

        <!-- Card 3: Dalam Progress -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-amber-200 sm:col-span-2 md:col-span-1">
          <h3 class="text-xs sm:text-sm font-semibold text-amber-900 mb-0.5 sm:mb-1">Dalam Progress</h3>
          <p class="text-2xl sm:text-3xl font-bold text-amber-600">6</p>
          <p class="text-[10px] sm:text-xs text-amber-600 mt-1 sm:mt-2">2 deadline hari ini</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base">+ Buat Tugas Baru</button>
        <NuxtLink to="/dashboard/tasks" class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm sm:text-base text-center">
          Lihat Semua Tugas
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Tasks Section -->
    <div class="mt-4 sm:mt-6 lg:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8">
      <h2 class="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Tugas Terbaru</h2>

      <div class="space-y-2 sm:space-y-3">
        <!-- Task Item 1 -->
        <div class="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors gap-3">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-indigo-600 font-semibold text-sm sm:text-base">📝</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-slate-900 text-sm sm:text-base truncate">Desain UI Dashboard</h3>
              <p class="text-xs sm:text-sm text-slate-500">Deadline: 5 Jan 2025</p>
            </div>
          </div>
          <span class="px-2 sm:px-3 py-1 bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0"> In Progress </span>
        </div>

        <!-- Task Item 2 -->
        <div class="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors gap-3">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-emerald-600 font-semibold text-sm sm:text-base">✅</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-slate-900 text-sm sm:text-base truncate">Review Kode Backend</h3>
              <p class="text-xs sm:text-sm text-slate-500">Deadline: 3 Jan 2025</p>
            </div>
          </div>
          <span class="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0"> Completed </span>
        </div>

        <!-- Task Item 3 -->
        <div class="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors gap-3">
          <div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-red-600 font-semibold text-sm sm:text-base">⚠️</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-semibold text-slate-900 text-sm sm:text-base truncate">Update Dokumentasi API</h3>
              <p class="text-xs sm:text-sm text-slate-500">Deadline: 3 Jan 2025</p>
            </div>
          </div>
          <span class="px-2 sm:px-3 py-1 bg-red-100 text-red-700 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0"> Urgent </span>
        </div>
      </div>
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
