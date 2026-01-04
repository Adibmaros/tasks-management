// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-auth-utils", "vue-sonner/nuxt", "@vueuse/motion/nuxt", "@nuxtjs/supabase"],
  future: {
    compatibilityVersion: 4,
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/**"], // exclude semua route dari redirect otomatis supabase
    },
    clientOptions: {
      db: {
        schema: "public",
      },
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    },
  },
});
