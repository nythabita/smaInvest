import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import ModuleListPage from '../pages/ModuleListPage.vue'
import ModuleDetailPage from '../pages/ModuleDetailPage.vue'
import QuizPage from '../pages/QuizPage.vue'

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
    component: DashboardPage
  },
  {
    path: '/modules',
    name: 'Modules',
    component: ModuleListPage
  },
  {
    path: '/modules/:id',
    name: 'ModuleDetail',
    component: ModuleDetailPage
  },
  {
    path: '/quiz/:moduleId',
    name: 'Quiz',
    component: QuizPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guards bypassed for MVP dummy prototype
router.beforeEach((to, from, next) => {
  next()
})

export default router