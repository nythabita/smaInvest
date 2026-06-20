<template>
  <div class="min-h-screen bg-neutral-50 pb-20 pb-safe">
    <!-- List View -->
    <div v-if="!moduleId">
      <!-- Header -->
      <header class="bg-white px-6 py-8 rounded-b-[2rem] shadow-sm mb-6">
        <div class="flex items-center gap-3 mb-4 text-emerald-700">
          <BookOpen class="w-6 h-6" />
          <h1 class="font-bold text-xl tracking-tight">Modul Belajar</h1>
        </div>
        <p class="text-gray-500 text-sm font-medium">Pilih materi investasi dasar yang ingin kamu pelajari.</p>
      </header>

      <main class="px-6 space-y-4">
        <div 
          v-for="module in modules" 
          :key="module.id"
          class="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col"
        >
          <div class="flex justify-between items-start mb-2">
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
            <div class="flex items-center text-gray-400 text-xs font-medium">
              <Clock class="w-3.5 h-3.5 mr-1" />
              {{ module.estimatedTime }}
            </div>
          </div>
          
          <h3 class="font-bold text-gray-900 text-lg mb-1">{{ module.title }}</h3>
          <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ module.description }}</p>
          
          <button 
            @click="openModule(module.id)"
            class="mt-auto w-full py-2.5 rounded-xl text-sm font-bold transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center gap-2"
          >
            Buka Modul
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>

    <!-- Detail View -->
    <div v-else-if="currentModule">
      <!-- Header -->
      <header class="bg-emerald-700 text-white px-6 pt-10 pb-6 rounded-b-[2rem] shadow-md sticky top-0 z-10">
        <button @click="goBack" class="flex items-center text-emerald-100 hover:text-white transition-colors mb-4 text-sm font-medium">
          <ArrowLeft class="w-4 h-4 mr-1" />
          Kembali
        </button>
        <div class="flex items-center text-emerald-200 text-xs font-medium mb-2">
          <Clock class="w-3.5 h-3.5 mr-1" />
          {{ currentModule.estimatedTime }}
        </div>
        <h1 class="text-2xl font-bold mb-2">{{ currentModule.title }}</h1>
        <p class="text-emerald-50 text-sm opacity-90">{{ currentModule.description }}</p>
      </header>

      <main class="px-6 py-6 space-y-6">
        <!-- Content -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
          <ul class="space-y-4 text-gray-700 text-sm leading-relaxed list-disc list-outside ml-4">
            <li v-for="(point, index) in currentModule.content" :key="index" class="pl-1">
              {{ point }}
            </li>
          </ul>
        </div>

        <!-- Key Takeaway -->
        <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 relative overflow-hidden">
          <div class="absolute -right-4 -top-4 text-emerald-100/50">
            <Lightbulb class="w-20 h-20" />
          </div>
          <div class="relative z-10">
            <div class="flex items-center gap-2 text-emerald-700 font-bold mb-2">
              <Lightbulb class="w-5 h-5" />
              <span>Key Takeaway</span>
            </div>
            <p class="text-emerald-800 text-sm font-medium leading-relaxed italic">
              "{{ currentModule.keyTakeaway }}"
            </p>
          </div>
        </div>

        <!-- CTA -->
        <button 
          @click="startQuiz"
          class="w-full py-4 rounded-xl text-base font-bold transition-all bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          Mulai Quiz
          <CheckCircle2 class="w-5 h-5" />
        </button>
      </main>
    </div>

    <!-- Not Found -->
    <div v-else class="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <AlertCircle class="w-12 h-12 text-gray-300 mb-4" />
      <h2 class="text-xl font-bold text-gray-800 mb-2">Modul Tidak Ditemukan</h2>
      <p class="text-gray-500 mb-6 text-sm">Modul yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
      <button @click="goBack" class="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm hover:bg-emerald-200">
        Kembali ke Daftar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BookOpen, Clock, ChevronRight, ArrowLeft, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const moduleId = computed(() => route.params.id)

const modules = [
  {
    id: 1,
    title: 'Apa Itu Investasi?',
    description: 'Kenali konsep dasar investasi untuk pemula.',
    estimatedTime: '5 min read',
    status: 'completed',
    content: [
      'Investasi adalah kegiatan menempatkan uang pada aset tertentu dengan harapan nilainya bertumbuh di masa depan.',
      'Berbeda dari menabung, investasi memiliki potensi keuntungan dan risiko.',
      'Untuk pemula, yang penting bukan langsung mencari keuntungan besar, tetapi memahami konsep dasar dan risiko.'
    ],
    keyTakeaway: 'Investasi adalah cara mengembangkan uang, tetapi harus dipahami dengan bijak.'
  },
  {
    id: 2,
    title: 'Menabung vs Investasi',
    description: 'Pahami perbedaan menyimpan uang dan mengembangkan uang.',
    estimatedTime: '4 min read',
    status: 'in_progress',
    content: [
      'Menabung biasanya bertujuan menyimpan uang agar aman dan mudah digunakan.',
      'Investasi bertujuan mengembangkan nilai uang dalam jangka waktu tertentu.',
      'Keduanya penting, tetapi digunakan untuk tujuan yang berbeda.'
    ],
    keyTakeaway: 'Menabung cocok untuk kebutuhan dekat, investasi cocok untuk tujuan jangka panjang.'
  },
  {
    id: 3,
    title: 'Risiko dan Return',
    description: 'Pelajari hubungan antara potensi keuntungan dan risiko.',
    estimatedTime: '5 min read',
    status: 'not_started',
    content: [
      'Return adalah potensi keuntungan dari investasi.',
      'Risiko adalah kemungkinan hasil investasi tidak sesuai harapan.',
      'Semakin tinggi potensi return, biasanya semakin tinggi juga risikonya.'
    ],
    keyTakeaway: 'Sebelum investasi, pahami dulu risiko dan jangan hanya melihat keuntungan.'
  }
]

const currentModule = computed(() => {
  if (!moduleId.value) return null
  return modules.find(m => m.id === parseInt(moduleId.value, 10)) || null
})

const getStatusLabel = (status) => {
  switch (status) {
    case 'completed': return 'Selesai'
    case 'in_progress': return 'Sedang Belajar'
    case 'not_started': return 'Belum Mulai'
    default: return ''
  }
}

const openModule = (id) => {
  router.push(`/modules/${id}`)
}

const goBack = () => {
  router.push('/modules')
}

const startQuiz = () => {
  if (moduleId.value) {
    router.push(`/quiz/${moduleId.value}`)
  }
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
