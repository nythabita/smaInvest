<template>
  <div class="min-h-screen bg-background text-on-background flex flex-col justify-center px-6 relative pb-safe md:items-center">
    <!-- Main Content Area -->
    <main class="w-full max-w-[400px] mx-auto flex flex-col gap-6 items-center text-center">
      <!-- App Brand / Icon -->
      <div class="flex flex-col items-center gap-3">
        <div class="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center shadow-lg">
          <span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">account_balance</span>
        </div>
        <div>
          <h1 class="font-display-lg-mobile text-display-lg-mobile font-extrabold text-primary">SMA Invest</h1>
          <p class="font-body-md text-xs text-on-surface-variant mt-0.5">Belajar Investasi Lebih Mudah & Seru</p>
        </div>
      </div>

      <!-- Card -->
      <div class="w-full bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-[0px_4px_24px_rgba(16,37,27,0.06)] flex flex-col gap-5">
        <div>
          <h2 class="font-headline-sm text-headline-sm text-on-surface font-extrabold">
            {{ mode === 'login' ? 'Masuk ke SMA Invest' : 'Daftar Akun Baru' }}
          </h2>
          <p class="font-body-md text-sm text-text-muted mt-1">
            {{ mode === 'login' 
              ? 'Masukkan email dan password untuk melanjutkan belajarmu.' 
              : 'Buat akun baru untuk mulai memantau progress belajar investasimu.' 
            }}
          </p>
        </div>

        <!-- Alert Messages -->
        <div v-if="errorMessage" class="bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B1C1C] rounded-xl p-3 text-sm text-left">
          {{ errorMessage }}
        </div>
        
        <div v-if="successMessage" class="bg-[#DEF7EC] border border-[#31C48D]/30 text-[#03543F] rounded-xl p-3 text-sm text-left">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <!-- Name Input (Signup Only) -->
          <div v-if="mode === 'signup'">
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 text-left">Nama Lengkap</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
              <input 
                v-model="displayName"
                type="text" 
                placeholder="Nama panggilanmu"
                required
                class="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface transition-colors"
              >
            </div>
          </div>

          <!-- Grade Select (Signup Only) -->
          <div v-if="mode === 'signup'">
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 text-left">Tingkat Pendidikan</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">school</span>
              <select 
                v-model="grade"
                required
                class="w-full pl-12 pr-10 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface transition-colors appearance-none"
              >
                <option value="" disabled>Pilih kelasmu</option>
                <option value="Kelas 10">Kelas 10</option>
                <option value="Kelas 11">Kelas 11</option>
                <option value="Kelas 12">Kelas 12</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">expand_more</span>
            </div>
          </div>

          <!-- Email Input -->
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 text-left">Email</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
              <input 
                id="email-input"
                v-model="email"
                type="email" 
                placeholder="nama@sekolah.com"
                required
                class="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface transition-colors"
              >
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 text-left">Password</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">key</span>
              <input 
                id="password-input"
                v-model="password"
                type="password" 
                placeholder="••••••••"
                required
                class="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface transition-colors"
              >
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            id="submit-button"
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ mode === 'login' ? 'Masuk' : 'Daftar' }}</span>
          </button>
        </form>

        <!-- Toggle Mode -->
        <div class="text-sm">
          <span class="text-text-muted">
            {{ mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? ' }}
          </span>
          <button 
            id="toggle-mode-button"
            @click="toggleMode" 
            class="text-primary font-bold hover:underline"
          >
            {{ mode === 'login' ? 'Daftar sekarang' : 'Masuk sekarang' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProfile } from '../composables/useProfile'

const router = useRouter()
const { user, loading: authLoading, loginWithEmail, signUpWithEmail } = useAuth()
const { createProfile, loading: profileLoading } = useProfile()

const loading = ref(false)
const mode = ref('login') // 'login' or 'signup'
const displayName = ref('')
const grade = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  errorMessage.value = ''
  successMessage.value = ''
  password.value = ''
}

const clearFields = () => {
  email.value = ''
  password.value = ''
  displayName.value = ''
  grade.value = ''
}

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true
  
  try {
    if (mode.value === 'login') {
      await loginWithEmail(email.value, password.value)
      clearFields()
      router.replace('/dashboard')
    } else {
      const data = await signUpWithEmail(email.value, password.value)
      
      if (data?.user) {
        // Create user profile in Supabase
        await createProfile(data.user.id, displayName.value, grade.value)
      }
      
      // If user is auto-confirmed or already has session, redirect.
      // Otherwise, show friendly check-email info message.
      if (data?.session) {
        successMessage.value = 'Pendaftaran berhasil! Mengarahkan...'
        clearFields()
        setTimeout(() => {
          router.replace('/dashboard')
        }, 1500)
      } else {
        successMessage.value = 'Pendaftaran berhasil! Silakan cek email untuk konfirmasi akun.'
        // Reset password field
        password.value = ''
      }
    }
  } catch (err) {
    errorMessage.value = err.message || 'Terjadi kesalahan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
const checkUser = () => {
  if (user.value) {
    router.replace('/dashboard')
  } else {
    clearFields()
  }
}

onMounted(() => {
  clearFields()
  checkUser()
})

watch(user, () => {
  checkUser()
})
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>