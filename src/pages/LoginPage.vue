<template>
  <div class="min-h-screen bg-neutral-50 flex flex-col justify-center px-6 relative pb-safe">
    <!-- Header -->
    <header class="mb-10 text-center">
      <div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-200 mb-6">
        <Lock class="w-8 h-8 text-white" />
      </div>
      <h1 class="text-2xl font-bold text-emerald-800 mb-2">Selamat Datang</h1>
      <p class="text-gray-500 text-sm">Masuk untuk melanjutkan belajar investasimu.</p>
    </header>

    <!-- Login Form -->
    <main class="w-full max-w-md mx-auto">
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 space-y-5">
        
        <!-- Email Input -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              placeholder="nama@sekolah.com"
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            >
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
          <div class="relative">
            <Key class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              placeholder="••••••••"
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
            >
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          @click="handleLogin"
          class="w-full py-3.5 rounded-xl text-sm font-bold transition-all bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 active:translate-y-0 mt-4"
        >
          Masuk
        </button>

      </div>
      
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          Belum punya akun? <span class="text-emerald-600 font-bold">Daftar sekarang</span>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Lock, Mail, Key } from 'lucide-vue-next'

const router = useRouter()

const handleLogin = () => {
  // Dummy login action: bypass auth and go straight to dashboard
  router.push('/dashboard')
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>