<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Loader2, Trash2, CalendarDays } from 'lucide-vue-next'
import { 
  closetItems, 
  state, 
  updateSliderStatus, 
  isLoadingCloset, 
  initClosetAuthListener, 
  deleteItem, 
  savedOutfits, 
  isLoadingOutfits 
} from '../store/closet.js'

onMounted(() => {
  initClosetAuthListener()
})

const router = useRouter()

const categories = ['headwear', 'tops', 'bottoms']
const activeTab = ref('closet') // 'closet' | 'outfits'

const hasItems = computed(() => closetItems.value.length > 0)
const hasOutfits = computed(() => savedOutfits.value.length > 0)

const isInSlider = (item) => {
  return item.inSlider === true
}

const toggleSlider = async (item) => {
  item.inSlider = !item.inSlider
  if (item.inSlider) {
    const layer = state.find(l => l.key === item.category)
    if (layer) {
      layer.activeIndex = layer.items.length - (layer.items.includes(item) ? 1 : 0)
    }
  }

  if (item.firestoreId) {
    try {
      await updateSliderStatus(item.firestoreId, item.inSlider)
    } catch (err) {
      console.error('Failed to update slider status:', err)
      item.inSlider = !item.inSlider
    }
  }
}

const handleDeleteItem = async (item) => {
  if (confirm(`Are you sure you want to delete "${item.label}" from your closet?`)) {
    try {
      await deleteItem(item)
    } catch (err) {
      console.error('Failed to delete item:', err)
      alert('Failed to delete item. Please try again.')
    }
  }
}

const formatDate = (dateValue) => {
  if (!dateValue) return ''
  const d = dateValue.toDate ? dateValue.toDate() : new Date(dateValue)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface font-body-md">
    <!-- Header -->
    <header class="sticky top-0 z-30 backdrop-blur-md bg-surface/80 border-b border-outline-variant/30">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <button @click="router.push('/dashboard')" class="press flex items-center gap-2 text-primary hover:opacity-80 transition font-medium">
          <ArrowLeft :size="18" />
          Back to Dashboard
        </button>
      </div>
    </header>

    <main class="pt-8 pb-24">
      <div class="mx-auto max-w-5xl px-5 sm:px-8">
        <div class="mb-8 text-center sm:text-left">
          <p class="font-label-caps tracking-[0.18em] text-secondary">YOUR COLLECTION</p>
          <h1 class="mt-2 font-headline-md text-3xl sm:text-4xl tracking-tight text-primary">Wardrobe</h1>
          <p class="mt-3 text-on-surface-variant max-w-2xl">Manage your clothing items and view your saved outfit combinations.</p>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-10 p-1 bg-surface-container rounded-full max-w-sm mx-auto sm:mx-0">
          <button
            @click="activeTab = 'closet'"
            :class="[
              'flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
              activeTab === 'closet'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            ]"
          >
            Closet
          </button>
          <button
            @click="activeTab = 'outfits'"
            :class="[
              'flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
              activeTab === 'outfits'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            ]"
          >
            Saved Outfits
          </button>
        </div>

        <!-- ───────────────────────── CLOSET TAB ───────────────────────── -->
        <div v-if="activeTab === 'closet'">

        <div v-if="isLoadingCloset" class="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-4">
          <Loader2 class="animate-spin w-8 h-8 text-primary" />
          <p class="text-sm font-medium">Loading closet...</p>
        </div>

        <div v-else-if="!hasItems" class="text-center py-16 rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container">
          <p class="text-on-surface-variant">Your closet is empty. Go back to the dashboard to add items!</p>
        </div>

        <div v-else class="space-y-12">
          <!-- Group by category -->
          <div v-for="cat in categories" :key="cat" v-show="closetItems.some(i => i.category === cat)">
            <h3 class="font-headline-md text-xl mb-4 capitalize flex items-center gap-2 text-primary">
              <span class="w-2 h-2 rounded-full bg-secondary"></span> {{ cat }}
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              <div v-for="item in closetItems.filter(i => i.category === cat)" :key="item.id" class="relative aspect-[3/4] bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-3 flex flex-col items-center hover:shadow-md transition-shadow group">
                 
                 <!-- Delete Button -->
                 <button 
                   v-if="!item.isDefault"
                   @click="handleDeleteItem(item)"
                   class="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container/80 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-secondary/10 transition-colors z-10 opacity-0 group-hover:opacity-100"
                   title="Delete item"
                 >
                   <Trash2 :size="14" />
                 </button>

                 <div class="w-full h-full relative mb-2 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center">
                   <img :src="item.image" class="w-[85%] h-[85%] object-cover rounded-xl" />
                 </div>
                 <p class="text-xs font-medium text-primary truncate w-full text-center mt-auto">{{ item.label }}</p>
                 <div class="mt-2 w-full">
                   <button v-if="isInSlider(item)" @click="toggleSlider(item)" class="text-[10px] uppercase tracking-wider text-secondary text-center font-bold bg-secondary/10 hover:bg-secondary/20 py-1.5 rounded-lg w-full transition">
                     ✓ In Slider
                   </button>
                   <button v-else @click="toggleSlider(item)" class="text-[10px] uppercase tracking-wider text-on-primary text-center font-bold bg-primary hover:bg-primary/90 py-1.5 rounded-lg w-full transition">
                     + Add to Slider
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- ───────────────────────── SAVED OUTFITS TAB ───────────────────────── -->
        <div v-else-if="activeTab === 'outfits'">
          <div v-if="isLoadingOutfits" class="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-4">
            <Loader2 class="animate-spin w-8 h-8 text-primary" />
            <p class="text-sm font-medium">Loading outfits...</p>
          </div>

          <div v-else-if="!hasOutfits" class="text-center py-16 rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container">
            <p class="text-on-surface-variant">You haven't saved any outfits yet. Mix and match in the Dashboard to save your favorite looks!</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="outfit in savedOutfits" :key="outfit.id" class="editorial-card p-5 group hover:border-primary/30 transition-colors">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-headline-md text-xl text-primary truncate pr-4">{{ outfit.name }}</h3>
                <div class="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-on-surface-variant shrink-0">
                  <CalendarDays :size="12" />
                  <span>{{ formatDate(outfit.createdAt) }}</span>
                </div>
              </div>
              
              <!-- Outfit Items Preview -->
              <div class="grid grid-cols-3 gap-2 bg-surface-container rounded-2xl p-3 border border-outline-variant/30">
                <div v-for="(item, idx) in outfit.items" :key="idx" class="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center p-1">
                  <img v-if="item.image" :src="item.image" class="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
