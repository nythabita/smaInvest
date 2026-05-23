<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase/config'
import { Sparkles, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')

const loginWithGoogle = async () => {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await signInWithPopup(auth, googleProvider)
    router.push('/dashboard')
  } catch (error) {
    console.error("Login error:", error)
    errorMessage.value = "Gagal login dengan Google. Silakan coba lagi."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-cream flex flex-col items-center justify-center relative">
    
    <!-- Decorative blobs -->
    <div class="pointer-events-none absolute top-[-10%] left-[-10%] h-[30rem] w-[30rem] rounded-full bg-tan/20 blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[25rem] w-[25rem] rounded-full bg-beige/80 blur-3xl"></div>

    <div class="relative z-10 w-full max-w-md px-6 sm:px-8">
      
      <!-- Back to Home -->
      <button 
        @click="router.push('/')" 
        class="mb-8 inline-flex items-center text-sm font-medium text-espresso-soft hover:text-espresso transition-colors"
      >
        <span class="mr-2">←</span> Kembali ke Beranda
      </button>
      
      <div class="bg-white/70 backdrop-blur-md rounded-4xl p-8 sm:p-10 shadow-card border border-white">
        
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div class="h-12 w-12 rounded-xl bg-tan text-cream grid place-items-center shadow-soft mb-4">
            <Sparkles :size="24" />
          </div>
          <h1 class="font-display text-2xl sm:text-3xl text-espresso tracking-tight text-center">
            Selamat Datang di <br />
            <span class="italic text-tan">VirtualCloset</span>
          </h1>
          <p class="mt-3 text-sm text-espresso-soft text-center">
            Masuk untuk menyimpan dan memadukan koleksi pakaian Anda.
          </p>
        </div>

        <div v-if="errorMessage" class="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center border border-red-100">
          {{ errorMessage }}
        </div>

        <!-- Google Login Button -->
        <button
          @click="loginWithGoogle"
          :disabled="isLoading"
          class="press group relative w-full inline-flex items-center justify-center gap-3 rounded-full bg-white text-espresso px-6 py-4 text-base font-semibold shadow-soft hover:shadow-card border border-espresso/5 transition-all duration-300 ease-silk disabled:opacity-70"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5" />
          <span>{{ isLoading ? 'Memproses...' : 'Lanjutkan dengan Google' }}</span>
        </button>

      </div>
      
    </div>
  </div>
</template>
