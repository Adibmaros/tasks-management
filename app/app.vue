<!-- app.vue -->
<template>
  <div>
    <Toaster
      position="top-right"
      richColors
      :toastOptions="{
        duration: 4000,
        style: {
          borderRadius: '12px',
        },
      }"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { Toaster } from "vue-sonner";
</script>
