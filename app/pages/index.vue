<script setup>
import { CheckCircle, Layout, Users, Zap, ArrowRight, Github, Twitter, Linkedin, Menu, X, Play, Star } from "lucide-vue-next";

const features = [
  {
    title: "Visual Workflow",
    desc: "Atur tugas dengan papan Kanban yang intuitif dan seret-lepas dengan mudah.",
    icon: Layout,
  },
  {
    title: "Team Collaboration",
    desc: "Bekerja bersama tim secara real-time dengan komentar dan berbagi file.",
    icon: Users,
  },
  {
    title: "Otomatisasi Cerdas",
    desc: "Biarkan sistem menangani tugas berulang sehingga Anda fokus pada strategi.",
    icon: Zap,
  },
];

const benefits = ["Real-time notifications", "Advanced Analytics", "Unlimited Projects"];

const mobileMenuOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0, transition: { duration: 600 } }" class="flex items-center gap-2">
            <div class="relative">
              <CheckCircle class="text-indigo-600" :size="32" />
              <div class="absolute inset-0 bg-indigo-600/20 blur-lg rounded-full animate-pulse"></div>
            </div>
            <span class="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">TaskFlow</span>
          </div>

          <div v-motion :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }" class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#features"
              class="relative hover:text-indigo-600 transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-600 after:to-violet-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >Fitur</a
            >
            <a
              href="#"
              class="relative hover:text-indigo-600 transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-600 after:to-violet-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >Solusi</a
            >
            <a
              href="#"
              class="relative hover:text-indigo-600 transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-600 after:to-violet-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >Harga</a
            >
          </div>

          <div v-motion :initial="{ opacity: 0, x: 20 }" :enter="{ opacity: 1, x: 0, transition: { duration: 600 } }" class="flex items-center gap-4">
            <NuxtLink to="/login" class="hidden sm:block text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors duration-300">Masuk</NuxtLink>
            <NuxtLink
              to="/register"
              class="relative bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 overflow-hidden group"
            >
              <span class="relative z-10">Daftar Gratis</span>
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NuxtLink>
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-slate-600 hover:text-indigo-600 transition-colors p-2">
              <Menu v-if="!mobileMenuOpen" :size="24" />
              <X v-else :size="24" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="mobileMenuOpen" class="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 py-6 space-y-4">
          <a href="#features" class="block text-slate-600 hover:text-indigo-600 font-medium transition-colors">Fitur</a>
          <a href="#" class="block text-slate-600 hover:text-indigo-600 font-medium transition-colors">Solusi</a>
          <a href="#" class="block text-slate-600 hover:text-indigo-600 font-medium transition-colors">Harga</a>
          <NuxtLink to="/login" class="block text-slate-600 hover:text-indigo-600 font-medium transition-colors">Masuk</NuxtLink>
        </div>
      </Transition>
    </nav>

    <!-- Hero Section -->
    <header class="pt-32 pb-16 lg:pt-48 lg:pb-32 px-4 relative">
      <!-- Background Effects -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-blob"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
        <div class="text-left">
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-indigo-100/50 shadow-sm"
          >
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Update: Realtime Collaboration Telah Tersedia!
          </div>

          <h1 v-motion :initial="{ opacity: 0, y: 30 }" :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700, delay: 100 } }" class="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Kelola Proyek <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 animate-gradient-x">Tanpa Pusing.</span>
          </h1>

          <p v-motion :initial="{ opacity: 0, y: 30 }" :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700, delay: 200 } }" class="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
            Platform manajemen tugas all-in-one yang dirancang untuk meningkatkan produktivitas tim Anda hingga <span class="font-semibold text-indigo-600">40%</span> dalam sebulan pertama.
          </p>

          <div v-motion :initial="{ opacity: 0, y: 30 }" :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 700, delay: 300 } }" class="flex flex-wrap gap-4 mb-8">
            <NuxtLink
              to="/register"
              class="relative bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 group transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/20 hover:-translate-y-1 overflow-hidden"
            >
              <span class="relative z-10 flex items-center gap-2"> Mulai Sekarang <ArrowRight class="group-hover:translate-x-1 transition-transform duration-300" :size="20" /> </span>
              <div class="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NuxtLink>
            <button class="bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center gap-2 group">
              <Play class="text-indigo-600 group-hover:scale-110 transition-transform" :size="20" />
              Lihat Demo
            </button>
          </div>

          <!-- Trust Badges -->
          <div v-motion :initial="{ opacity: 0 }" :visibleOnce="{ opacity: 1, transition: { duration: 700, delay: 500 } }" class="flex items-center gap-6 text-sm text-slate-500">
            <div class="flex items-center gap-1">
              <div class="flex -space-x-2">
                <img v-for="i in 4" :key="i" :src="`https://i.pravatar.cc/32?img=${i + 10}`" class="w-8 h-8 rounded-full border-2 border-white" />
              </div>
              <span class="ml-2 font-medium">2,000+ users</span>
            </div>
            <div class="flex items-center gap-1">
              <Star class="text-yellow-400 fill-yellow-400" :size="16" />
              <span class="font-medium">4.9/5</span>
            </div>
          </div>
        </div>

        <!-- Hero Image -->
        <div v-motion :initial="{ opacity: 0, scale: 0.9, x: 50 }" :visibleOnce="{ opacity: 1, scale: 1, x: 0, transition: { duration: 800, delay: 200 } }" class="relative">
          <div class="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse-slow"></div>
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
            alt="TaskFlow Dashboard"
            class="relative rounded-2xl shadow-2xl border border-slate-200/50 object-cover w-full h-auto hover:shadow-indigo-200/50 transition-all duration-500 hover:scale-[1.02]"
          />

          <!-- Floating Card 1 -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 20, x: -20 }"
            :visibleOnce="{ opacity: 1, y: 0, x: 0, transition: { duration: 600, delay: 600 } }"
            class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 animate-float"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle class="text-white" :size="24" />
              </div>
              <div>
                <p class="text-lg font-bold">12 Tasks</p>
                <p class="text-xs text-slate-500">Completed today</p>
              </div>
            </div>
          </div>

          <!-- Floating Card 2 -->
          <div
            v-motion
            :initial="{ opacity: 0, y: -20, x: 20 }"
            :visibleOnce="{ opacity: 1, y: 0, x: 0, transition: { duration: 600, delay: 800 } }"
            class="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 animate-float-delayed"
          >
            <div class="flex items-center gap-3">
              <div class="flex -space-x-2">
                <div class="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full border-2 border-white"></div>
                <div class="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full border-2 border-white"></div>
                <div class="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 border-white"></div>
              </div>
              <span class="text-sm font-medium text-slate-600">+5 online</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-gradient-to-b from-slate-50 to-white relative">
      <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>

      <div class="max-w-7xl mx-auto px-4 relative">
        <div v-motion :initial="{ opacity: 0, y: 30 }" :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600 } }" class="text-center max-w-3xl mx-auto mb-20">
          <span class="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">Fitur Unggulan</span>
          <h2 class="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">Dibuat untuk Kecepatan Tim</h2>
          <p class="text-slate-600 text-lg">Semua fitur yang Anda butuhkan untuk mengatur alur kerja modern tanpa hambatan teknis.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(f, index) in features"
            :key="f.title"
            v-motion
            :initial="{ opacity: 0, y: 40 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 150 } }"
            class="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden"
          >
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-violet-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2"></div>

            <div
              class="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-indigo-500/0 group-hover:shadow-indigo-500/25"
            >
              <component :is="f.icon" :size="28" />
            </div>
            <h3 class="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors">{{ f.title }}</h3>
            <p class="text-slate-600 leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-24 px-4 relative overflow-hidden">
      <div class="absolute top-1/2 left-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        <div v-motion :initial="{ opacity: 0, x: -50 }" :visibleOnce="{ opacity: 1, x: 0, transition: { duration: 700 } }" class="lg:w-1/2 order-2 lg:order-1">
          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-tr from-indigo-200/30 to-violet-200/30 rounded-3xl blur-2xl"></div>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="Team Working" class="relative rounded-3xl shadow-2xl hover:shadow-indigo-200/50 transition-all duration-500 hover:scale-[1.02]" />
          </div>
        </div>

        <div v-motion :initial="{ opacity: 0, x: 50 }" :visibleOnce="{ opacity: 1, x: 0, transition: { duration: 700 } }" class="lg:w-1/2 order-1 lg:order-2">
          <span class="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">Mengapa TaskFlow?</span>
          <h2 class="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">Berhenti menggunakan spreadsheet yang membingungkan.</h2>
          <p class="text-slate-600 text-lg mb-8 leading-relaxed">Ubah cara tim Anda bekerja dengan satu sumber kebenaran. Pantau progres, tenggat waktu, dan beban kerja dalam satu layar.</p>
          <ul class="space-y-4">
            <li
              v-for="(item, index) in benefits"
              :key="item"
              v-motion
              :initial="{ opacity: 0, x: 20 }"
              :visibleOnce="{ opacity: 1, x: 0, transition: { duration: 500, delay: index * 100 } }"
              class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors duration-300 group"
            >
              <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                <CheckCircle class="text-emerald-600 group-hover:text-white transition-colors duration-300" :size="20" />
              </div>
              <span class="font-medium text-slate-700">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4">
      <div
        v-motion
        :initial="{ opacity: 0, y: 40, scale: 0.95 }"
        :visibleOnce="{ opacity: 1, y: 0, scale: 1, transition: { duration: 700 } }"
        class="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden"
      >
        <!-- Decorative Elements -->
        <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>

        <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 relative z-10">Siap Naik Level?</h2>
        <p class="text-indigo-100 text-lg mb-10 max-w-xl mx-auto relative z-10">Daftar sekarang dan nikmati masa percobaan pro selama 14 hari. Tanpa kartu kredit.</p>
        <NuxtLink
          to="/register"
          class="inline-flex items-center gap-2 bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1 relative z-10 group"
        >
          Buat Akun Sekarang
          <ArrowRight class="group-hover:translate-x-1 transition-transform duration-300" :size="20" />
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-50 pt-24 pb-12 border-t border-slate-100">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <CheckCircle class="text-indigo-600" :size="24" />
            <span class="font-bold text-xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">TaskFlow</span>
          </div>
          <p class="text-slate-500 text-sm leading-relaxed mb-6">Membangun masa depan kerja tim yang lebih produktif dan bahagia.</p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
              <Github :size="18" />
            </a>
            <a href="#" class="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
              <Twitter :size="18" />
            </a>
            <a href="#" class="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
              <Linkedin :size="18" />
            </a>
          </div>
        </div>
        <div>
          <h4 class="font-bold mb-6 text-slate-900">Produk</h4>
          <div class="flex flex-col gap-4 text-sm text-slate-500">
            <a href="#" class="hover:text-indigo-600 hover:translate-x-1 transition-all duration-300">Fitur Utama</a>
            <a href="#" class="hover:text-indigo-600 hover:translate-x-1 transition-all duration-300">Integrasi</a>
            <a href="#" class="hover:text-indigo-600 hover:translate-x-1 transition-all duration-300">Update Baru</a>
          </div>
        </div>
        <div>
          <h4 class="font-bold mb-6 text-slate-900">Perusahaan</h4>
          <div class="flex flex-col gap-4 text-sm text-slate-500">
            <a href="#" class="hover:text-indigo-600 hover:translate-x-1 transition-all duration-300">Tentang Kami</a>
            <a href="#" class="hover:text-indigo-600 hover:translate-x-1 transition-all duration-300">Karir</a>
            <a href="#" class="hover:text-indigo-600 hover:translate-x-1 transition-all duration-300">Kontak</a>
          </div>
        </div>
        <div>
          <h4 class="font-bold mb-6 text-slate-900">Legal</h4>
          <div class="flex flex-col gap-4 text-sm text-slate-500">
            <a href="#" class="hover:text-indigo-600 hover:translate-x-1 transition-all duration-300">Privasi</a>
            <a href="#" class="hover:text-indigo-600 hover:translate-x-1 transition-all duration-300">Ketentuan</a>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>&copy; 2024 TaskFlow Inc. Dibuat dengan ❤️ menggunakan Nuxt 4 & Tailwind.</p>
      </div>
    </footer>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

body {
  font-family: "Plus Jakarta Sans", sans-serif;
}

/* Custom Animations */
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(30px, 10px) scale(1.05);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-blob {
  animation: blob 8s infinite ease-in-out;
}

.animate-float {
  animation: float 3s infinite ease-in-out;
}

.animate-float-delayed {
  animation: float-delayed 4s infinite ease-in-out;
}

.animate-gradient-x {
  background-size: 200% auto;
  animation: gradient-x 3s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
