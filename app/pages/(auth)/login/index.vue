<script setup>
import { CheckCircle, Mail, Lock, ArrowLeft, Github, Chrome, Loader2, UserCircle } from "lucide-vue-next";
import { toast } from "vue-sonner";

const { fetch } = useUserSession();

// Meta data untuk Nuxt
definePageMeta({
  layout: false,
  middleware: "auth",
});

const email = ref("");
const password = ref("");
const isLoading = ref(false);

// Demo account credentials
const demoEmail = "coba@gmail.com";
const demoPassword = "coba12345";

const fillDemoCredentials = () => {
  email.value = demoEmail;
  password.value = demoPassword;
  toast.info("Kredensial demo telah diisi!");
};

const handleLogin = async () => {
  // Validasi input
  if (!email.value || !password.value) {
    toast.error("Email dan password harus diisi");
    return;
  }

  isLoading.value = true;

  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    // Toast sukses
    toast.success("Login berhasil! Mengalihkan ke dashboard...", {
      description: `Selamat datang kembali, ${response.name || email.value}!`,
    });

    console.log("Login sukses:", response);

    await fetch(); // Update session dari nuxt-auth-utils

    // Tambahkan sedikit delay agar toast terlihat
    setTimeout(() => {
      navigateTo("/dashboard");
    }, 800);
  } catch (err) {
    console.error("Login error:", err);

    // Toast error dengan pesan yang lebih deskriptif
    const errorMessage = err.data?.statusMessage || "Periksa kembali email dan password Anda";
    toast.error("Login gagal", {
      description: errorMessage,
    });
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = () => {
  toast.info("Fitur masuk dengan Google belum tersedia.");
};

const handleGithubLogin = () => {
  toast.info("Fitur masuk dengan Github belum tersedia.");
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 font-sans">
    <div class="relative sm:absolute sm:top-8 sm:left-8 mb-6 sm:mb-0">
      <NuxtLink to="/" class="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm sm:text-base">
        <ArrowLeft :size="18" class="sm:w-5 sm:h-5" />
        Kembali ke Beranda
      </NuxtLink>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="flex justify-center items-center gap-2 mb-4 sm:mb-6">
        <CheckCircle class="text-indigo-600 w-8 h-8 sm:w-10 sm:h-10" />
        <span class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">TaskFlow</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Selamat datang kembali</h2>
      <p class="mt-2 text-xs sm:text-sm text-slate-600">Masuk untuk mengelola tugas dan tim Anda</p>
    </div>

    <div class="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 rounded-2xl sm:rounded-3xl border border-slate-100 sm:py-10 sm:px-12">
        <!-- Demo Account Info -->
        <div class="mb-5 sm:mb-6 p-3 sm:p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <div class="flex items-center gap-2 mb-2">
            <UserCircle :size="18" class="text-indigo-600 sm:w-5 sm:h-5" />
            <span class="text-xs sm:text-sm font-semibold text-indigo-700">Akun Percobaan</span>
          </div>
          <div class="text-[11px] sm:text-xs text-indigo-600 space-y-1">
            <p><span class="font-medium">Email:</span> {{ demoEmail }}</p>
            <p><span class="font-medium">Password:</span> {{ demoPassword }}</p>
          </div>
          <button
            type="button"
            @click="fillDemoCredentials"
            :disabled="isLoading"
            class="mt-2 sm:mt-3 w-full py-2 px-3 text-[11px] sm:text-xs font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gunakan Akun Demo
          </button>
        </div>

        <form class="space-y-5 sm:space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-xs sm:text-sm font-semibold text-slate-700">Alamat Email</label>
            <div class="mt-1.5 sm:mt-2 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail :size="16" class="sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                id="email"
                type="email"
                v-model="email"
                :disabled="isLoading"
                placeholder="nama@perusahaan.com"
                class="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between">
              <label for="password" class="block text-xs sm:text-sm font-semibold text-slate-700">Password</label>
              <a href="#" class="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-500">Lupa password?</a>
            </div>
            <div class="mt-1.5 sm:mt-2 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock :size="16" class="sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                v-model="password"
                :disabled="isLoading"
                class="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input id="remember-me" type="checkbox" :disabled="isLoading" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed" />
            <label for="remember-me" class="ml-2 block text-xs sm:text-sm text-slate-600">Ingat perangkat ini</label>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center gap-2 py-3 sm:py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:active:scale-100"
          >
            <Loader2 v-if="isLoading" :size="18" class="animate-spin" />
            {{ isLoading ? "Memproses..." : "Masuk ke Akun" }}
          </button>
        </form>

        <div class="mt-6 sm:mt-8 relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>
          <div class="relative flex justify-center text-xs sm:text-sm">
            <span class="px-2 bg-white text-slate-500">Atau masuk dengan</span>
          </div>
        </div>

        <div class="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          <button
            @click="handleGoogleLogin"
            :disabled="isLoading"
            class="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <Chrome :size="16" class="sm:w-[18px] sm:h-[18px]" /> Google
          </button>
          <button
            @click="handleGithubLogin"
            :disabled="isLoading"
            class="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <Github :size="16" class="sm:w-[18px] sm:h-[18px]" /> Github
          </button>
        </div>

        <p class="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-600">
          Belum punya akun?
          <NuxtLink to="/register" class="font-bold text-indigo-600 hover:text-indigo-500">Daftar sekarang</NuxtLink>
        </p>
      </div>

      <p class="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-slate-400">&copy; 2024 TaskFlow Inc. Keamanan data Anda adalah prioritas kami.</p>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

body {
  font-family: "Plus Jakarta Sans", sans-serif;
}
</style>
