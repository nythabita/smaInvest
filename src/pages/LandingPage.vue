<template>
  <div class="bg-background text-on-background font-body-md font-sans min-h-screen flex flex-col items-center justify-center px-page-padding py-12 relative overflow-hidden pb-safe">
    
    <!-- Background accents consistent with MD3 theme -->
    <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-fixed/20 to-transparent pointer-events-none z-0"></div>
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container opacity-20 rounded-full blur-2xl pointer-events-none z-0"></div>
    <div class="absolute bottom-12 -left-24 w-64 h-64 bg-primary-fixed opacity-10 rounded-full blur-3xl pointer-events-none z-0"></div>

    <div class="relative z-10 w-full max-w-[420px] flex flex-col items-center text-center">
      <!-- App Icon / Logo -->
      <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-6 rotate-3">
        <span class="material-symbols-outlined text-white text-3xl font-bold" style="font-variation-settings: 'FILL' 1;">trending_up</span>
      </div>

      <!-- App Name -->
      <span class="font-label-md text-label-md text-primary uppercase tracking-widest font-bold mb-2">SMA Invest</span>

      <!-- Hero Title -->
      <h1 class="font-display-lg-mobile text-display-lg-mobile text-primary leading-tight mb-4">
        Belajar Investasi<br>dari Sekolah
      </h1>
      
      <!-- Subtitle -->
      <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 px-4">
        Edukasi investasi interaktif yang didesain khusus agar mudah dipahami siswa SMA sejak dini.
      </p>

      <!-- Key Benefits Checklist -->
      <div class="w-full bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 text-left mb-8 flex flex-col gap-4 shadow-[0px_4px_20px_rgba(16,37,27,0.03)]">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary mt-0.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          <div>
            <h3 class="font-title-lg text-sm font-bold text-on-surface">Pembelajaran Mudah & Seru</h3>
            <p class="text-xs text-text-muted">Materi disingkat dan dijelaskan dengan bahasa sederhana.</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary mt-0.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          <div>
            <h3 class="font-title-lg text-sm font-bold text-on-surface">Modul Ramah Pemula</h3>
            <p class="text-xs text-text-muted">Mulai dari konsep dasar hingga cara menghindari investasi bodong.</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary mt-0.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          <div>
            <h3 class="font-title-lg text-sm font-bold text-on-surface">Uji Pemahaman Lewat Quiz</h3>
            <p class="text-xs text-text-muted">Cek pemahaman belajarmu dengan evaluasi quiz interaktif.</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary mt-0.5" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          <div>
            <h3 class="font-title-lg text-sm font-bold text-on-surface">Pantau Progress Belajar</h3>
            <p class="text-xs text-text-muted">Simpan progres belajarmu dan ketahui seberapa jauh kamu melangkah.</p>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <button 
        @click="goToDashboard"
        class="w-full bg-primary text-white font-button-text text-button-text py-4 rounded-full hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(0,96,56,0.2)] flex items-center justify-center gap-2"
      >
        Mulai Belajar
        <span class="material-symbols-outlined text-xl">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
