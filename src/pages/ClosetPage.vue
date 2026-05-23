<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { closetItems, state } from '../store/closet.js'

const router = useRouter()

const categories = ['headwear', 'tops', 'bottoms']

const hasItems = computed(() => closetItems.value.length > 0)

const isInSlider = (item) => {
  const layer = state.find(l => l.key === item.category)
  return layer && layer.items.some(i => i.id === item.id)
}

const addToSlider = (item) => {
  const layer = state.find(l => l.key === item.category)
  if (layer && !layer.items.some(i => i.id === item.id)) {
    layer.items.push(item)
    // Make it the active item
    layer.activeIndex = layer.items.length - 1
  }
}
</script>

<template>
  <div class="min-h-screen bg-cream/30 text-espresso font-sans">
    <!-- Header -->
    <header class="sticky top-0 z-30 backdrop-blur-md bg-cream/70 border-b border-espresso/5">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <button @click="router.push('/dashboard')" class="press flex items-center gap-2 text-espresso hover:opacity-80 transition font-medium">
          <ArrowLeft :size="18" />
          Back to Dashboard
        </button>
      </div>
    </header>

    <main class="pt-8 pb-24">
      <div class="mx-auto max-w-5xl px-5 sm:px-8">
        <div class="mb-10 text-center sm:text-left">
          <p class="text-xs uppercase tracking-[0.18em] text-tan font-semibold">Your Collection</p>
          <h1 class="mt-2 font-display text-3xl sm:text-4xl tracking-tight text-espresso">My Closet</h1>
          <p class="mt-3 text-espresso-soft max-w-2xl">Approved items that you have saved. They are automatically added to your Clueless Slider for mixing.</p>
        </div>

        <div v-if="!hasItems" class="text-center py-16 rounded-3xl border border-dashed border-espresso/20 bg-white/50">
          <p class="text-espresso-soft">Your closet is empty. Go back to the dashboard to add items!</p>
        </div>

        <div v-else class="space-y-12">
          <!-- Group by category -->
          <div v-for="cat in categories" :key="cat" v-show="closetItems.some(i => i.category === cat)">
            <h3 class="font-display text-xl mb-4 capitalize flex items-center gap-2 text-espresso">
              <span class="w-2 h-2 rounded-full bg-tan"></span> {{ cat }}
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              <div v-for="item in closetItems.filter(i => i.category === cat)" :key="item.id" class="aspect-[3/4] bg-white rounded-2xl shadow-soft border border-espresso/5 p-3 flex flex-col items-center hover:shadow-card transition-shadow">
                 <div class="w-full h-full relative mb-2 rounded-xl overflow-hidden bg-espresso/5 flex items-center justify-center">
                   <img :src="item.image" class="w-[85%] h-[85%] object-cover rounded-xl" />
                 </div>
                 <p class="text-xs font-medium text-espresso truncate w-full text-center mt-auto">{{ item.label }}</p>
                 <div class="mt-2 w-full">
                   <div v-if="isInSlider(item)" class="text-[10px] uppercase tracking-wider text-tan text-center font-bold bg-tan/10 py-1.5 rounded-lg w-full">
                     ✓ In Slider
                   </div>
                   <button v-else @click="addToSlider(item)" class="text-[10px] uppercase tracking-wider text-white text-center font-bold bg-espresso hover:bg-espresso-soft py-1.5 rounded-lg w-full transition">
                     + Add to Slider
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
