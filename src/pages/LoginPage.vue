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
  <div class="min-h-screen overflow-hidden bg-surface flex flex-col items-center justify-center relative font-body-md">
    
    <!-- Decorative subtle gradient -->
    <div class="pointer-events-none absolute top-[-10%] left-[-10%] h-[30rem] w-[30rem] rounded-full bg-secondary/5 blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[25rem] w-[25rem] rounded-full bg-surface-container-high/80 blur-3xl"></div>

    <div class="relative z-10 w-full max-w-md px-6 sm:px-8">
      
      <!-- Back to Home -->
      <button 
        @click="router.push('/')" 
        class="mb-8 inline-flex items-center text-sm font-label-caps tracking-widest text-on-surface-variant hover:text-primary transition-colors"
      >
        <span class="mr-2">←</span> BACK TO HOME
      </button>
      
      <div class="editorial-card p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col items-center text-center">
        
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div class="h-12 w-12 rounded-full bg-primary text-on-primary grid place-items-center shadow-sm mb-6">
            <Sparkles :size="24" stroke-width="1.5" />
          </div>
          <h1 class="font-display-lg text-3xl sm:text-4xl text-primary tracking-tight mb-2">
            Welcome to <br />
            <span class="italic text-secondary">VirtualCloset</span>
          </h1>
          <p class="mt-4 text-on-surface-variant max-w-xs">
            Sign in to curate and elevate your digital wardrobe.
          </p>
        </div>

        <div v-if="errorMessage" class="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center border border-red-100">
          {{ errorMessage }}
        </div>

        <!-- Google Login Button -->
        <button
          @click="loginWithGoogle"
          :disabled="isLoading"
          class="w-full inline-flex items-center justify-center gap-3 rounded-full bg-surface-container-lowest text-primary px-6 py-4 text-sm font-label-caps tracking-widest border border-outline-variant/50 shadow-sm hover:border-primary hover:bg-surface transition-all duration-300 disabled:opacity-70"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5" />
          <span>{{ isLoading ? 'PROCESSING...' : 'CONTINUE WITH GOOGLE' }}</span>
        </button>

      </div>
      
    </div>
  </div>
</template>
