import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Login from '@/views/LoginView.vue'
import Register from '@/views/RegisterView.vue'
import MapView from '@/views/MapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: AuthLayout, // Wrap Login & Register inside this layout
      children: [
        { path: 'login', component: Login },
        { path: 'register', component: Register },
      ],
    },
    { path: '/', name: 'map', component: MapView, meta: { requiresAuth: true }},
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    next('/auth/login') // Redirect if not authenticated
  } else if (authStore.isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
    next('/') // Redirect logged-in users to home
  } else {
    next() // Allow navigation
  }
})

export default router
