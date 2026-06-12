<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'
import { BookOpen, Trophy, BarChart3, LogOut, ArrowRight } from 'lucide-vue-next'

const router = useRouter()

const modules = ref([
  {
    id: 1,
    title: 'pengertian investasi',
    description: 'kenali perbedaan menabung dan investasi, compound interest, inflasi, dan tujuan keuangan.',
    progress: 100
  },
  {
    id: 2,
    title: 'saham',
    description: 'pelajari dasar saham, IHSG, cara kerja bursa, lot, harga, capital gain, dan dividen.',
    progress: 40
  },
  {
    id: 3,
    title: 'reksadana',
    description: 'pahami jenis reksadana, NAB, dan peran manajer investasi untuk pemula.',
    progress: 0
  }
])

const completedModules = computed(() => modules.value.filter(module => module.progress === 100).length)

const averageProgress = computed(() => {
  const total = modules.value.reduce((sum, module) => sum + module.progress, 0)
  return Math.round(total / modules.value.length)
})

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface font-body-md">
    <header class="px-5 py-5 flex items-center justify-between border-b border-outline-variant/40">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-on-surface-variant">sma invest</p>
        <h1 class="text-2xl font-display-lg text-primary mt-1">learning dashboard</h1>
      </div>

      <button
        @click="logout"
        class="h-10 w-10 rounded-full border border-outline-variant/60 grid place-items-center text-on-surface-variant hover:text-primary transition"
        aria-label="logout"
      >
        <LogOut :size="18" />
      </button>
    </header>

    <main class="px-5 py-6 max-w-3xl mx-auto">
      <section class="rounded-[2rem] bg-primary text-on-primary p-6 shadow-sm">
        <p class="text-sm opacity-80">selamat datang</p>
        <h2 class="text-3xl font-display-lg mt-2">mulai belajar investasi dari dasar.</h2>
        <p class="mt-4 text-sm opacity-80">
          selesaikan modul, jawab quiz singkat, dan pantau progres belajarmu.
        </p>
      </section>

      <section class="grid grid-cols-2 gap-3 mt-5">
        <div class="rounded-3xl bg-surface-container-lowest border border-outline-variant/50 p-4">
          <BarChart3 class="text-primary mb-3" :size="22" />
          <p class="text-2xl font-semibold">{{ averageProgress }}%</p>
          <p class="text-sm text-on-surface-variant">average progress</p>
        </div>

        <div class="rounded-3xl bg-surface-container-lowest border border-outline-variant/50 p-4">
          <Trophy class="text-primary mb-3" :size="22" />
          <p class="text-2xl font-semibold">{{ completedModules }}/{{ modules.length }}</p>
          <p class="text-sm text-on-surface-variant">modules completed</p>
        </div>
      </section>

      <section class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-on-surface-variant">modules</p>
            <h2 class="text-xl font-display-lg text-primary">learning path</h2>
          </div>
        </div>

        <div class="space-y-4">
          <article
            v-for="module in modules"
            :key="module.id"
            class="rounded-[1.75rem] bg-surface-container-lowest border border-outline-variant/50 p-5"
          >
            <div class="flex gap-4">
              <div class="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center shrink-0">
                <BookOpen :size="22" />
              </div>

              <div class="flex-1">
                <h3 class="text-lg font-semibold text-primary capitalize">{{ module.title }}</h3>
                <p class="text-sm text-on-surface-variant mt-1">{{ module.description }}</p>

                <div class="mt-4">
                  <div class="h-2 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      class="h-full rounded-full bg-primary"
                      :style="{ width: `${module.progress}%` }"
                    ></div>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-2">{{ module.progress }}% completed</p>
                </div>

                <button
                  @click="router.push('/modules')"
                  class="mt-4 inline-flex items-center gap-2 text-sm font-label-caps tracking-widest text-primary"
                >
                  open module
                  <ArrowRight :size="15" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>