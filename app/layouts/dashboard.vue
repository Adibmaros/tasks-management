<script setup>
import { CheckCircle, LogOut, User, ChevronDown, Settings, HelpCircle } from "lucide-vue-next";
import { toast } from "vue-sonner";

const { user, clear, fetch } = useUserSession();
const isDropdownOpen = ref(false);

const handleClickProyek = () => {
  toast.info("Fitur Proyek sedang dalam pengembangan.", {
    description: "Nantikan pembaruan selanjutnya!",
  });
};

const handleLogout = async () => {
  try {
    await clear();
    await fetch();

    toast.success("Logout berhasil", {
      description: "Sampai jumpa lagi!",
    });

    setTimeout(() => {
      navigateTo("/login");
    }, 500);
  } catch (error) {
    toast.error("Logout gagal", {
      description: "Terjadi kesalahan saat logout",
    });
  }
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Close dropdown when clicking outside
const dropdownRef = ref(null);
onMounted(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  };
  document.addEventListener("click", handleClickOutside);
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});

// Get initials from name
const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo & Brand -->
          <NuxtLink to="/dashboard" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <CheckCircle class="text-indigo-600" :size="32" />
            <span class="text-xl font-bold text-slate-900">TaskFlow</span>
          </NuxtLink>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink to="/dashboard" class="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors" active-class="text-indigo-600 font-semibold"> Dashboard </NuxtLink>
            <NuxtLink to="/dashboard/tasks" class="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors" active-class="text-indigo-600 font-semibold"> Tugas </NuxtLink>
            <button @click="handleClickProyek" class="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors" active-class="text-indigo-600 font-semibold">Proyek</button>
          </div>

          <!-- User Profile Dropdown -->
          <div v-if="user" class="relative" ref="dropdownRef">
            <button @click="toggleDropdown" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <!-- Avatar -->
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {{ getInitials(user.name) }}
              </div>

              <!-- User Info -->
              <div class="hidden sm:block text-left">
                <p class="text-sm font-semibold text-slate-900">{{ user.name }}</p>
                <p class="text-xs text-slate-500 truncate max-w-[150px]">{{ user.email }}</p>
              </div>

              <!-- Dropdown Icon -->
              <ChevronDown :size="18" class="text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" />
            </button>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 overflow-hidden">
                <!-- User Info in Dropdown -->
                <div class="px-4 py-3 border-b border-slate-100">
                  <p class="text-sm font-semibold text-slate-900">{{ user.name }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ user.email }}</p>
                </div>

                <!-- Menu Items -->
                <div class="py-2">
                  <NuxtLink to="/dashboard/profile" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" @click="isDropdownOpen = false">
                    <User :size="18" class="text-slate-400" />
                    Profil Saya
                  </NuxtLink>

                  <NuxtLink to="/dashboard/settings" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" @click="isDropdownOpen = false">
                    <Settings :size="18" class="text-slate-400" />
                    Pengaturan
                  </NuxtLink>

                  <NuxtLink to="/dashboard/help" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" @click="isDropdownOpen = false">
                    <HelpCircle :size="18" class="text-slate-400" />
                    Bantuan
                  </NuxtLink>
                </div>

                <!-- Logout Button -->
                <div class="border-t border-slate-100 pt-2">
                  <button @click="handleLogout" class="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                    <LogOut :size="18" />
                    Keluar
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content - Slot untuk konten halaman -->
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

* {
  font-family: "Plus Jakarta Sans", sans-serif;
}
</style>
