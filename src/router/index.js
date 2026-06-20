import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import ModuleListPage from '../pages/ModuleListPage.vue'
import ModuleDetailPage from '../pages/ModuleDetailPage.vue'
import QuizPage from '../pages/QuizPage.vue'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/modules',
    name: 'Modules',
    component: ModuleListPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/modules/:id',
    name: 'ModuleDetail',
    component: ModuleDetailPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/quiz/:moduleId',
    name: 'Quiz',
    component: QuizPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { user, initPromise } = useAuth()
  
  // Wait for Supabase to resolve the session from localStorage
  await initPromise

  const isAuthenticated = !!user.value

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router