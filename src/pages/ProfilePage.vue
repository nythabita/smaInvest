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
        <!-- Sunting Profil -->
        <div class="flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300">
          <button @click="toggleSection('edit_profile')" class="flex items-center justify-between w-full p-4 hover:bg-surface-container-low transition-colors text-left group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-background-mint flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined">person</span>
              </div>
              <span class="font-body-lg text-body-lg text-on-surface font-semibold">Sunting Profil</span>
            </div>
            <span class="material-symbols-outlined text-text-muted transition-transform duration-300" :class="{'rotate-90': expandedSection === 'edit_profile'}">chevron_right</span>
          </button>
          
          <div v-if="expandedSection === 'edit_profile'" class="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <div class="flex flex-col gap-4 mt-2 border-t border-surface-variant pt-4">
              <div>
                <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Nama Lengkap</label>
                <input v-model="editForm.displayName" type="text" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface transition-colors" />
              </div>
              <div>
                <label class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Tingkat Pendidikan</label>
                <select v-model="editForm.grade" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface transition-colors">
                  <option value="Kelas 10">Kelas 10</option>
                  <option value="Kelas 11">Kelas 11</option>
                  <option value="Kelas 12">Kelas 12</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <button @click="saveProfile" :disabled="savingProfile" class="w-full bg-primary text-white font-bold rounded-xl py-3 mt-1 hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                <span v-if="savingProfile" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Simpan Perubahan</span>
              </button>
              <p v-if="saveMessage" class="text-success text-xs text-center font-semibold">{{ saveMessage }}</p>
            </div>
          </div>
        </div>
        <!-- Pengaturan Notifikasi -->
        <div class="flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300">
          <button @click="toggleSection('notifications')" class="flex items-center justify-between w-full p-4 hover:bg-surface-container-low transition-colors text-left group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-background-mint flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined">notifications</span>
              </div>
              <span class="font-body-lg text-body-lg text-on-surface font-semibold">Pengaturan Notifikasi</span>
            </div>
            <span class="material-symbols-outlined text-text-muted transition-transform duration-300" :class="{'rotate-90': expandedSection === 'notifications'}">chevron_right</span>
          </button>
          
          <div v-if="expandedSection === 'notifications'" class="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <div class="flex flex-col gap-4 mt-2 border-t border-surface-variant pt-4">
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-sm text-on-surface-variant font-medium">Notifikasi Modul Baru</span>
                <input type="checkbox" checked class="form-checkbox rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant/50 transition-colors">
              </label>
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-sm text-on-surface-variant font-medium">Pengingat Belajar Harian</span>
                <input type="checkbox" checked class="form-checkbox rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant/50 transition-colors">
              </label>
            </div>
          </div>
        </div>
        <!-- Pusat Bantuan -->
        <div class="flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300">
          <button @click="toggleSection('help')" class="flex items-center justify-between w-full p-4 hover:bg-surface-container-low transition-colors text-left group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-background-mint flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined">help</span>
              </div>
              <span class="font-body-lg text-body-lg text-on-surface font-semibold">Pusat Bantuan</span>
            </div>
            <span class="material-symbols-outlined text-text-muted transition-transform duration-300" :class="{'rotate-90': expandedSection === 'help'}">chevron_right</span>
          </button>
          
          <div v-if="expandedSection === 'help'" class="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <div class="flex flex-col gap-3 mt-2 border-t border-surface-variant pt-4 bg-surface-container-low rounded-xl p-4">
              <p class="text-sm text-on-surface-variant leading-relaxed">Punya pertanyaan atau butuh bantuan terkait penggunaan aplikasi SMA Invest?</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="material-symbols-outlined text-primary text-[20px]">mail</span>
                <a href="mailto:support@smainvest.com" class="text-primary font-bold text-sm hover:underline">support@smainvest.com</a>
              </div>
            </div>
          </div>
        </div>
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
import { computed, onMounted, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import { useAuth } from '../composables/useAuth'
import { useModules } from '../composables/useModules'
import { useProfile } from '../composables/useProfile'

const router = useRouter()
const { user, logout } = useAuth()
const { modules, fetchModules } = useModules()
const { profile, fetchProfile, updateProfile, loading: profileLoading } = useProfile()

// Using real profile from Supabase now. We provide a default if loading or no profile.
// The template already uses profile?.display_name etc.

const completedCount = computed(() => {
  if (!modules.value) return 0;
  return modules.value.filter(m => m.status === 'completed').length;
})

const expandedSection = ref('')
const savingProfile = ref(false)
const saveMessage = ref('')

const editForm = reactive({
  displayName: '',
  grade: ''
})

watch(profile, (newProfile) => {
  if (newProfile) {
    editForm.displayName = newProfile.display_name || ''
    editForm.grade = newProfile.grade || ''
  }
})

const toggleSection = (section) => {
  if (expandedSection.value === section) {
    expandedSection.value = ''
  } else {
    expandedSection.value = section
    if (section === 'edit_profile' && profile.value) {
      editForm.displayName = profile.value.display_name || ''
      editForm.grade = profile.value.grade || ''
      saveMessage.value = ''
    }
  }
}

const saveProfile = async () => {
  if (!user.value?.id) return
  
  savingProfile.value = true
  saveMessage.value = ''
  try {
    await updateProfile(user.value.id, {
      display_name: editForm.displayName,
      grade: editForm.grade
    })
    saveMessage.value = 'Profil berhasil diperbarui!'
    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    savingProfile.value = false
  }
}

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
