<script setup>
import { CheckCircle, User, Mail, Lock, ArrowLeft, Github, Chrome } from "lucide-vue-next";
import { toast } from "vue-sonner";

definePageMeta({
  layout: false,
});

const name = ref("");
const email = ref("");
const password = ref("");
const acceptTerms = ref(false);
const isLoading = ref(false);

// Validasi email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Handle Register
const handleRegister = async () => {
  // Validasi client-side
  if (!name.value.trim()) {
    toast.error("Nama lengkap harus diisi");
    return;
  }

  if (!email.value.trim()) {
    toast.error("Email harus diisi");
    return;
  }

  if (!isValidEmail(email.value)) {
    toast.error("Format email tidak valid");
    return;
  }

  if (!password.value) {
    toast.error("Password harus diisi");
    return;
  }

  if (password.value.length < 8) {
    toast.error("Password minimal 8 karakter");
    return;
  }

  if (!acceptTerms.value) {
    toast.error("Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi");
    return;
  }

  isLoading.value = true;

  try {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        name: name.value.trim(),
        email: email.value.trim().toLowerCase(),
        password: password.value,
      },
    });

    toast.success("Registrasi berhasil! Silakan login.", {
      description: `Selamat datang, ${response.name}!`,
      duration: 3000,
    });

    // Redirect ke login setelah 1 detik
    setTimeout(() => {
      navigateTo("/login");
    }, 1000);
  } catch (err) {
    console.error("Registration error:", err);

    const errorMessage = err.data?.statusMessage || err.message || "Terjadi kesalahan saat registrasi";

    toast.error("Registrasi Gagal", {
      description: errorMessage,
      duration: 5000,
    });
  } finally {
    isLoading.value = false;
  }
};

// Handle Social Login (placeholder)
const handleGoogleLogin = () => {
  toast.info("Fitur login Google segera hadir!");
};

const handleGithubLogin = () => {
  toast.info("Fitur login Github segera hadir!");
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 font-sans">
    <div class="relative sm:absolute sm:top-8 sm:left-8 mb-6 sm:mb-0">
      <NuxtLink to="/" class="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm sm:text-base">
        <ArrowLeft :size="18" class="sm:w-5 sm:h-5" />
        Kembali
      </NuxtLink>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="flex justify-center items-center gap-2 mb-4 sm:mb-6">
        <CheckCircle class="text-indigo-600 w-8 h-8 sm:w-10 sm:h-10" />
        <span class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">TaskFlow</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Buat akun baru</h2>
      <p class="mt-2 text-xs sm:text-sm text-slate-600">Mulai kelola proyek Anda dengan lebih efisien hari ini.</p>
    </div>

    <div class="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 rounded-2xl sm:rounded-3xl border border-slate-100 sm:py-10 sm:px-12">
        <form class="space-y-4 sm:space-y-5" @submit.prevent="handleRegister">
          <!-- Nama Lengkap -->
          <div>
            <label for="name" class="block text-xs sm:text-sm font-semibold text-slate-700"> Nama Lengkap </label>
            <div class="mt-1 sm:mt-1.5 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User :size="16" class="sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                v-model="name"
                :disabled="isLoading"
                class="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-xs sm:text-sm font-semibold text-slate-700"> Alamat Email </label>
            <div class="mt-1 sm:mt-1.5 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail :size="16" class="sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="nama@perusahaan.com"
                :disabled="isLoading"
                class="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-xs sm:text-sm font-semibold text-slate-700"> Password </label>
            <div class="mt-1 sm:mt-1.5 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock :size="16" class="sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                id="password"
                type="password"
                v-model="password"
                placeholder="Minimal 8 karakter"
                :disabled="isLoading"
                class="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="terms" type="checkbox" v-model="acceptTerms" :disabled="isLoading" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div class="ml-2 sm:ml-3 text-xs sm:text-sm">
              <label for="terms" class="text-slate-600">
                Saya setuju dengan
                <a href="#" class="text-indigo-600 font-medium hover:underline">Ketentuan Layanan</a>
                dan
                <a href="#" class="text-indigo-600 font-medium hover:underline">Kebijakan Privasi</a>.
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center gap-2 py-3 sm:py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="!isLoading">Daftar Sekarang</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mendaftar...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-6 sm:mt-8 relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>
          <div class="relative flex justify-center text-xs sm:text-sm">
            <span class="px-2 bg-white text-slate-500">Atau daftar dengan</span>
          </div>
        </div>

        <!-- Social Login Buttons -->
        <div class="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          <button
            @click="handleGoogleLogin"
            :disabled="isLoading"
            type="button"
            class="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome :size="16" class="sm:w-[18px] sm:h-[18px]" /> Google
          </button>
          <button
            @click="handleGithubLogin"
            :disabled="isLoading"
            type="button"
            class="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github :size="16" class="sm:w-[18px] sm:h-[18px]" /> Github
          </button>
        </div>

        <!-- Login Link -->
        <p class="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-600">
          Sudah punya akun?
          <NuxtLink to="/login" class="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"> Masuk di sini </NuxtLink>
        </p>
      </div>

      <p class="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">Ditenagai oleh TaskFlow Security</p>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

body {
  font-family: "Plus Jakarta Sans", sans-serif;
}
</style>
