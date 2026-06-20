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
    <main class="flex-1 w-full max-w-[768px] mx-auto px-page-padding pt-6 pb-24 md:pt-24 flex flex-col gap-section-gap-sm">
      
      <!-- Back Button -->
      <button @click="goBack" class="flex items-center gap-1.5 text-primary font-semibold text-sm hover:opacity-85 w-fit">
        <span class="material-symbols-outlined text-sm font-bold">arrow_back</span>
        Kembali
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-on-surface-variant font-body-md">Memuat kuis...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B1C1C] rounded-xl p-4 flex flex-col gap-2">
        <p class="font-body-md">{{ error }}</p>
        <button @click="loadQuiz" class="text-primary font-semibold text-sm hover:underline w-fit">Coba Lagi</button>
      </div>

      <!-- If module or quiz not found -->
      <div v-else-if="!currentModule || !questions || questions.length === 0" class="flex flex-col items-center justify-center text-center py-12 gap-inline-space">
        <span class="material-symbols-outlined text-outline text-5xl">warning</span>
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Quiz Tidak Ditemukan</h2>
        <p class="font-body-lg text-body-lg text-text-muted mb-4">Maaf, quiz untuk modul ini belum tersedia atau ID modul salah.</p>
        <button 
          @click="navigateTo('/modules')"
          class="bg-primary text-white font-button-text text-button-text px-6 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all text-sm"
        >
          Kembali ke Daftar Modul
        </button>
      </div>

      <div v-else class="flex flex-col gap-stack-space">
        <!-- Quiz Header / Module Title Info -->
        <div class="flex flex-col gap-inline-space">
          <span class="font-label-md text-label-md text-primary uppercase tracking-widest font-bold">Evaluasi Pemahaman</span>
          <h1 class="font-headline-sm text-headline-sm text-on-surface mt-1">Quiz: {{ currentModule.title }}</h1>
        </div>

        <!-- Quiz Ongoing State -->
        <div v-if="!isFinished" class="flex flex-col gap-6 mt-2">
          <!-- Progress Stats -->
          <div class="flex justify-between items-end mb-1">
            <span class="font-title-lg text-sm font-bold text-primary">Pertanyaan {{ currentQuestionIndex + 1 }} dari {{ questions.length }}</span>
            <span class="font-label-md text-xs text-text-muted">{{ Math.round((currentQuestionIndex / questions.length) * 100) }}% Selesai</span>
          </div>
          <!-- Progress Bar -->
          <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-4">
            <div class="h-full bg-primary rounded-full transition-all duration-300" :style="{ width: ((currentQuestionIndex) / questions.length) * 100 + '%' }"></div>
          </div>

          <!-- Question Card -->
          <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 flex flex-col gap-4 shadow-[0px_4px_20px_rgba(16,37,27,0.03)]">
            <h2 class="font-title-lg text-lg font-bold text-on-surface leading-snug">
              {{ currentQuestion.text }}
            </h2>
            
            <!-- Options List -->
            <div class="flex flex-col gap-3 mt-2">
              <button 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                @click="selectOption(index)"
                class="w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between"
                :class="selectedOption === index 
                  ? 'border-primary bg-secondary-container/30 text-on-surface' 
                  : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/50'"
              >
                <span class="font-body-lg text-sm text-on-surface">{{ option.text }}</span>
                <div 
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                  :class="selectedOption === index ? 'border-primary' : 'border-outline'"
                >
                  <div v-if="selectedOption === index" class="w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>
              </button>
            </div>
          </div>

          <!-- Next/Finish Button -->
          <button 
            @click="nextQuestion"
            :disabled="selectedOption === null"
            class="w-full py-4 rounded-full font-button-text text-button-text transition-all mt-4"
            :class="selectedOption === null 
              ? 'bg-surface-variant text-on-surface-variant/40 cursor-not-allowed' 
              : 'bg-primary text-white hover:opacity-90 active:scale-[0.98] shadow-md'"
          >
            {{ isLastQuestion ? 'Selesai & Lihat Hasil' : 'Pertanyaan Selanjutnya' }}
          </button>
        </div>

        <!-- Result State -->
        <div v-else class="flex flex-col items-center justify-center py-8 text-center gap-6 mt-4">
          <div class="w-24 h-24 bg-secondary-container rounded-full flex items-center justify-center mb-2 relative">
            <div class="absolute inset-0 bg-primary-fixed rounded-full animate-ping opacity-30"></div>
            <span class="material-symbols-outlined text-primary text-5xl relative z-10" style="font-variation-settings: 'FILL' 1;">award</span>
          </div>
          
          <div>
            <h2 class="font-display-lg-mobile text-2xl font-extrabold text-on-surface mb-2">Quiz Selesai!</h2>
            <p class="font-body-lg text-sm text-text-muted">Skor pemahaman kamu adalah:</p>
          </div>

          <div class="text-6xl font-extrabold text-primary my-2">
            {{ score }}<span class="text-2xl text-primary-fixed-dim font-bold">/100</span>
          </div>
          
          <p class="font-body-lg text-sm text-on-surface-variant px-4 max-w-sm leading-relaxed">
            {{ score >= 80 
              ? 'Luar biasa! Kamu sudah memahami materi ini dengan sangat baik. Siap lanjut ke modul berikutnya!' 
              : 'Bagus! Kamu bisa membaca kembali materinya dan mencoba lagi untuk mendapatkan skor sempurna.' }}
          </p>

          <div class="w-full max-w-xs flex flex-col gap-3 mt-6">
            <button 
              @click="navigateTo('/dashboard')"
              class="w-full bg-primary text-white font-button-text text-button-text py-3.5 rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              Kembali ke Dashboard
            </button>
            <button 
              @click="navigateTo('/modules')"
              class="w-full bg-surface-container text-on-surface font-button-text text-button-text py-3.5 rounded-full hover:bg-surface-container-high active:scale-95 transition-all"
            >
              Daftar Modul Lain
            </button>
            <button 
              v-if="score < 100"
              @click="retryQuiz"
              class="w-full bg-surface-container-lowest text-primary border border-outline-variant/30 font-button-text text-button-text py-3.5 rounded-full hover:bg-secondary-container/20 active:scale-95 transition-all"
            >
              Ulangi Quiz
            </button>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModules } from '../composables/useModules'
import { useQuiz } from '../composables/useQuiz'

const route = useRoute()
const router = useRouter()

const moduleId = computed(() => route.params.moduleId)

const { currentModule, loading: moduleLoading, error: moduleError, fetchModuleById } = useModules()
const { questions, loading: quizLoading, error: quizError, fetchQuestionsByModuleId } = useQuiz()

const loading = computed(() => moduleLoading.value || quizLoading.value)
const error = computed(() => moduleError.value || quizError.value)

const loadQuiz = () => {
  fetchModuleById(moduleId.value)
  fetchQuestionsByModuleId(moduleId.value)
}

onMounted(() => {
  loadQuiz()
})

const currentQuestionIndex = ref(0)
const selectedOption = ref(null)
const isFinished = ref(false)
const score = ref(0)
const userAnswers = ref([])

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)

const selectOption = (index) => {
  selectedOption.value = index
}

const nextQuestion = () => {
  if (selectedOption.value === null) return
  
  userAnswers.value.push(selectedOption.value)
  
  if (isLastQuestion.value) {
    calculateScore()
    isFinished.value = true
  } else {
    currentQuestionIndex.value++
    selectedOption.value = null
  }
}

const calculateScore = () => {
  let correctCount = 0
  userAnswers.value.forEach((answerIndex, qIndex) => {
    if (questions.value[qIndex] && questions.value[qIndex].options[answerIndex] && questions.value[qIndex].options[answerIndex].isCorrect) {
      correctCount++
    }
  })
  score.value = Math.round((correctCount / questions.value.length) * 100)
}

const goBack = () => {
  if (isFinished.value) {
    isFinished.value = false
    currentQuestionIndex.value = 0
    selectedOption.value = null
    userAnswers.value = []
  }
  router.push(`/modules/${moduleId.value}`)
}

const retryQuiz = () => {
  currentQuestionIndex.value = 0
  selectedOption.value = null
  isFinished.value = false
  score.value = 0
  userAnswers.value = []
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
</style>
