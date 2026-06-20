<template>
  <div class="bg-background text-on-background font-body-md font-sans min-h-screen flex flex-col md:items-center">
    <!-- TopAppBar (Visible on Desktop, hidden on mobile for BottomNav layout) -->
    <header class="hidden md:flex justify-between items-center px-page-padding h-16 w-full max-w-[768px] mx-auto bg-background dark:bg-on-background fixed top-0 z-50">
      <div class="flex items-center gap-3 cursor-pointer" @click="navigateTo('/dashboard')">
        <span class="material-symbols-outlined text-primary dark:text-primary-fixed-dim" style="font-variation-settings: 'FILL' 1;">account_balance</span>
        <span class="font-display-lg-mobile text-display-lg-mobile font-extrabold text-primary dark:text-primary-fixed">SMA Invest</span>
      </div>
      <nav class="flex items-center gap-6">
        <button class="text-primary font-bold active:scale-95 transition-transform" @click="navigateTo('/dashboard')">Home</button>
        <button class="text-on-surface-variant hover:bg-surface-container-low transition-colors px-3 py-2 rounded-lg" @click="navigateTo('/modules')">Modules</button>
      </nav>
      <div>
        <button class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden hover:opacity-85 active:scale-95 transition-all" @click="navigateTo('/login')" title="Log Out">
          <span class="material-symbols-outlined text-on-surface-variant">logout</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full max-w-[768px] mx-auto px-page-padding pt-6 pb-24 md:pt-24 flex flex-col gap-section-gap-md">
      <!-- Welcome Section -->
      <section class="flex flex-col gap-inline-space">
        <h1 class="font-display-lg-mobile text-display-lg-mobile text-primary">Hi, Kiya! 👋</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant">Siap untuk belajar investasi hari ini?</p>
      </section>

      <!-- Progress Overview Card -->
      <section>
        <div class="bg-primary-container rounded-2xl p-card-padding flex flex-col gap-stack-space relative overflow-hidden shadow-lg">
          <!-- Decorative background elements -->
          <div class="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-secondary-container opacity-20 rounded-full blur-2xl"></div>
          <div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-surface-container opacity-20 rounded-full blur-xl"></div>
          <div class="flex items-center gap-3 relative z-10">
            <div class="w-12 h-12 bg-on-primary-container rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">trending_up</span>
            </div>
            <div>
              <h2 class="font-headline-sm text-headline-sm text-on-primary-container">Progress Belajar</h2>
              <p class="font-body-md text-body-md text-primary-fixed-dim">Level Pemula</p>
            </div>
          </div>
          <div class="mt-4 relative z-10">
            <div class="flex justify-between items-end mb-2">
              <span class="font-title-lg text-title-lg text-on-primary-container">{{ completedCount }} dari {{ totalCount }}</span>
              <span class="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider">Modul Selesai</span>
            </div>
            <!-- Progress Bar -->
            <div class="h-3 bg-surface-container-highest/30 rounded-full overflow-hidden">
              <div class="h-full bg-primary-fixed rounded-full shadow-[0_0_10px_rgba(158,245,190,0.5)] transition-all duration-500" :style="{ width: completedProgress + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Module List Section -->
      <section class="flex flex-col gap-stack-space">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-headline-sm text-headline-sm text-on-surface">Pilih Modul</h3>
          <button class="font-label-md text-label-md text-primary uppercase tracking-wider hover:opacity-80 transition-opacity">Lihat Semua</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-space">
          <div 
            v-for="module in modules" 
            :key="module.id"
            :class="getCardClass(module.status)"
            @click="goToModule(module.id)"
          >
            <!-- Checkmark badge on top right for completed -->
            <div v-if="module.status === 'completed'" class="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-success rounded-full">
              <span class="material-symbols-outlined text-white text-[16px] font-bold">check</span>
            </div>
            
            <!-- Icon Container -->
            <div :class="getIconContainerClass(module.status)">
              <span class="material-symbols-outlined" :class="getIconTextClass(module.status)" style="font-variation-settings: 'FILL' 1;">{{ module.icon }}</span>
            </div>
            
            <!-- Content -->
            <div class="flex flex-col flex-1 h-full justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-title-lg text-title-lg text-on-surface line-clamp-1">{{ module.title }}</h4>
                  <span v-if="module.isNew" class="bg-warning/20 text-on-surface-variant font-label-md text-[10px] px-1.5 py-0.5 rounded-full uppercase">Baru</span>
                </div>
                <p class="font-body-md text-body-md text-text-muted mt-1 line-clamp-2">{{ module.description }}</p>
              </div>
              <div class="mt-3 flex justify-between items-center">
                <span class="inline-block bg-surface-container-highest text-on-surface-variant font-label-md text-label-md px-2 py-1 rounded-full">{{ module.duration }}</span>
                
                <!-- CTA Button or Text -->
                <span v-if="module.status === 'completed'" class="font-label-md text-label-md text-success uppercase">Selesai</span>
                <button 
                  v-else
                  :class="module.status === 'in_progress' ? 'bg-primary text-white hover:opacity-90' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'"
                  class="font-button-text text-button-text px-4 py-1.5 rounded-full active:scale-95 transition-all text-sm"
                >
                  {{ getCTAText(module.status) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Tip Card (Key Takeaway Style) -->
      <section class="mt-4">
        <div class="bg-[#DFF5E7] rounded-xl p-4 flex items-start gap-3 border border-[#c6ecd5]">
          <span class="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
          <div>
            <h5 class="font-title-lg text-title-lg text-primary mb-1">Tip Hari Ini</h5>
            <p class="font-body-md text-body-md text-on-surface-variant">Mulai investasi dari nominal kecil tapi rutin lebih baik daripada modal besar tapi jarang.</p>
          </div>
        </div>
      </section>
    </main>

    <!-- BottomNavBar (Mobile Only) -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface dark:bg-inverse-surface px-2 py-3 pb-safe shadow-[0px_-4px_20px_rgba(16,37,27,0.05)] rounded-t-xl">
      <button class="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-full px-4 py-1 active:scale-90 transition-transform" @click="navigateTo('/dashboard')">
        <span class="material-symbols-outlined text-[24px]" style="font-variation-settings: 'FILL' 1;">home</span>
        <span class="font-label-md text-[10px] mt-1 font-semibold">Home</span>
      </button>
      <button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant hover:opacity-80 active:scale-90 transition-transform px-4 py-1" @click="navigateTo('/modules')">
        <span class="material-symbols-outlined text-[24px]">menu_book</span>
        <span class="font-label-md text-[10px] mt-1">Modules</span>
      </button>
      <button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant hover:opacity-80 active:scale-90 transition-transform px-4 py-1" @click="navigateTo('/login')">
        <span class="material-symbols-outlined text-[24px]">person</span>
        <span class="font-label-md text-[10px] mt-1">Profile</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { modulesData } from '../data/modules'

const router = useRouter()

// Show first 3 modules as preview on Dashboard
const modules = ref(modulesData.slice(0, 3))

const completedCount = computed(() => modulesData.filter(m => m.status === 'completed').length)
const totalCount = computed(() => modulesData.length)
const completedProgress = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round(modulesData.reduce((sum, m) => sum + m.progress, 0) / totalCount.value)
})

const getCardClass = (status) => {
  if (status === 'in_progress') {
    return 'bg-surface-container-lowest rounded-2xl p-4 border-2 border-primary flex items-start gap-4 shadow-[0px_4px_20px_rgba(16,37,27,0.08)] relative overflow-hidden cursor-pointer hover:border-primary-container transition-all active:scale-[0.99]'
  }
  if (status === 'completed') {
    return 'bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 flex items-start gap-4 shadow-[0px_4px_20px_rgba(16,37,27,0.05)] opacity-80 relative overflow-hidden cursor-pointer hover:opacity-100 transition-all active:scale-[0.99]'
  }
  return 'bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 flex items-start gap-4 shadow-[0px_4px_20px_rgba(16,37,27,0.05)] relative overflow-hidden cursor-pointer hover:border-outline transition-all active:scale-[0.99]'
}

const getIconContainerClass = (status) => {
  if (status === 'completed') {
    return 'w-16 h-16 rounded-xl bg-surface-container flex-shrink-0 flex items-center justify-center'
  }
  if (status === 'in_progress') {
    return 'w-16 h-16 rounded-xl bg-secondary-container flex-shrink-0 flex items-center justify-center overflow-hidden'
  }
  return 'w-16 h-16 rounded-xl bg-surface-variant flex-shrink-0 flex items-center justify-center overflow-hidden'
}

const getIconTextClass = (status) => {
  if (status === 'completed') {
    return 'text-tertiary text-3xl'
  }
  if (status === 'in_progress') {
    return 'text-primary text-3xl'
  }
  return 'text-outline text-3xl'
}

const getCTAText = (status) => {
  switch (status) {
    case 'completed': return 'Ulangi'
    case 'in_progress': return 'Lanjut'
    case 'not_started': return 'Mulai'
    default: return 'Mulai'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'completed': return 'Selesai'
    case 'in_progress': return 'Belajar'
    case 'not_started': return 'Mulai'
    default: return ''
  }
}

const goToModule = (id) => {
  router.push(`/modules/${id}`)
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
</style>
