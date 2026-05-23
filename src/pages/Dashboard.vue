<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Sparkles,
  Shuffle,
  Lock,
  LockOpen,
  ArrowRight,
} from 'lucide-vue-next'
import OutfitItem from '../components/OutfitItem.vue'
import CameraCapture from '../components/CameraCapture.vue'
import LAYERS from '../data/outfits.js'

import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'

const router = useRouter()

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

/* -------------------------------------------------------------------------- */
/*  Reactive state                                                            */
/* -------------------------------------------------------------------------- */

// One entry per layer: active index + lock state
const state = reactive(
  LAYERS.map((layer) => ({
    key: layer.key,
    label: layer.label,
    items: layer.items,
    activeIndex: Math.floor(layer.items.length / 2),
    locked: false
  }))
)

// Refs to each scroll rail DOM node
const railRefs = ref([])
const setRailRef = (el, i) => {
  if (el) railRefs.value[i] = el
}

// CAMERA & CLOSET STATE
const showCamera = ref(false)
const selectedCategory = ref('tops')
const customName = ref('')
const pendingCapturedImage = ref(null)
const closetItems = ref([])

/* -------------------------------------------------------------------------- */
/*  Slider mechanics                                                          */
/* -------------------------------------------------------------------------- */

// Compute which item is closest to the center of the rail
function updateActiveFromScroll(layerIdx) {
  const rail = railRefs.value[layerIdx]
  if (!rail) return
  const center = rail.scrollLeft + rail.clientWidth / 2
  const children = rail.children
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const childCenter = child.offsetLeft + child.offsetWidth / 2
    const dist = Math.abs(childCenter - center)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  if (state[layerIdx].activeIndex !== best) {
    state[layerIdx].activeIndex = best
  }
}

// rAF-throttled scroll handler
function onScroll(layerIdx) {
  const ticking = scrollTickets[layerIdx]
  if (ticking) return
  scrollTickets[layerIdx] = requestAnimationFrame(() => {
    updateActiveFromScroll(layerIdx)
    scrollTickets[layerIdx] = null
  })
}
const scrollTickets = {}

// Smoothly scroll a layer to a specific item index
function scrollToIndex(layerIdx, itemIdx, behavior = 'smooth') {
  const rail = railRefs.value[layerIdx]
  if (!rail) return
  const target = rail.children[itemIdx]
  if (!target) return
  const left = target.offsetLeft - (rail.clientWidth - target.offsetWidth) / 2
  rail.scrollTo({ left, behavior })
}

// Tap an item to center it
function selectItem(layerIdx, itemIdx) {
  scrollToIndex(layerIdx, itemIdx)
}

// Lock toggle
function toggleLock(layerIdx) {
  state[layerIdx].locked = !state[layerIdx].locked
}

/* -------------------------------------------------------------------------- */
/*  Shuffle (the signature interaction)                                       */
/* -------------------------------------------------------------------------- */

const isShuffling = ref(false)

async function shuffleOutfit() {
  if (isShuffling.value) return
  isShuffling.value = true

  // Pick a random target index for each UNLOCKED layer, biased away from current
  state.forEach((layer, i) => {
    if (layer.locked) return
    const n = layer.items.length
    if (n <= 1) return
    let next = layer.activeIndex
    let tries = 0
    while (next === layer.activeIndex && tries < 6) {
      next = Math.floor(Math.random() * n)
      tries++
    }
    // Stagger the scrolls a little so each rail glides in sequence — feels intentional
    setTimeout(() => scrollToIndex(i, next), i * 90)
  })

  // Brief lock so users don't spam
  setTimeout(() => { isShuffling.value = false }, 650)
}

/* -------------------------------------------------------------------------- */
/*  Reveal-on-scroll (lightweight IntersectionObserver)                       */
/* -------------------------------------------------------------------------- */

let io
onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      })
    },
    { threshold: 0.15 }
  )
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

  // Center each rail to its initial active item without animation
  nextTick(() => {
    state.forEach((_, i) => scrollToIndex(i, state[i].activeIndex, 'auto'))
  })
})

onBeforeUnmount(() => {
  io && io.disconnect()
  Object.values(scrollTickets).forEach((id) => id && cancelAnimationFrame(id))
})

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const currentOutfit = computed(() =>
  state.map((l) => l.items[l.activeIndex]?.label).filter(Boolean).join(' · ')
)

function saveToCloset() {
  if (!pendingCapturedImage.value) return

  const itemLabel = customName.value || `My ${selectedCategory.value}`
  
  const newItem = {
    id: Date.now(),
    label: itemLabel,
    category: selectedCategory.value,
    meta: "captured",
    tint: "rgba(255,255,255,0.25)",
    image: pendingCapturedImage.value,
    createdAt: new Date().toISOString()
  }

  // Add to Closet
  closetItems.value.push(newItem)

  // Add to Slider
  const layerIndex = state.findIndex(l => l.key === selectedCategory.value)
  if (layerIndex !== -1) {
    state[layerIndex].items.push(newItem)
    const newIndex = state[layerIndex].items.length - 1
    state[layerIndex].activeIndex = newIndex
    nextTick(() => {
      scrollToIndex(layerIndex, newIndex)
    })
  }

  // Reset and close
  pendingCapturedImage.value = null
  customName.value = ''
  toggleCamera()
}

function toggleCamera() {
  showCamera.value = !showCamera.value
  if (!showCamera.value) {
    pendingCapturedImage.value = null
    customName.value = ''
  }
}

</script>

<template>
  <div class="min-h-screen overflow-x-hidden">
    <!-- ─────────────────────────  NAV  ───────────────────────── -->
    <header class="sticky top-0 z-30 backdrop-blur-md bg-cream/70 border-b border-espresso/5">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <button @click="router.push('/')" class="flex items-center gap-2.5 hover:opacity-80 transition">
            <div class="h-9 w-9 rounded-xl bg-tan text-cream grid place-items-center shadow-soft">
              <Sparkles :size="18" />
            </div>
            <span class="font-display text-lg sm:text-xl tracking-tight">VirtualCloset</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="shuffleOutfit"
            :disabled="isShuffling"
            class="press group inline-flex items-center gap-2 rounded-full bg-espresso text-cream px-4 py-2 text-sm font-medium shadow-soft hover:shadow-card hover:bg-espresso-soft disabled:opacity-60"
          >
            <Shuffle :size="14" :class="['transition-transform duration-500 ease-silk', isShuffling ? 'rotate-180' : 'group-hover:rotate-12']" />
            Shuffle
          </button>
          <button
            @click="toggleCamera"
            class="press inline-flex items-center gap-2 rounded-full bg-tan text-espresso px-4 py-2 text-sm font-medium shadow-soft hover:shadow-card hover:bg-tan-soft"
          >
            Open Camera
          </button>
          <button
            @click="handleLogout"
            class="press inline-flex items-center gap-2 rounded-full bg-cream border border-espresso/10 text-espresso px-4 py-2 text-sm font-medium shadow-soft hover:bg-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- CAMERA OVERLAY -->
    <div v-if="showCamera" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div class="relative max-w-sm w-full mx-4">
        <button
          @click="toggleCamera"
          class="absolute -top-10 right-0 text-white text-xl"
        >
          ✕
        </button>

        <template v-if="!pendingCapturedImage">
          <!-- Capture Mode -->
          <CameraCapture
            @capture="(imageData) => {
              pendingCapturedImage = imageData
            }"
          />
        </template>
        
        <template v-else>
          <!-- Preview & Approve Mode -->
          <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-card">
            <h3 class="font-display text-xl text-espresso mb-4 text-center">Add to Closet</h3>
            
            <div class="aspect-[3/4] w-full rounded-2xl overflow-hidden mb-5 bg-espresso/5 flex items-center justify-center border border-espresso/10">
              <img :src="pendingCapturedImage" class="w-[85%] h-[85%] object-cover rounded-xl shadow-sm" />
            </div>

            <input
              v-model="customName"
              type="text"
              placeholder="Name this item..."
              class="w-full mb-4 px-4 py-3 rounded-xl border border-espresso/10 bg-cream text-espresso outline-none focus:ring-2 focus:ring-tan"
            />

            <div class="flex justify-center gap-2 mb-6">
              <button
                @click="selectedCategory = 'headwear'"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition',
                  selectedCategory === 'headwear' ? 'bg-tan text-white' : 'bg-cream text-espresso-soft hover:bg-beige'
                ]"
              >
                Headwear
              </button>
              <button
                @click="selectedCategory = 'tops'"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition',
                  selectedCategory === 'tops' ? 'bg-tan text-white' : 'bg-cream text-espresso-soft hover:bg-beige'
                ]"
              >
                Top
              </button>
              <button
                @click="selectedCategory = 'bottoms'"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition',
                  selectedCategory === 'bottoms' ? 'bg-tan text-white' : 'bg-cream text-espresso-soft hover:bg-beige'
                ]"
              >
                Bottom
              </button>
            </div>

            <div class="flex gap-3">
              <button
                @click="pendingCapturedImage = null"
                class="flex-1 px-4 py-3 rounded-full bg-cream text-espresso font-semibold hover:bg-beige transition"
              >
                Retake
              </button>
              <button
                @click="saveToCloset"
                class="flex-1 px-4 py-3 rounded-full bg-espresso text-cream font-semibold hover:bg-espresso-soft transition"
              >
                Save to Closet
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
 

    <!-- ─────────────────────────  CLUELESS SLIDER  ───────────────────────── -->
    <section id="clueless" class="relative py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-5 sm:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div class="reveal">
            <p class="text-xs uppercase tracking-[0.18em] text-tan font-semibold">Signature feature</p>
            <h2 class="mt-2 font-display text-3xl sm:text-5xl tracking-tight">The Clueless Slider</h2>
            <p class="mt-3 max-w-xl text-espresso-soft">Three layers. Independent control. Lock what you love, shuffle the rest. Built to feel like a styling tool — not a carousel.</p>
          </div>

          <div class="reveal flex items-center gap-2">
            <button
              @click="shuffleOutfit"
              :disabled="isShuffling"
              class="press group inline-flex items-center gap-2 rounded-full bg-tan text-cream px-5 py-3 text-sm font-semibold shadow-glow hover:bg-[#B58A5E] disabled:opacity-60"
            >
              <Shuffle
                :size="16"
                :class="['transition-transform duration-500 ease-silk', isShuffling ? 'rotate-180 scale-110' : 'group-hover:rotate-12']"
              />
              Shuffle Outfit
            </button>
          </div>
        </div>

        <!-- Slider & Preview Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Sliders (8 columns on large screens) -->
          <div class="lg:col-span-7 space-y-5">
            <div
              v-for="(layer, idx) in state"
              :key="layer.key"
              class="reveal rounded-3xl bg-white/60 backdrop-blur-sm border border-espresso/5 shadow-soft overflow-hidden"
            >
              <!-- Header row -->
              <div class="flex items-center justify-between px-5 sm:px-6 pt-4">
                <div class="flex items-center gap-3">
                  <span class="grid place-items-center h-7 w-7 rounded-full bg-beige text-espresso text-xs font-semibold">{{ idx + 1 }}</span>
                  <h3 class="font-display text-lg sm:text-xl">{{ layer.label }}</h3>
                  <span class="hidden sm:inline text-xs text-espresso-soft">· {{ layer.items[layer.activeIndex]?.label }}</span>
                </div>

                <button
                  @click="toggleLock(idx)"
                  :aria-pressed="layer.locked"
                  :class="[
                    'press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors duration-300',
                    layer.locked
                      ? 'bg-espresso text-cream border-espresso shadow-soft'
                      : 'bg-cream text-espresso-soft border-espresso/10 hover:border-tan/50 hover:text-espresso'
                  ]"
                >
                  <component :is="layer.locked ? Lock : LockOpen" :size="13" />
                  {{ layer.locked ? 'Locked' : 'Lock' }}
                </button>
              </div>

              <!-- The rail -->
              <div class="relative mt-3 pb-5">
                <!-- Center indicator -->
                <div class="pointer-events-none absolute inset-y-3 left-1/2 -translate-x-1/2 w-[clamp(140px,22vw,210px)] rounded-3xl ring-1 ring-tan/30 ring-offset-0"></div>

                <div
                  :ref="el => setRailRef(el, idx)"
                  @scroll="onScroll(idx)"
                  class="snap-rail no-scrollbar fade-edges flex gap-4 overflow-x-auto px-[max(50%-105px,1rem)] sm:px-[max(50%-110px,1.5rem)]"
                >
                  <button
                    v-for="(item, i) in layer.items"
                    :key="item.id"
                    @click="selectItem(idx, i)"
                    :aria-label="`Select ${item.label}`"
                    class="lift shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-tan rounded-3xl"
                    :class="[
                      'w-[clamp(140px,22vw,210px)] aspect-[3/4]',
                      layer.activeIndex === i
                        ? 'scale-[1.04] shadow-card'
                        : 'scale-[0.92] opacity-70 hover:opacity-100 hover:scale-[0.98]'
                    ]"
                  >
                    <OutfitItem :item="item" :active="layer.activeIndex === i" />
                  </button>
                </div>

                <!-- Dots -->
                <div class="mt-3 flex justify-center gap-1.5">
                  <span
                    v-for="(item, i) in layer.items"
                    :key="item.id + '-dot'"
                    :class="[
                      'h-1.5 rounded-full transition-all duration-500 ease-silk',
                      layer.activeIndex === i ? 'w-6 bg-tan' : 'w-1.5 bg-espresso/15'
                    ]"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Live Preview Stack (5 columns on large screens, sticky on scroll) -->
          <div class="lg:col-span-5 order-first lg:order-last lg:sticky lg:top-24 space-y-6">
            <div class="reveal relative w-full max-w-[280px] sm:max-w-sm mx-auto aspect-[3/4] rounded-[2.5rem] bg-gradient-to-b from-white/80 to-beige/50 backdrop-blur-sm shadow-card overflow-hidden border border-white p-4">
              <!-- Stack of items -->
              <div class="absolute inset-0 grid grid-rows-3 gap-2 p-3 pb-16">
                <div class="relative w-full h-full">
                  <OutfitItem v-if="state[0] && state[0].items[state[0].activeIndex]" :item="state[0].items[state[0].activeIndex]" :active="false" flat />
                </div>
                <div class="relative w-full h-full scale-[1.05] z-10 drop-shadow-md">
                  <OutfitItem v-if="state[1] && state[1].items[state[1].activeIndex]" :item="state[1].items[state[1].activeIndex]" :active="true" flat />
                </div>
                <div class="relative w-full h-full">
                  <OutfitItem v-if="state[2] && state[2].items[state[2].activeIndex]" :item="state[2].items[state[2].activeIndex]" :active="false" flat />
                </div>
              </div>
              
              <!-- Bottom floating badge -->
              <div class="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 backdrop-blur-md px-4 py-3 text-xs text-espresso-soft border border-white shadow-soft flex items-center justify-between">
                <div>
                  <span class="font-semibold text-espresso block">Live Look</span>
                  <span class="opacity-80 text-[10px] uppercase tracking-wider mt-0.5 block truncate max-w-[150px] sm:max-w-[200px]">{{ currentOutfit }}</span>
                </div>
                <div class="h-8 w-8 rounded-full bg-tan/10 grid place-items-center text-tan">
                  <Sparkles :size="14" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Current outfit summary -->
        <div class="reveal mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl bg-beige/70 border border-espresso/5 px-5 sm:px-7 py-5">
          <div>
            <p class="text-xs uppercase tracking-[0.18em] text-tan font-semibold">Your look</p>
            <p class="mt-1 font-display text-xl">{{ currentOutfit }}</p>
          </div>
          <button
            @click="shuffleOutfit"
            class="press inline-flex items-center gap-2 rounded-full bg-espresso text-cream px-5 py-3 text-sm font-semibold shadow-soft hover:bg-espresso-soft"
          >
            <Shuffle :size="14" />
            Try another mix
          </button>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  MY CLOSET  ───────────────────────── -->
    <section id="closet" class="relative py-16 sm:py-24 bg-gradient-to-b from-cream to-white border-t border-espresso/5">
      <div class="mx-auto max-w-7xl px-5 sm:px-8">
        <div class="mb-10 text-center sm:text-left reveal">
          <p class="text-xs uppercase tracking-[0.18em] text-tan font-semibold">Your Collection</p>
          <h2 class="mt-2 font-display text-3xl sm:text-4xl tracking-tight text-espresso">My Closet</h2>
          <p class="mt-3 text-espresso-soft max-w-2xl">Approved items that you have saved. They are automatically added to your Clueless Slider for mixing.</p>
        </div>

        <div v-if="closetItems.length === 0" class="reveal text-center py-16 rounded-3xl border border-dashed border-espresso/20 bg-white/50">
          <p class="text-espresso-soft">Your closet is empty. Open the camera to add items!</p>
        </div>

        <div v-else class="space-y-12 reveal">
          <!-- Group by category -->
          <div v-for="cat in ['headwear', 'tops', 'bottoms']" :key="cat" v-show="closetItems.some(i => i.category === cat)">
            <h3 class="font-display text-xl mb-4 capitalize flex items-center gap-2 text-espresso">
              <span class="w-2 h-2 rounded-full bg-tan"></span> {{ cat }}
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              <div v-for="item in closetItems.filter(i => i.category === cat)" :key="item.id" class="aspect-[3/4] bg-white rounded-2xl shadow-sm border border-espresso/5 p-3 flex flex-col items-center hover:shadow-card transition-shadow">
                 <div class="w-full h-full relative mb-2 rounded-xl overflow-hidden bg-espresso/5 flex items-center justify-center">
                   <img :src="item.image" class="w-[85%] h-[85%] object-cover rounded-xl" />
                 </div>
                 <p class="text-xs font-medium text-espresso truncate w-full text-center">{{ item.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
