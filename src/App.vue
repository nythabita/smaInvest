<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Sparkles,
  Shuffle,
  Lock,
  LockOpen,
  ArrowRight,
  Timer,
  CalendarDays,
  HeartCrack,
  ChevronRight
} from 'lucide-vue-next'
import OutfitItem from './components/OutfitItem.vue'
import CameraCapture from './components/CameraCapture.vue'
import LAYERS from './data/outfits.js'

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

// CAMERA STATE
const showCamera = ref(false)
const selectedCategory = ref('tops')
const customName = ref('')

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
/*  Count-up stats                                                            */
/* -------------------------------------------------------------------------- */

const STATS = [
  { key: 'frustration', value: 62, suffix: '%', label: 'of women feel daily outfit frustration', icon: HeartCrack },
  { key: 'minutes', value: 17, suffix: ' min', label: 'wasted every morning on "what to wear"', icon: Timer },
  { key: 'days', value: 4, suffix: ' days', label: 'lost per year just deciding outfits', icon: CalendarDays }
]
const statValues = reactive(Object.fromEntries(STATS.map((s) => [s.key, 0])))

function animateCount(key, target, duration = 1400) {
  const start = performance.now()
  const tick = (t) => {
    const p = Math.min((t - start) / duration, 1)
    // easeOutExpo
    const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
    statValues[key] = Math.round(target * eased)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const statsRef = ref(null)
onMounted(() => {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          STATS.forEach((s, i) => setTimeout(() => animateCount(s.key, s.value), i * 180))
          obs.disconnect()
        }
      })
    },
    { threshold: 0.4 }
  )
  if (statsRef.value) obs.observe(statsRef.value)
})

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const currentOutfit = computed(() =>
  state.map((l) => l.items[l.activeIndex]?.label).filter(Boolean).join(' · ')
)

function addCameraItem(imageData, targetLayer, customLabel) {
  const layerIndex = state.findIndex(l => l.key === targetLayer)

  if (layerIndex === -1) return

  state[layerIndex].items.push({
    id: Date.now(),
    label: `${customLabel} - ${targetLayer}`,
    meta: "",
    tint: "rgba(255,255,255,0.25)",
    image: imageData
  })

  const newIndex = state[layerIndex].items.length - 1

  state[layerIndex].activeIndex = newIndex

  nextTick(() => {
    scrollToIndex(layerIndex, newIndex)
  })
}

function startMixing() {
  document.getElementById('clueless')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function toggleCamera() {
  showCamera.value = !showCamera.value
  console.log(showCamera.value)
}

</script>

<template>
  <div class="min-h-screen overflow-x-hidden">
    <!-- ─────────────────────────  NAV  ───────────────────────── -->
    <header class="sticky top-0 z-30 backdrop-blur-md bg-cream/70 border-b border-espresso/5">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="h-9 w-9 rounded-xl bg-tan text-cream grid place-items-center shadow-soft">
            <Sparkles :size="18" />
          </div>
          <span class="font-display text-lg sm:text-xl tracking-tight">VirtualCloset</span>
        </div>
        <nav class="hidden md:flex items-center gap-8 text-sm text-espresso-soft">
          <a href="#clueless" class="hover:text-espresso transition">Clueless Slider</a>
          <a href="#impact" class="hover:text-espresso transition">Why it matters</a>
          <a href="#cta" class="hover:text-espresso transition">Start</a>
        </nav>
        <button
          @click="startMixing"
          class="press group inline-flex items-center gap-2 rounded-full bg-espresso text-cream px-4 py-2 text-sm font-medium shadow-soft hover:shadow-card hover:bg-espresso-soft"
        >
          Start Mixing
          <ArrowRight :size="14" class="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
        <button
          @click="toggleCamera"
          class="ml-2 press inline-flex items-center gap-2 rounded-full bg-tan text-espresso px-4 py-2 text-sm font-medium shadow-soft hover:bg-tan-soft"
>
          Open Camera
        </button>
      </div>
    </header>

    <!-- CAMERA OVERLAY -->
        <div v-if="showCamera" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div class="relative">
            <button
              @click="toggleCamera"
              class="absolute -top-10 right-0 text-white text-xl"
            >
              ✕
            </button>

           <!-- CATEGORY -->
            <input
  v-model="customName"
  type="text"
  placeholder="Outfit name..."
  class="w-full mb-4 px-4 py-2 rounded-xl border border-white/20 bg-white text-black outline-none"
/>

<div class="flex justify-center gap-2 mb-4">

  <button
    @click="selectedCategory = 'headwear'"
    :class="[
      'px-4 py-2 rounded-full transition',
      selectedCategory === 'headwear'
        ? 'bg-tan text-white'
        : 'bg-white text-black'
    ]"
  >
    Headwear
  </button>

  <button
    @click="selectedCategory = 'tops'"
    :class="[
      'px-4 py-2 rounded-full transition',
      selectedCategory === 'tops'
        ? 'bg-tan text-white'
        : 'bg-white text-black'
    ]"
  >
    Top
  </button>

  <button
    @click="selectedCategory = 'bottoms'"
    :class="[
      'px-4 py-2 rounded-full transition',
      selectedCategory === 'bottoms'
        ? 'bg-tan text-white'
        : 'bg-white text-black'
    ]"
  >
    Bottom
  </button>

</div>

            <CameraCapture
  @capture="(imageData) => {
    addCameraItem(imageData, selectedCategory, customName)
    customName = ''
    toggleCamera()
  }"
/>
          </div>
        </div>
 

    <!-- ─────────────────────────  HERO  ───────────────────────── -->
    <section class="relative">
      <!-- Decorative blobs -->
      <div class="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-tan/20 blur-3xl"></div>
      <div class="pointer-events-none absolute top-40 -right-24 h-[22rem] w-[22rem] rounded-full bg-beige/70 blur-3xl"></div>

      <div class="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-20 grid lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7">
          <div class="reveal inline-flex items-center gap-2 rounded-full bg-beige px-3 py-1 text-xs font-medium text-espresso-soft border border-espresso/5">
            <span class="h-1.5 w-1.5 rounded-full bg-tan animate-pulse"></span>
            A styling tool, not a closet
          </div>

          <h1 class="reveal mt-5 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
            VirtualCloset:
            <span class="block italic text-tan">The Clueless Experience.</span>
          </h1>

          <p class="reveal mt-6 max-w-xl text-base sm:text-lg text-espresso-soft leading-relaxed">
            <span class="font-semibold text-espresso">62%</span> of women struggle with daily outfit decisions.
            We turned the morning panic into a playful three-layer slider — mix, lock, and shuffle until it feels right.
          </p>

          <div class="reveal mt-8 flex flex-wrap items-center gap-3">
            <button
              @click="startMixing"
              class="press group relative inline-flex items-center gap-2 rounded-full bg-espresso text-cream pl-5 pr-4 py-3 text-sm font-semibold shadow-soft hover:shadow-card hover:bg-espresso-soft hover:scale-[1.02] transition-all duration-300 ease-silk"
            >
              <span>Start Mixing</span>
              <span class="grid place-items-center h-6 w-6 rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight :size="14" />
              </span>
            </button>
            <a href="#impact" class="text-sm text-espresso-soft hover:text-espresso transition inline-flex items-center gap-1">
              See the numbers
              <ChevronRight :size="14" />
            </a>
          </div>

          <!-- Trust row -->
          <div class="reveal mt-10 flex items-center gap-5 text-xs text-espresso-soft">
            <div class="flex -space-x-2">
              <div class="h-7 w-7 rounded-full ring-2 ring-cream bg-tan/80"></div>
              <div class="h-7 w-7 rounded-full ring-2 ring-cream bg-espresso/70"></div>
              <div class="h-7 w-7 rounded-full ring-2 ring-cream bg-beige border border-tan/30"></div>
            </div>
            <span>Loved by stylists, indecisive mornings, and lazy Sundays.</span>
          </div>
        </div>

        <!-- Hero stack preview -->
        <div class="lg:col-span-5 relative">
          <div class="reveal relative mx-auto w-full max-w-sm aspect-[4/5] rounded-4xl bg-gradient-to-b from-beige to-cream shadow-card overflow-hidden border border-espresso/5">
            <div class="absolute inset-0 grid grid-rows-3">
              <div class="grid place-items-center"><OutfitItem :item="state[0].items[state[0].activeIndex]" size="sm" flat /></div>
              <div class="grid place-items-center"><OutfitItem :item="state[1].items[state[1].activeIndex]" size="sm" flat /></div>
              <div class="grid place-items-center"><OutfitItem :item="state[2].items[state[2].activeIndex]" size="sm" flat /></div>
            </div>
            <div class="absolute bottom-3 left-3 right-3 rounded-2xl bg-cream/80 backdrop-blur px-3 py-2 text-xs text-espresso-soft border border-espresso/5">
              <span class="font-medium text-espresso">Today's look · </span>{{ currentOutfit }}
            </div>
          </div>
          <!-- Floating chips -->
          <div class="reveal hidden sm:flex absolute -left-4 top-12 rounded-full bg-white/80 backdrop-blur px-3 py-1.5 text-xs shadow-soft border border-espresso/5">
            <Sparkles :size="12" class="text-tan mr-1.5" /> snap to center
          </div>
          <div class="reveal hidden sm:flex absolute -right-2 bottom-24 rounded-full bg-white/80 backdrop-blur px-3 py-1.5 text-xs shadow-soft border border-espresso/5">
            <Lock :size="12" class="text-tan mr-1.5" /> lock a layer
          </div>
        </div>
      </div>
    </section>

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

        <!-- Each layer -->
        <div class="space-y-5">
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

    <!-- ─────────────────────────  IMPACT  ───────────────────────── -->
    <section id="impact" ref="statsRef" class="relative py-20 sm:py-28 bg-gradient-to-b from-cream to-beige/40">
      <div class="mx-auto max-w-7xl px-5 sm:px-8">
        <div class="reveal text-center max-w-2xl mx-auto">
          <p class="text-xs uppercase tracking-[0.18em] text-tan font-semibold">Why it matters</p>
          <h2 class="mt-2 font-display text-3xl sm:text-5xl tracking-tight">The morning decision tax.</h2>
          <p class="mt-4 text-espresso-soft">Small daily friction, compounded across a year. VirtualCloset is built to give that time back.</p>
        </div>

        <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div
            v-for="s in STATS"
            :key="s.key"
            class="reveal lift rounded-3xl bg-white/80 backdrop-blur border border-espresso/5 p-7 shadow-soft hover:shadow-card hover:-translate-y-1"
          >
            <div class="flex items-center justify-between">
              <span class="grid place-items-center h-10 w-10 rounded-2xl bg-tan/15 text-tan">
                <component :is="s.icon" :size="20" />
              </span>
              <span class="text-xs uppercase tracking-[0.18em] text-espresso-soft">stat</span>
            </div>
            <div class="mt-6 flex items-baseline gap-1">
              <span class="font-display text-5xl sm:text-6xl tracking-tight tabular-nums">
                {{ statValues[s.key] }}
              </span>
              <span class="font-display text-2xl text-tan">{{ s.suffix }}</span>
            </div>
            <p class="mt-3 text-sm text-espresso-soft leading-relaxed">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  CTA  ───────────────────────── -->
    <section id="cta" class="relative py-24 sm:py-32">
      <div class="mx-auto max-w-5xl px-5 sm:px-8">
        <div class="reveal relative rounded-4xl bg-espresso text-cream overflow-hidden shadow-card">
          <!-- Decorative -->
          <div class="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full bg-tan/30 blur-3xl"></div>
          <div class="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-beige/10 blur-3xl"></div>

          <div class="relative px-7 sm:px-14 py-14 sm:py-20 text-center">
            <p class="text-xs uppercase tracking-[0.22em] text-tan-soft font-semibold">Ready when you are</p>
            <h2 class="mt-3 font-display text-4xl sm:text-6xl tracking-tight">
              Start Mixing Your <span class="italic text-tan-soft">Style</span> Now.
            </h2>
            <p class="mt-5 max-w-xl mx-auto text-cream/70">
              Built for everyday confidence. No more morning panic — just three layers, one tap, and a look that feels like you.
            </p>

            <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                @click="startMixing"
                class="press group inline-flex items-center gap-2 rounded-full bg-tan text-espresso px-7 py-4 text-base font-semibold shadow-glow hover:scale-[1.03] hover:bg-tan-soft transition-all duration-300 ease-silk"
              >
                <Sparkles :size="16" />
                Start Mixing Your Style
                <ArrowRight :size="16" class="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <span class="text-xs text-cream/60">No sign-up · 100% playful · Built for everyday confidence</span>
            </div>
          </div>
        </div>

        <p class="mt-10 text-center text-xs text-espresso-soft">
          © {{ new Date().getFullYear() }} VirtualCloset — a Clueless-inspired prototype.
        </p>
      </div>
    </section>
  </div>
</template>
