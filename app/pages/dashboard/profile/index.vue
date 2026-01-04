<script setup>
import { toast } from "vue-sonner";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { user } = useUserSession();

console.log("User Profile Page:", user.value);

// Form change password
const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
});

const isLoading = ref(false);

const handleChangePassword = async () => {
  try {
    const response = await $fetch("/api/auth/change-password", {
      method: "POST",
      body: {
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword,
      },
    });
    toast.success("password berhasil diubah"), (passwordForm.value.oldPassword = ""), (passwordForm.value.newPassword = "");
  } catch (err) {
    toast.error("gagal mengubah password", {
      description: "terjadi kesalahan saat mengubah password",
    });
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengubah password",
    });
  }
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Profile Page</h1>

    <!-- User Info -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">User Information</h2>
      <div class="space-y-2">
        <p><span class="font-medium">ID:</span> {{ user?.id }}</p>
        <p><span class="font-medium">Email:</span> {{ user?.email }}</p>
        <p><span class="font-medium">Name:</span> {{ user?.name }}</p>
      </div>
    </div>

    <!-- Change Password Form -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Change Password</h2>
      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Password Lama</label>
          <input v-model="passwordForm.oldPassword" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan password lama" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Password Baru</label>
          <input v-model="passwordForm.newPassword" type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan password baru" required />
        </div>
        <button type="submit" :disabled="isLoading" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          {{ isLoading ? "Loading..." : "Change Password" }}
        </button>
      </form>
    </div>
  </div>
</template>
