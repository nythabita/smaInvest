<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { removeBackground } from '@imgly/background-removal'
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
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import { uploadToCloudinary } from '../services/cloudinary.js'

const router = useRouter()

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

/* -------------------------------------------------------------------------- */
/*  Reactive state                                                            */
/* -------------------------------------------------------------------------- */

import { state, closetItems, loadClosetFromFirestore, saveItemToFirestore, initClosetAuthListener } from '../store/closet.js'

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
const inputMode = ref('camera') // 'camera' | 'upload'
const uploadError = ref('')
const fileInputRef = ref(null)

const saveToClosetToggle = ref(true)
const addToSliderToggle = ref(true)
const saveError = ref('')
const isSaving = ref(false)

// Background removal state
const isProcessingBg = ref(false)
const bgRemovalError = ref('')
const originalImage = ref(null) // keep original in case bg removal fails

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/* -------------------------------------------------------------------------- */
/*  Background removal                                                        */
/* -------------------------------------------------------------------------- */

async function processBackgroundRemoval(imageDataUrl) {
  originalImage.value = imageDataUrl
  pendingCapturedImage.value = imageDataUrl  // show original immediately
  isProcessingBg.value = true
  bgRemovalError.value = ''

  try {
    // Convert data URL to blob for the library
    const response = await fetch(imageDataUrl)
    const blob = await response.blob()

    const resultBlob = await removeBackground(blob, {
      progress: (key, current, total) => {
        // Optional: could track progress here
      }
    })

    // Convert result blob back to data URL for display
    const reader = new FileReader()
    reader.onload = (e) => {
      pendingCapturedImage.value = e.target.result
      isProcessingBg.value = false
    }
    reader.readAsDataURL(resultBlob)
  } catch (err) {
    console.error('Background removal failed:', err)
    bgRemovalError.value = 'Background removal gagal. Menggunakan gambar asli.'
    // Keep original image — don't block the user
    pendingCapturedImage.value = imageDataUrl
    isProcessingBg.value = false
  }
}

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

  // Load user's saved clothing from Firestore and handle auth automatically
  initClosetAuthListener()
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

async function saveToCloset() {
  if (!pendingCapturedImage.value) return
  saveError.value = ''

  if (!saveToClosetToggle.value && !addToSliderToggle.value) {
    saveError.value = 'Silakan pilih setidaknya satu tempat penyimpanan.'
    return
  }

  const categoryItems = closetItems.value.filter(i => i.category === selectedCategory.value)
  let prefix = 'Item'
  if (selectedCategory.value === 'headwear') prefix = 'Headwear'
  if (selectedCategory.value === 'tops') prefix = 'Top'
  if (selectedCategory.value === 'bottoms') prefix = 'Bottom'
  
  const fallbackName = `My ${prefix} ${categoryItems.length + 1}`
  const itemLabel = customName.value.trim() || fallbackName

  isSaving.value = true

  try {
    // 1. Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(pendingCapturedImage.value)

    // 2. Build item object
    const newItem = {
      id: Date.now(),
      label: itemLabel,
      category: selectedCategory.value,
      meta: "captured",
      tint: "rgba(255,255,255,0.25)",
      image: imageUrl,
      createdAt: new Date().toISOString(),
      inSlider: addToSliderToggle.value,
      isDefault: false
    }

    // 3. Save metadata to Firestore
    const user = auth.currentUser
    if (user) {
      const firestoreId = await saveItemToFirestore(user.uid, newItem)
      newItem.firestoreId = firestoreId
    }

    // 4. Add to local closet (source of truth)
    closetItems.value.push(newItem)

    // 5. Update slider active index if needed
    if (addToSliderToggle.value) {
      const layerIndex = state.findIndex(l => l.key === selectedCategory.value)
      if (layerIndex !== -1) {
        nextTick(() => {
          const newIndex = state[layerIndex].items.length - 1
          state[layerIndex].activeIndex = newIndex
          scrollToIndex(layerIndex, newIndex)
        })
      }
    }

    // Reset and close
    pendingCapturedImage.value = null
    customName.value = ''
    toggleCamera()
  } catch (err) {
    console.error('Save failed:', err)
    saveError.value = 'Gagal menyimpan. Silakan coba lagi.'
  } finally {
    isSaving.value = false
  }
}

function toggleCamera() {
  showCamera.value = !showCamera.value
  if (!showCamera.value) {
    pendingCapturedImage.value = null
    originalImage.value = null
    customName.value = ''
    uploadError.value = ''
    saveError.value = ''
    bgRemovalError.value = ''
    isProcessingBg.value = false
    inputMode.value = 'camera'
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

function triggerFileInput() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

function handleFileUpload(event) {
  uploadError.value = ''
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    uploadError.value = 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'
    event.target.value = ''
    return
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1)
    uploadError.value = `File terlalu besar (${sizeMB}MB). Maksimal 5MB.`
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    processBackgroundRemoval(e.target.result)
  }
  reader.readAsDataURL(file)
  event.target.value = ''
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
            Add Clothing
          </button>
          <button
            @click="router.push('/closet')"
            class="press inline-flex items-center gap-2 rounded-full bg-cream border border-espresso/10 text-espresso px-4 py-2 text-sm font-medium shadow-soft hover:bg-white transition-colors"
          >
            My Closet
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

    <!-- CAMERA / UPLOAD OVERLAY -->
    <div v-if="showCamera" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <!-- Wrapper relative for absolute close button positioning -->
      <div class="relative w-[92vw] max-w-2xl mt-8">
        <button
          @click="toggleCamera"
          class="absolute -top-12 right-0 text-white text-2xl z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          ✕
        </button>

        <!-- Inner scrollable area -->
        <div class="max-h-[85vh] overflow-y-auto no-scrollbar w-full bg-white rounded-3xl shadow-card overflow-hidden">
          <div class="p-5 sm:p-6">
            <template v-if="!pendingCapturedImage">
              <!-- Input Mode Tabs -->
              <div class="flex gap-2 mb-6 max-w-sm mx-auto">
                <button
                  @click="inputMode = 'camera'"
                  :class="[
                    'flex-1 px-4 py-3 rounded-full text-sm font-semibold transition border',
                    inputMode === 'camera'
                      ? 'bg-espresso text-cream border-espresso shadow-soft'
                      : 'bg-cream text-espresso-soft border-espresso/10 hover:bg-beige'
                  ]"
                >
                  📷 Camera
                </button>
                <button
                  @click="inputMode = 'upload'"
                  :class="[
                    'flex-1 px-4 py-3 rounded-full text-sm font-semibold transition border',
                    inputMode === 'upload'
                      ? 'bg-espresso text-cream border-espresso shadow-soft'
                      : 'bg-cream text-espresso-soft border-espresso/10 hover:bg-beige'
                  ]"
                >
                  📁 Upload
                </button>
              </div>

              <!-- Camera Mode -->
              <div v-if="inputMode === 'camera'" class="max-w-sm mx-auto">
                <CameraCapture
                  @capture="(imageData) => {
                    processBackgroundRemoval(imageData)
                  }"
                />
              </div>

              <!-- Upload Mode -->
              <div v-else class="max-w-sm mx-auto">
                <h3 class="font-display text-xl text-espresso mb-4 text-center">Upload Gambar</h3>
                
                <div v-if="uploadError" class="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center border border-red-100">
                  {{ uploadError }}
                </div>

                <!-- Hidden file input -->
                <input
                  ref="fileInputRef"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  class="hidden"
                  @change="handleFileUpload"
                />

                <!-- Upload drop zone -->
                <button
                  @click="triggerFileInput"
                  class="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-espresso/20 bg-cream/50 hover:bg-beige/50 transition flex flex-col items-center justify-center gap-4 cursor-pointer"
                >
                  <div class="h-16 w-16 rounded-full bg-tan/10 grid place-items-center text-tan">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <div class="text-center">
                    <p class="font-semibold text-espresso">Pilih gambar</p>
                    <p class="text-xs text-espresso-soft mt-1">JPG, PNG, WebP · Maks 5MB</p>
                  </div>
                </button>
              </div>
            </template>
        
            <template v-else>
              <!-- Processing overlay -->
              <div v-if="isProcessingBg" class="flex flex-col items-center justify-center py-12 gap-6">
                <div class="relative w-full max-w-[200px] aspect-square">
                  <img :src="pendingCapturedImage" class="w-full h-full object-contain rounded-2xl opacity-40" />
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-12 h-12 border-4 border-tan/30 border-t-tan rounded-full animate-spin"></div>
                  </div>
                </div>
                <div class="text-center">
                  <p class="font-display text-lg text-espresso">Removing background...</p>
                  <p class="text-xs text-espresso-soft mt-1">Proses ini mungkin memakan waktu beberapa detik</p>
                </div>
              </div>

              <!-- Preview & Approve Mode -->
              <div v-else class="flex flex-col md:flex-row gap-6 lg:gap-8">
                
                <!-- Left: Compact Image Preview -->
                <div class="w-full md:w-5/12 lg:w-1/2 flex flex-col items-center justify-center gap-2">
                  <div class="relative w-full max-w-[280px] md:max-w-sm h-[40vh] md:h-auto md:aspect-[3/4] rounded-2xl overflow-hidden border border-espresso/10" style="background: repeating-conic-gradient(#e8e0d4 0% 25%, #fdf7ed 0% 50%) 50% / 20px 20px">
                    <img :src="pendingCapturedImage" class="absolute inset-0 w-full h-full object-contain p-2" />
                  </div>
                  <div v-if="bgRemovalError" class="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 text-center border border-amber-100 max-w-[280px]">
                    {{ bgRemovalError }}
                  </div>
                </div>

                <!-- Right: Form -->
                <div class="w-full md:w-7/12 lg:w-1/2 flex flex-col justify-center">
                  <h3 class="font-display text-2xl text-espresso mb-6 text-center md:text-left">Add to Closet</h3>
                  
                  <input
                    v-model="customName"
                    type="text"
                    placeholder="Name this item..."
                    class="w-full mb-6 px-4 py-3 rounded-xl border border-espresso/10 bg-cream/50 text-espresso outline-none focus:ring-2 focus:ring-tan"
                  />

                  <p class="text-sm font-semibold text-espresso-soft mb-3 text-center md:text-left">Category</p>
                  <div class="flex justify-center md:justify-start gap-2 mb-6 flex-wrap">
                    <button
                      @click="selectedCategory = 'headwear'"
                      :class="[
                        'px-5 py-2.5 rounded-full text-sm font-medium transition',
                        selectedCategory === 'headwear' ? 'bg-tan text-white shadow-soft' : 'bg-cream text-espresso-soft hover:bg-beige'
                      ]"
                    >
                      Headwear
                    </button>
                    <button
                      @click="selectedCategory = 'tops'"
                      :class="[
                        'px-5 py-2.5 rounded-full text-sm font-medium transition',
                        selectedCategory === 'tops' ? 'bg-tan text-white shadow-soft' : 'bg-cream text-espresso-soft hover:bg-beige'
                      ]"
                    >
                      Top
                    </button>
                    <button
                      @click="selectedCategory = 'bottoms'"
                      :class="[
                        'px-5 py-2.5 rounded-full text-sm font-medium transition',
                        selectedCategory === 'bottoms' ? 'bg-tan text-white shadow-soft' : 'bg-cream text-espresso-soft hover:bg-beige'
                      ]"
                    >
                      Bottom
                    </button>
                  </div>

                  <p class="text-sm font-semibold text-espresso-soft mb-3 text-center md:text-left">Save Destination</p>
                  <div class="flex flex-col md:flex-row gap-4 justify-center md:justify-start mb-6">
                    <label class="flex items-center gap-2 cursor-pointer bg-cream/30 px-4 py-2.5 rounded-xl border border-espresso/5 hover:bg-cream/50 transition">
                      <input type="checkbox" v-model="saveToClosetToggle" class="w-4 h-4 rounded text-tan focus:ring-tan accent-tan cursor-pointer" />
                      <span class="text-sm text-espresso font-medium">My Closet</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer bg-cream/30 px-4 py-2.5 rounded-xl border border-espresso/5 hover:bg-cream/50 transition">
                      <input type="checkbox" v-model="addToSliderToggle" class="w-4 h-4 rounded text-tan focus:ring-tan accent-tan cursor-pointer" />
                      <span class="text-sm text-espresso font-medium">Outfit Slider</span>
                    </label>
                  </div>
                  <div v-if="saveError" class="mb-4 text-center md:text-left">
                    <p class="text-sm text-red-500 font-medium">{{ saveError }}</p>
                  </div>

                  <div class="flex gap-3 mt-auto">
                    <button
                      @click="pendingCapturedImage = null"
                      :disabled="isSaving"
                      class="flex-1 px-4 py-3 rounded-full bg-cream text-espresso font-semibold hover:bg-beige transition border border-espresso/5 disabled:opacity-50"
                    >
                      Retake
                    </button>
                    <button
                      @click="saveToCloset"
                      :disabled="isSaving"
                      class="flex-1 px-4 py-3 rounded-full bg-espresso text-cream font-semibold hover:bg-espresso-soft transition shadow-soft disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span v-if="isSaving" class="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin"></span>
                      {{ isSaving ? 'Menyimpan...' : 'Save to Closet' }}
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
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
  </div>
</template>
