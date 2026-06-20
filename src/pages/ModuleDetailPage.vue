<template>
  <div class="bg-background text-on-background font-body-md font-sans min-h-screen flex flex-col md:items-center">
    <!-- TopAppBar (Visible on Desktop, hidden on mobile) -->
    <header class="hidden md:flex justify-between items-center px-page-padding h-16 w-full max-w-[768px] mx-auto bg-background dark:bg-on-background fixed top-0 z-50">
      <div class="flex items-center gap-3 cursor-pointer" @click="navigateTo('/dashboard')">
        <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">account_balance</span>
        <span class="font-display-lg-mobile text-display-lg-mobile font-extrabold text-primary">SMA Invest</span>
      </div>
      <nav class="flex items-center gap-6">
        <button class="text-on-surface-variant hover:bg-surface-container-low transition-colors px-3 py-2 rounded-lg" @click="navigateTo('/dashboard')">Home</button>
        <button class="text-primary font-bold active:scale-95 transition-transform" @click="navigateTo('/modules')">Modules</button>
      </nav>
      <div>
        <button class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden hover:opacity-85 active:scale-95 transition-all" @click="handleLogout" title="Log Out">
          <span class="material-symbols-outlined text-on-surface-variant">logout</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full max-w-[768px] mx-auto px-page-padding pt-6 pb-24 md:pt-24 flex flex-col gap-section-gap-md">
      
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-on-surface-variant font-body-md">Memuat detail modul...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B1C1C] rounded-xl p-4 flex flex-col gap-2">
        <p class="font-body-md">{{ error }}</p>
        <button @click="loadModule" class="text-primary font-semibold text-sm hover:underline w-fit">Coba Lagi</button>
      </div>

      <!-- Fallback when module not found -->
      <div v-else-if="!currentModule" class="flex flex-col items-center justify-center text-center py-12 gap-inline-space">
        <span class="material-symbols-outlined text-outline text-5xl">warning</span>
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Modul Tidak Ditemukan</h2>
        <p class="font-body-lg text-body-lg text-text-muted mb-4">Maaf, modul yang kamu cari tidak tersedia atau salah ID.</p>
        <button 
          @click="navigateTo('/modules')"
          class="bg-primary text-white font-button-text text-button-text px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all text-sm"
        >
          Kembali ke Daftar Modul
        </button>
      </div>

      <!-- Module Content -->
      <div v-else class="flex flex-col gap-section-gap-sm">
        <!-- Back navigation -->
        <button @click="navigateTo('/modules')" class="flex items-center gap-1.5 text-primary font-semibold text-sm hover:opacity-85 w-fit">
          <span class="material-symbols-outlined text-sm font-bold">arrow_back</span>
          Kembali ke Daftar Modul
        </button>

        <!-- Header -->
        <section class="mt-2 bg-primary-container text-on-primary-container rounded-2xl p-card-padding flex flex-col gap-stack-space relative overflow-hidden shadow-md">
          <div class="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-secondary-container opacity-20 rounded-full blur-2xl"></div>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-on-primary-container rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-primary-container text-2xl" style="font-variation-settings: 'FILL' 1;">{{ currentModule.icon }}</span>
            </div>
            <div>
              <span class="font-label-md text-[10px] text-primary-fixed-dim uppercase tracking-widest font-bold">Modul {{ currentModule.id }} • {{ currentModule.duration }}</span>
              <h1 class="font-headline-sm text-headline-sm text-on-primary-container">{{ currentModule.title }}</h1>
            </div>
          </div>
          <p class="font-body-md text-body-md text-primary-fixed-dim mt-2">{{ currentModule.description }}</p>
        </section>

        <!-- Main Content -->
        <section class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 flex flex-col gap-4 shadow-[0px_4px_20px_rgba(16,37,27,0.03)] mt-2">
          <h2 class="font-title-lg text-title-lg text-on-surface border-b border-outline-variant/30 pb-2 mb-2">Materi Belajar</h2>
          <div class="flex flex-col gap-4 text-on-surface-variant font-body-lg leading-relaxed">
            <div 
              v-for="(point, index) in currentModule.content" 
              :key="index"
              class="flex gap-3 items-start"
            >
              <div class="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">
                {{ index + 1 }}
              </div>
              <p class="font-body-lg text-body-lg text-on-surface-variant">{{ point }}</p>
            </div>
          </div>
        </section>

        <!-- Key Takeaway Card -->
        <section class="bg-[#DFF5E7] rounded-xl p-4 flex items-start gap-3 border border-[#c6ecd5]">
          <span class="material-symbols-outlined text-primary mt-0.5" style="font-variation-settings: 'FILL' 1;">lightbulb</span>
          <div>
            <h5 class="font-title-lg text-sm font-bold text-primary mb-1">Key Takeaway</h5>
            <p class="font-body-md text-body-md text-on-surface-variant italic">"{{ currentModule.keyTakeaway }}"</p>
          </div>
        </section>

        <!-- CTA Button -->
        <section class="mt-4">
          <button 
            @click="startQuiz(currentModule.id)"
            class="w-full bg-primary text-white font-button-text text-button-text py-4 rounded-full hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(0,96,56,0.2)] flex items-center justify-center gap-2"
          >
            Mulai Quiz
            <span class="material-symbols-outlined text-xl">quiz</span>
          </button>
        </section>
      </div>

    </main>

    <!-- BottomNavBar (Mobile Only) -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface dark:bg-inverse-surface px-2 py-3 pb-safe shadow-[0px_-4px_20px_rgba(16,37,27,0.05)] rounded-t-xl">
      <button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant hover:opacity-80 active:scale-90 transition-transform px-4 py-1" @click="navigateTo('/dashboard')">
        <span class="material-symbols-outlined text-[24px]">home</span>
        <span class="font-label-md text-[10px] mt-1">Home</span>
      </button>
      <button class="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-full px-4 py-1 active:scale-90 transition-transform" @click="navigateTo('/modules')">
        <span class="material-symbols-outlined text-[24px]" style="font-variation-settings: 'FILL' 1;">menu_book</span>
        <span class="font-label-md text-[10px] mt-1 font-semibold">Modules</span>
      </button>
      <button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant hover:opacity-80 active:scale-90 transition-transform px-4 py-1" @click="navigateTo('/login')">
        <span class="material-symbols-outlined text-[24px]">person</span>
        <span class="font-label-md text-[10px] mt-1">Profile</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModules } from '../composables/useModules'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { currentModule, loading, error, fetchModuleById } = useModules()
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

const loadModule = () => {
  fetchModuleById(route.params.id)
}

onMounted(() => {
  loadModule()
})

const startQuiz = (moduleId) => {
  router.push(`/quiz/${moduleId}`)
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
</style>
