<script setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard", // Menggunakan layout dashboard
});

const { user } = useUserSession();
</script>

<template>
  <div v-if="user" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Welcome Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Selamat datang, {{ user.name }}! 👋</h1>
      <p class="text-slate-600 mb-6">Kelola tugas dan proyek Anda dengan mudah.</p>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <!-- Card 1: Total Tugas -->
        <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
          <h3 class="text-sm font-semibold text-indigo-900 mb-1">Total Tugas</h3>
          <p class="text-3xl font-bold text-indigo-600">24</p>
          <p class="text-xs text-indigo-600 mt-2">+3 tugas baru minggu ini</p>
        </div>

        <!-- Card 2: Selesai -->
        <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
          <h3 class="text-sm font-semibold text-emerald-900 mb-1">Selesai</h3>
          <p class="text-3xl font-bold text-emerald-600">18</p>
          <p class="text-xs text-emerald-600 mt-2">75% completion rate</p>
        </div>

        <!-- Card 3: Dalam Progress -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
          <h3 class="text-sm font-semibold text-amber-900 mb-1">Dalam Progress</h3>
          <p class="text-3xl font-bold text-amber-600">6</p>
          <p class="text-xs text-amber-600 mt-2">2 deadline hari ini</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8 flex flex-wrap gap-3">
        <button class="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">+ Buat Tugas Baru</button>
        <NuxtLink to="/dashboard/tasks" class="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"> Lihat Semua Tugas </NuxtLink>
      </div>
    </div>

    <!-- Recent Tasks Section -->
    <div class="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 class="text-xl font-bold text-slate-900 mb-4">Tugas Terbaru</h2>

      <div class="space-y-3">
        <!-- Task Item 1 -->
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span class="text-indigo-600 font-semibold">📝</span>
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">Desain UI Dashboard</h3>
              <p class="text-sm text-slate-500">Deadline: 5 Jan 2025</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full"> In Progress </span>
        </div>

        <!-- Task Item 2 -->
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span class="text-emerald-600 font-semibold">✅</span>
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">Review Kode Backend</h3>
              <p class="text-sm text-slate-500">Deadline: 3 Jan 2025</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full"> Completed </span>
        </div>

        <!-- Task Item 3 -->
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span class="text-red-600 font-semibold">⚠️</span>
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">Update Dokumentasi API</h3>
              <p class="text-sm text-slate-500">Deadline: 3 Jan 2025</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full"> Urgent </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      <p class="mt-4 text-slate-600">Memuat data...</p>
    </div>
  </div>
</template>
