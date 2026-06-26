<template>
  <div class="bg-background text-on-background font-body-md font-sans min-h-screen flex flex-col items-center relative pb-24 md:pb-0">
    <!-- TopAppBar (Desktop Only) -->
    <header class="hidden md:flex justify-between items-center px-page-padding h-16 w-full max-w-[768px] mx-auto bg-background dark:bg-on-background sticky top-0 z-50">
      <div class="flex items-center gap-3 cursor-pointer" @click="navigateTo('/dashboard')">
        <span class="material-symbols-outlined text-primary dark:text-primary-fixed-dim" style="font-variation-settings: 'FILL' 1;">account_balance</span>
        <span class="font-display-lg-mobile text-display-lg-mobile font-extrabold text-primary dark:text-primary-fixed">SMA Invest</span>
      </div>
      <nav class="flex items-center gap-6">
        <button 
          :class="['font-bold active:scale-95 transition-transform', route.path === '/dashboard' ? 'text-primary' : 'text-on-surface-variant']" 
          @click="navigateTo('/dashboard')"
        >
          Home
        </button>
        <button 
          :class="['hover:bg-surface-container-low transition-colors px-3 py-2 rounded-lg', route.path === '/modules' ? 'text-primary font-bold' : 'text-on-surface-variant']" 
          @click="navigateTo('/modules')"
        >
          Modules
        </button>
      </nav>
      <div class="flex items-center gap-3">
        <button 
          :class="['w-10 h-10 rounded-full flex items-center justify-center overflow-hidden hover:opacity-85 active:scale-95 transition-all', route.path === '/profile' ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface-variant']" 
          @click="navigateTo('/profile')" title="Profile"
        >
          <span class="material-symbols-outlined">person</span>
        </button>
        <button class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden hover:opacity-85 active:scale-95 transition-all" @click="handleLogout" title="Log Out">
          <span class="material-symbols-outlined text-on-surface-variant">logout</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <slot />

    <!-- BottomNavBar (Mobile Only) -->
    <nav class="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe max-w-[768px] bg-surface-container-lowest border-t-0 shadow-[0px_-4px_20px_rgba(16,37,27,0.05)] rounded-t-xl">
      <button 
        :class="['flex flex-col items-center justify-center flex-1 py-1 transition-all', route.path === '/dashboard' ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-full px-4 scale-110 duration-200 shadow-sm' : 'text-text-muted hover:text-primary']" 
        @click="navigateTo('/dashboard')"
      >
        <span class="material-symbols-outlined mb-1 text-[24px]" :style="route.path === '/dashboard' ? 'font-variation-settings: \'FILL\' 1;' : ''">home</span>
        <span class="font-label-md text-[10px]">Home</span>
      </button>
      
      <button 
        :class="['flex flex-col items-center justify-center flex-1 py-1 transition-all', route.path === '/modules' ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-full px-4 scale-110 duration-200 shadow-sm' : 'text-text-muted hover:text-primary']" 
        @click="navigateTo('/modules')"
      >
        <span class="material-symbols-outlined mb-1 text-[24px]" :style="route.path === '/modules' ? 'font-variation-settings: \'FILL\' 1;' : ''">menu_book</span>
        <span class="font-label-md text-[10px]">Materi</span>
      </button>

      <button 
        :class="['flex flex-col items-center justify-center flex-1 py-1 transition-all', route.path === '/profile' ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-full px-4 scale-110 duration-200 shadow-sm' : 'text-text-muted hover:text-primary']" 
        @click="navigateTo('/profile')"
      >
        <span class="material-symbols-outlined mb-1 text-[24px]" :style="route.path === '/profile' ? 'font-variation-settings: \'FILL\' 1;' : ''">person</span>
        <span class="font-label-md text-[10px]">Profil</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { logout } = useAuth()

const navigateTo = (path) => {
  if (route.path !== path) {
    router.push(path)
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
</style>
