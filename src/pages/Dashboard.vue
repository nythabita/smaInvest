<template>
  <div class="min-h-screen bg-neutral-50 pb-24">
    <!-- Header Section -->
    <header class="bg-white px-6 py-8 rounded-b-[2rem] shadow-sm mb-6">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-emerald-700 font-bold text-xl tracking-tight">SMA Invest</h1>
        </div>
        <button class="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors">
          <LogOut class="w-5 h-5" />
        </button>
      </div>
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Hi, Kiya! 👋</h2>
        <p class="text-gray-500 text-sm font-medium">Siap lanjut belajar investasi hari ini?</p>
      </div>
    </header>

    <main class="px-6 space-y-6">
      <!-- Progress Overview Card -->
      <section class="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200">
        <div class="flex justify-between items-end mb-4">
          <div>
            <p class="text-emerald-100 text-sm font-medium mb-1">Progress Belajar</p>
            <h3 class="text-3xl font-bold">40%</h3>
          </div>
          <div class="text-right">
            <span class="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              2 dari 5 modul selesai
            </span>
          </div>
        </div>
        <!-- Progress Bar -->
        <div class="h-2 w-full bg-black/20 rounded-full overflow-hidden">
          <div class="h-full bg-white rounded-full transition-all duration-1000 ease-out" style="width: 40%"></div>
        </div>
      </section>

      <!-- Quick Stats Cards -->
      <section class="grid grid-cols-3 gap-3">
        <div class="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-neutral-100">
          <BookOpen class="w-6 h-6 text-emerald-500 mb-2" />
          <span class="text-lg font-bold text-gray-800">5</span>
          <span class="text-xs text-gray-500 font-medium">Modul</span>
        </div>
        <div class="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-neutral-100">
          <CheckCircle class="w-6 h-6 text-emerald-500 mb-2" />
          <span class="text-lg font-bold text-gray-800">2</span>
          <span class="text-xs text-gray-500 font-medium">Selesai</span>
        </div>
        <div class="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm border border-neutral-100">
          <Award class="w-6 h-6 text-emerald-500 mb-2" />
          <span class="text-lg font-bold text-gray-800">1</span>
          <span class="text-xs text-gray-500 font-medium text-center leading-tight">Quiz<br>Terakhir</span>
        </div>
      </section>

      <!-- Module List Section -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Modul Belajar</h3>
          <button class="text-sm text-emerald-600 font-semibold hover:text-emerald-700">Lihat Semua</button>
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="module in modules" 
            :key="module.id"
            class="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1 pr-4">
                <div class="flex items-center gap-2 mb-2">
                  <span 
                    class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                    :class="{
                      'bg-emerald-100 text-emerald-700': module.status === 'completed',
                      'bg-amber-100 text-amber-700': module.status === 'in_progress',
                      'bg-gray-100 text-gray-600': module.status === 'not_started'
                    }"
                  >
                    {{ getStatusLabel(module.status) }}
                  </span>
                </div>
                <h4 class="font-bold text-gray-900 leading-tight mb-1">{{ module.title }}</h4>
                <p class="text-sm text-gray-500 line-clamp-2">{{ module.description }}</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <div class="flex-1 mr-6">
                <div class="flex justify-between text-xs mb-1 font-medium text-gray-500">
                  <span>Progress</span>
                  <span>{{ module.progress }}%</span>
                </div>
                <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-500"
                    :class="{
                      'bg-emerald-500': module.status === 'completed',
                      'bg-amber-500': module.status === 'in_progress',
                      'bg-gray-300': module.status === 'not_started'
                    }"
                    :style="{ width: `${module.progress}%` }"
                  ></div>
                </div>
              </div>
              <button 
                @click="goToModule(module.id)"
                class="shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                :class="{
                  'bg-emerald-100 text-emerald-700 hover:bg-emerald-200': module.status === 'completed',
                  'bg-amber-500 text-white hover:bg-amber-600': module.status === 'in_progress',
                  'bg-emerald-600 text-white hover:bg-emerald-700': module.status === 'not_started'
                }"
              >
                {{ getCTAText(module.status) }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 px-safe pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <ul class="flex justify-between items-center max-w-md mx-auto">
        <li>
          <button class="flex flex-col items-center gap-1 p-2 text-emerald-600">
            <Home class="w-6 h-6" />
            <span class="text-[10px] font-bold">Home</span>
          </button>
        </li>
        <li>
          <button class="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-emerald-600 transition-colors">
            <BookOpen class="w-6 h-6" />
            <span class="text-[10px] font-medium">Modul</span>
          </button>
        </li>
        <li>
          <button class="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-emerald-600 transition-colors">
            <TrendingUp class="w-6 h-6" />
            <span class="text-[10px] font-medium">Progress</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, BookOpen, CheckCircle, Award, Home, TrendingUp } from 'lucide-vue-next'

const router = useRouter()

const modules = ref([
  {
    id: 1,
    title: 'Apa Itu Investasi?',
    description: 'Kenali konsep dasar investasi untuk pemula.',
    status: 'completed',
    progress: 100
  },
  {
    id: 2,
    title: 'Menabung vs Investasi',
    description: 'Pahami perbedaan menyimpan uang dan mengembangkan uang.',
    status: 'in_progress',
    progress: 60
  },
  {
    id: 3,
    title: 'Risiko dan Return',
    description: 'Pelajari hubungan antara potensi keuntungan dan risiko.',
    status: 'not_started',
    progress: 0
  }
])

const getStatusLabel = (status) => {
  switch (status) {
    case 'completed': return 'Selesai'
    case 'in_progress': return 'Sedang Belajar'
    case 'not_started': return 'Belum Mulai'
    default: return ''
  }
}

const getCTAText = (status) => {
  switch (status) {
    case 'completed': return 'Ulangi'
    case 'in_progress': return 'Lanjutkan'
    case 'not_started': return 'Mulai'
    default: return 'Mulai'
  }
}

const goToModule = (id) => {
  // Use push if route exists, but for dummy just logging or navigating to safe path.
  // The user requested to route to `/modules/1` for now.
  router.push(`/modules/1`).catch(() => {
    console.warn(`Route /modules/1 not found, ignoring navigation for now.`)
  })
}
</script>

<style scoped>
/* Support for safe areas in mobile devices */
.px-safe {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>