// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  // Jika user belum login dan mencoba akses halaman yang dilindungi
  if (!loggedIn.value && to.path !== "/login" && to.path !== "/register") {
    return navigateTo("/login");
  }

  // Jika user sudah login dan mencoba akses halaman login/register
  if (loggedIn.value && (to.path === "/login" || to.path === "/register")) {
    return navigateTo("/dashboard");
  }
});
