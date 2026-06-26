<template>
  <MainLayout>
    <!-- Main Content Canvas -->
    <main class="w-full max-w-[768px] mx-auto px-page-padding pt-section-gap-sm pb-[100px] flex flex-col gap-section-gap-md">
      <!-- User Header -->
      <section class="flex flex-col items-center gap-stack-space">
        <div class="relative w-24 h-24 rounded-full border-4 border-white shadow-sm overflow-hidden bg-surface-variant flex items-center justify-center">
          <img v-if="profile?.avatar_url" class="w-full h-full object-cover" :src="profile.avatar_url" alt="Profile Picture" />
          <span v-else class="material-symbols-outlined text-[48px] text-text-muted">person</span>
        </div>
        <div class="text-center">
          <h2 class="font-headline-md-mobile text-headline-md-mobile text-on-surface mb-1">{{ profile?.display_name || user?.email?.split('@')[0] || 'Kiya' }}</h2>
          <p class="font-body-md text-body-md text-text-muted">{{ profile?.grade || 'Kelas 11' }} | {{ profile?.role_title || 'Siswa Investor' }}</p>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="grid grid-cols-2 gap-inline-space">
        <div class="bg-white rounded-3xl p-4 flex flex-col items-center justify-center border border-surface-variant shadow-[0px_4px_20px_rgba(16,37,27,0.05)]">
          <span class="material-symbols-outlined text-primary mb-2 text-[28px]" style="font-variation-settings: 'FILL' 1;">menu_book</span>
          <span class="font-headline-sm-mobile text-headline-sm-mobile text-on-surface">{{ completedCount }} Modul</span>
          <span class="font-label-md text-label-md text-text-muted mt-1">Diselesaikan</span>
        </div>
        <div class="bg-white rounded-3xl p-4 flex flex-col items-center justify-center border border-surface-variant shadow-[0px_4px_20px_rgba(16,37,27,0.05)]">
          <span class="material-symbols-outlined text-warning mb-2 text-[28px]" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
          <span class="font-headline-sm-mobile text-headline-sm-mobile text-on-surface">{{ profile?.total_xp || 0 }} XP</span>
          <span class="font-label-md text-label-md text-text-muted mt-1">Total Poin</span>
        </div>
      </section>

      <!-- Achievements Section -->
      <section class="flex flex-col gap-stack-space">
        <h3 class="font-title-lg text-title-lg text-on-surface">Pencapaian</h3>
        <div class="flex overflow-x-auto hide-scrollbar gap-inline-space pb-2 -mx-page-padding px-page-padding">
          <!-- Iterate over achievements if any -->
          <div v-if="!profile?.achievements || profile.achievements.length === 0" class="flex-none w-28 bg-surface-container-high rounded-3xl p-4 flex flex-col items-center justify-center border border-surface-variant opacity-60">
            <div class="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-2">
              <span class="material-symbols-outlined text-text-muted">lock</span>
            </div>
            <span class="font-label-md text-label-md text-text-muted text-center">Belum Ada</span>
          </div>

          <div v-else v-for="achievement in profile.achievements" :key="achievement.name" class="flex-none w-28 bg-secondary-container rounded-3xl p-4 flex flex-col items-center justify-center border border-secondary-fixed">
            <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
              <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">{{ achievement.icon || 'star' }}</span>
            </div>
            <span class="font-label-md text-label-md text-on-secondary-container text-center">{{ achievement.name }}</span>
          </div>
          
          <!-- Sample locked badge to show progression -->
          <div v-if="profile?.achievements?.length > 0" class="flex-none w-28 bg-surface-container-high rounded-3xl p-4 flex flex-col items-center justify-center border border-surface-variant opacity-60">
            <div class="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-2">
              <span class="material-symbols-outlined text-text-muted">lock</span>
            </div>
            <span class="font-label-md text-label-md text-text-muted text-center">Misteri</span>
          </div>
        </div>
      </section>

      <!-- Menu List -->
      <section class="flex flex-col gap-2 bg-white rounded-4xl p-2 border border-surface-variant shadow-[0px_4px_20px_rgba(16,37,27,0.05)]">
        <button class="flex items-center justify-between w-full p-4 rounded-3xl hover:bg-surface-container-low transition-colors text-left group">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-background-mint flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <span class="material-symbols-outlined">person</span>
            </div>
            <span class="font-body-lg text-body-lg text-on-surface font-semibold">Sunting Profil</span>
          </div>
          <span class="material-symbols-outlined text-text-muted">chevron_right</span>
        </button>
        <button class="flex items-center justify-between w-full p-4 rounded-3xl hover:bg-surface-container-low transition-colors text-left group">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-background-mint flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <span class="material-symbols-outlined">notifications</span>
            </div>
            <span class="font-body-lg text-body-lg text-on-surface font-semibold">Pengaturan Notifikasi</span>
          </div>
          <span class="material-symbols-outlined text-text-muted">chevron_right</span>
        </button>
        <button class="flex items-center justify-between w-full p-4 rounded-3xl hover:bg-surface-container-low transition-colors text-left group">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-background-mint flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <span class="material-symbols-outlined">help</span>
            </div>
            <span class="font-body-lg text-body-lg text-on-surface font-semibold">Pusat Bantuan</span>
          </div>
          <span class="material-symbols-outlined text-text-muted">chevron_right</span>
        </button>
        <button @click="handleLogout" class="flex items-center justify-between w-full p-4 rounded-3xl hover:bg-error-container transition-colors text-left group mt-2 border-t border-surface-variant pt-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error group-hover:bg-error group-hover:text-white transition-colors">
              <span class="material-symbols-outlined">logout</span>
            </div>
            <span class="font-body-lg text-body-lg text-error font-semibold">Keluar</span>
          </div>
        </button>
      </section>
    </main>
  </MainLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import { useAuth } from '../composables/useAuth'
import { useModules } from '../composables/useModules'
import { useProfile } from '../composables/useProfile'

const router = useRouter()
const { user, logout } = useAuth()
const { modules, fetchModules } = useModules()
const { profile, fetchProfile, loading: profileLoading } = useProfile()

// Using real profile from Supabase now. We provide a default if loading or no profile.
// The template already uses profile?.display_name etc.

const completedCount = computed(() => {
  if (!modules.value) return 0;
  return modules.value.filter(m => m.status === 'completed').length;
})

onMounted(async () => {
  fetchModules()
  if (user.value?.id) {
    await fetchProfile(user.value.id)
  }
})

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
/* Hide scrollbar for horizontal scroll areas */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
