import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import LandingPage from '../pages/LandingPage.vue'
import Dashboard from '../pages/Dashboard.vue'
import LoginPage from '../pages/LoginPage.vue'
import ClosetPage from '../pages/ClosetPage.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/closet',
    name: 'Closet',
    component: ClosetPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Helper to wait for Firebase auth state on first load
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (currentUser) {
      next()
    } else {
      next('/login')
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (currentUser) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
