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
        <button class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden hover:opacity-85 active:scale-95 transition-all" @click="navigateTo('/login')" title="Log Out">
          <span class="material-symbols-outlined text-on-surface-variant">logout</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full max-w-[768px] mx-auto px-page-padding pt-6 pb-24 md:pt-24 flex flex-col gap-section-gap-md">
      <!-- Back Button & Header -->
      <section class="flex flex-col gap-inline-space">
        <button @click="navigateTo('/dashboard')" class="flex items-center gap-1.5 text-primary font-semibold text-sm hover:opacity-85 w-fit">
          <span class="material-symbols-outlined text-sm font-bold">arrow_back</span>
          Kembali ke Dashboard
        </button>
        <h1 class="font-display-lg-mobile text-display-lg-mobile text-primary mt-2">Daftar Modul Belajar</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant">Pilih materi yang ingin kamu pelajari untuk mengasah kemampuan investasimu.</p>
      </section>

      <!-- Loading & Error States -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-on-surface-variant font-body-md">Memuat daftar modul...</p>
      </div>

      <div v-else-if="error" class="bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B1C1C] rounded-xl p-4 flex flex-col gap-2">
        <p class="font-body-md">{{ error }}</p>
        <button @click="fetchModules" class="text-primary font-semibold text-sm hover:underline w-fit">Coba Lagi</button>
      </div>

      <!-- Module List -->
      <section v-else class="flex flex-col gap-stack-space">
        <div 
          v-for="module in modules" 
          :key="module.id"
          class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 flex items-start gap-4 shadow-[0px_4px_20px_rgba(16,37,27,0.04)] relative overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
          @click="openModule(module.id)"
        >
          <!-- Checkmark badge for completed -->
          <div v-if="module.status === 'completed'" class="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-success rounded-full">
            <span class="material-symbols-outlined text-white text-[16px] font-bold">check</span>
          </div>

          <!-- Icon Box -->
          <div :class="getIconContainerClass(module.status || 'not_started')">
            <span class="material-symbols-outlined" :class="getIconTextClass(module.status || 'not_started')" style="font-variation-settings: 'FILL' 1;">{{ module.icon || 'menu_book' }}</span>
          </div>

          <!-- Content -->
          <div class="flex flex-col flex-1 h-full justify-between">
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-title-lg text-title-lg text-on-surface line-clamp-1 pr-6">{{ module.title }}</h4>
                <span v-if="module.order_number === 3" class="bg-warning/20 text-on-surface-variant font-label-md text-[10px] px-1.5 py-0.5 rounded-full uppercase">Baru</span>
              </div>
              <p class="font-body-md text-body-md text-text-muted mt-1 line-clamp-2">{{ module.description }}</p>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <span class="inline-block bg-surface-container-highest text-on-surface-variant font-label-md text-label-md px-2 py-1 rounded-full">{{ module.duration }}</span>
              
              <div class="flex items-center gap-3">
                <!-- Status Badge -->
                <span :class="getStatusClass(module.status || 'not_started')" class="font-label-md text-label-md uppercase tracking-wider">
                  {{ getStatusText(module.status || 'not_started') }}
                </span>

                <!-- Action Button -->
                <button 
                  class="bg-primary text-white font-button-text text-button-text px-4 py-1.5 rounded-full hover:opacity-90 active:scale-95 transition-all text-sm"
                >
                  Buka Modul
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
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
import { useRouter } from 'vue-router'
import { useModules } from '../composables/useModules'

const router = useRouter()
const { modules, loading, error, fetchModules } = useModules()

onMounted(() => {
  fetchModules()
})

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

const getStatusText = (status) => {
  switch (status) {
    case 'completed': return 'Selesai'
    case 'in_progress': return 'Belajar'
    case 'not_started': return 'Mulai'
    default: return ''
  }
}

const getStatusClass = (status) => {
  if (status === 'completed') return 'text-success'
  if (status === 'in_progress') return 'text-primary'
  return 'text-text-muted'
}

const openModule = (id) => {
  router.push(`/modules/${id}`)
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
</style>
