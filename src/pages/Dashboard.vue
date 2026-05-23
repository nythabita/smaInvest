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

import { state, closetItems, loadClosetFromFirestore, saveItemToFirestore, initClosetAuthListener, saveOutfitToFirestore } from '../store/closet.js'

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
/*  Shuffle & Save Outfits                                                    */
/* -------------------------------------------------------------------------- */

const isShuffling = ref(false)
const outfitName = ref('')
const isSavingOutfit = ref(false)
const outfitSaveSuccess = ref(false)

async function handleSaveOutfit() {
  const user = auth.currentUser
  if (!user) return
  isSavingOutfit.value = true
  outfitSaveSuccess.value = false

  const currentItems = state.map(layer => layer.items[layer.activeIndex]).filter(Boolean)
  try {
    await saveOutfitToFirestore(user.uid, outfitName.value, currentItems)
    outfitSaveSuccess.value = true
    outfitName.value = ''
    setTimeout(() => { outfitSaveSuccess.value = false }, 3000)
  } catch (e) {
    console.error('Failed to save outfit:', e)
  } finally {
    isSavingOutfit.value = false
  }
}

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
  <div class="min-h-screen overflow-x-hidden bg-surface text-on-surface font-body-md">
    <!-- ─────────────────────────  NAV  ───────────────────────── -->
    <header class="sticky top-0 z-30 backdrop-blur-md bg-surface/80 border-b border-outline-variant/30">
      <div class="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <button @click="router.push('/')" class="flex items-center gap-2.5 hover:opacity-80 transition">
            <div class="h-9 w-9 rounded-full bg-primary text-on-primary grid place-items-center shadow-sm">
              <Sparkles :size="18" stroke-width="1.5" />
            </div>
            <span class="font-display-lg text-lg sm:text-xl tracking-tight text-primary">VIRTUAL CLOSET</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="shuffleOutfit"
            :disabled="isShuffling"
            class="press group inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-4 py-2 text-sm font-medium shadow-sm hover:bg-primary/90 disabled:opacity-60"
          >
            <Shuffle :size="14" :class="['transition-transform duration-500 ease-silk', isShuffling ? 'rotate-180' : 'group-hover:rotate-12']" />
            Shuffle
          </button>
          <button
            @click="toggleCamera"
            class="press inline-flex items-center gap-2 rounded-full bg-secondary text-on-secondary px-4 py-2 text-sm font-medium shadow-sm hover:bg-secondary/90"
          >
            Add Clothing
          </button>
          <button
            @click="router.push('/closet')"
            class="press inline-flex items-center gap-2 rounded-full bg-surface-container border border-outline-variant/30 text-primary px-4 py-2 text-sm font-medium hover:bg-surface-container-high transition-colors"
          >
            Wardrobe
          </button>
          <button
            @click="handleLogout"
            class="press inline-flex items-center gap-2 rounded-full bg-surface-container border border-outline-variant/30 text-primary px-4 py-2 text-sm font-medium hover:bg-surface-container-high transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- CAMERA / UPLOAD OVERLAY -->
    <div v-if="showCamera" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4 transition-all duration-300">
      <!-- Wrapper relative for absolute close button positioning -->
      <div class="relative w-full sm:w-[92vw] sm:max-w-3xl bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden">
        
        <!-- Header area for mobile close button -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 sm:hidden">
          <h3 class="font-display-lg text-xl text-primary">Add Clothing</h3>
          <button @click="toggleCamera" class="h-8 w-8 rounded-full bg-surface-container grid place-items-center text-on-surface-variant hover:text-primary transition-colors">
            ✕
          </button>
        </div>
        
        <!-- Desktop close button -->
        <button
          @click="toggleCamera"
          class="hidden sm:flex absolute -top-12 right-0 text-white text-2xl z-20 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          ✕
        </button>

        <!-- Inner scrollable area -->
        <div class="overflow-y-auto no-scrollbar flex-1 w-full relative">
          <div class="p-5 sm:p-8">
            <template v-if="!pendingCapturedImage">
              <h3 class="hidden sm:block font-display-lg text-2xl text-primary mb-6 text-center">Add Clothing</h3>
              
              <!-- Input Mode Tabs -->
              <div class="flex gap-2 mb-8 max-w-sm mx-auto p-1 bg-surface-container rounded-full">
                <button
                  @click="inputMode = 'camera'"
                  :class="[
                    'flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
                    inputMode === 'camera'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  ]"
                >
                  📷 Camera
                </button>
                <button
                  @click="inputMode = 'upload'"
                  :class="[
                    'flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
                    inputMode === 'upload'
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  ]"
                >
                  📁 Upload
                </button>
              </div>

              <!-- Camera Mode -->
              <div v-if="inputMode === 'camera'" class="max-w-sm mx-auto">
                <div class="rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-container aspect-[3/4] relative">
                  <CameraCapture
                    @capture="(imageData) => {
                      processBackgroundRemoval(imageData)
                    }"
                  />
                </div>
              </div>

              <!-- Upload Mode -->
              <div v-else class="max-w-sm mx-auto flex flex-col items-center justify-center min-h-[50vh] sm:min-h-0 sm:aspect-[3/4]">
                <div v-if="uploadError" class="w-full mb-4 p-3 rounded-xl bg-secondary/5 text-secondary text-sm text-center border border-secondary/20">
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
                  class="w-full h-full min-h-[300px] rounded-2xl border border-dashed border-outline-variant hover:border-primary bg-surface-container hover:bg-surface-container-high transition-colors flex flex-col items-center justify-center gap-5 cursor-pointer p-6"
                >
                  <div class="h-20 w-20 rounded-full bg-primary/5 grid place-items-center text-primary group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <div class="text-center">
                    <p class="font-headline-md text-lg text-primary mb-1">Browse your files</p>
                    <p class="text-xs text-on-surface-variant">JPG, PNG, WebP format.<br/>Max 5MB.</p>
                  </div>
                </button>
              </div>
            </template>
        
            <template v-else>
              <!-- Processing overlay -->
              <div v-if="isProcessingBg" class="flex flex-col items-center justify-center py-16 sm:py-24 gap-8">
                <div class="relative w-full max-w-[200px] aspect-square">
                  <div class="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-70"></div>
                  <img :src="pendingCapturedImage" class="relative z-10 w-full h-full object-contain rounded-2xl opacity-50 grayscale transition-all duration-1000" />
                  <div class="absolute inset-0 z-20 flex items-center justify-center">
                    <div class="w-14 h-14 bg-surface-container-lowest rounded-full shadow-lg flex items-center justify-center border border-outline-variant/30">
                      <div class="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <p class="font-display-lg text-xl text-primary mb-2">Refining Image</p>
                  <p class="text-sm text-on-surface-variant">Removing background for a clean cut...</p>
                </div>
              </div>

              <!-- Preview & Approve Mode -->
              <div v-else class="flex flex-col sm:flex-row gap-6 sm:gap-8 h-full">
                
                <!-- Left: Compact Image Preview (Fixed smaller height on mobile) -->
                <div class="w-full sm:w-5/12 flex flex-col items-center justify-center gap-3 shrink-0">
                  <div class="relative w-full max-w-[240px] sm:max-w-sm h-[25vh] sm:h-auto sm:aspect-[3/4] rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-container shadow-inner" style="background: repeating-conic-gradient(#e8e8e6 0% 25%, #f9f9f7 0% 50%) 50% / 15px 15px">
                    <img :src="pendingCapturedImage" class="absolute inset-0 w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div v-if="bgRemovalError" class="text-[11px] text-secondary bg-secondary/5 rounded-lg px-3 py-2 text-center border border-secondary/20 w-full max-w-[240px]">
                    {{ bgRemovalError }}
                  </div>
                </div>

                <!-- Right: Form -->
                <div class="w-full sm:w-7/12 flex flex-col flex-1">
                  <h3 class="hidden sm:block font-display-lg text-2xl text-primary mb-6">Item Details</h3>
                  
                  <div class="space-y-6">
                    <div>
                      <p class="font-label-caps text-xs tracking-wider text-on-surface-variant mb-2">ITEM NAME</p>
                      <input
                        v-model="customName"
                        type="text"
                        placeholder="E.g. Vintage Denim Jacket..."
                        class="w-full px-4 py-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-primary outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-on-surface-variant/40 shadow-sm transition-all"
                      />
                    </div>

                    <div>
                      <p class="font-label-caps text-xs tracking-wider text-on-surface-variant mb-2">CATEGORY</p>
                      <div class="flex gap-2 flex-wrap">
                        <button
                          @click="selectedCategory = 'headwear'"
                          :class="[
                            'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border',
                            selectedCategory === 'headwear' ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary'
                          ]"
                        >
                          Headwear
                        </button>
                        <button
                          @click="selectedCategory = 'tops'"
                          :class="[
                            'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border',
                            selectedCategory === 'tops' ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary'
                          ]"
                        >
                          Top
                        </button>
                        <button
                          @click="selectedCategory = 'bottoms'"
                          :class="[
                            'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border',
                            selectedCategory === 'bottoms' ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-primary'
                          ]"
                        >
                          Bottom
                        </button>
                      </div>
                    </div>

                    <div>
                      <p class="font-label-caps text-xs tracking-wider text-on-surface-variant mb-2">SAVE DESTINATION</p>
                      <div class="flex flex-col sm:flex-row gap-3">
                        <label class="flex items-center gap-3 cursor-pointer bg-surface-container px-4 py-3 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors flex-1">
                          <input type="checkbox" v-model="saveToClosetToggle" class="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" />
                          <span class="text-sm text-primary font-medium">My Closet</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer bg-surface-container px-4 py-3 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors flex-1">
                          <input type="checkbox" v-model="addToSliderToggle" class="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer" />
                          <span class="text-sm text-primary font-medium">Outfit Slider</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div v-if="saveError" class="mt-4 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                    <p class="text-sm text-secondary font-medium text-center">{{ saveError }}</p>
                  </div>

                  <!-- Action Buttons pushed to bottom -->
                  <div class="flex gap-3 mt-8 sm:mt-auto pt-4 border-t border-outline-variant/20">
                    <button
                      @click="pendingCapturedImage = null"
                      :disabled="isSaving"
                      class="flex-1 px-4 py-3.5 rounded-full bg-surface-container text-primary font-semibold hover:bg-surface-container-high transition-colors border border-outline-variant/30 disabled:opacity-50"
                    >
                      Retake
                    </button>
                    <button
                      @click="saveToCloset"
                      :disabled="isSaving"
                      class="flex-[2] px-4 py-3.5 rounded-full btn-primary font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <span v-if="isSaving" class="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                      {{ isSaving ? 'Saving...' : 'Save to Closet' }}
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
            <p class="font-label-caps tracking-[0.18em] text-secondary">SIGNATURE FEATURE</p>
            <h2 class="mt-2 font-headline-md text-3xl sm:text-5xl tracking-tight text-primary">The Visual Mixer</h2>
            <p class="mt-3 max-w-xl text-on-surface-variant">Three layers. Independent control. Lock what you love, shuffle the rest. Built to feel like a styling tool — not a carousel.</p>
          </div>

          <div class="reveal flex items-center gap-2">
            <button
              @click="shuffleOutfit"
              :disabled="isShuffling"
              class="press group inline-flex items-center gap-2 rounded-full btn-secondary px-5 py-3 text-sm font-semibold disabled:opacity-60"
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
              class="reveal editorial-card overflow-hidden"
            >
              <!-- Header row -->
              <div class="flex items-center justify-between px-5 sm:px-6 pt-4">
                <div class="flex items-center gap-3">
                  <span class="grid place-items-center h-7 w-7 rounded-full bg-surface-container-high text-primary text-xs font-semibold">{{ idx + 1 }}</span>
                  <h3 class="font-headline-md text-lg sm:text-xl text-primary">{{ layer.label }}</h3>
                  <span class="hidden sm:inline text-xs text-on-surface-variant">· {{ layer.items[layer.activeIndex]?.label }}</span>
                </div>

                <button
                  @click="toggleLock(idx)"
                  :aria-pressed="layer.locked"
                  :class="[
                    'press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-300',
                    layer.locked
                      ? 'bg-secondary text-on-secondary border-secondary shadow-[0_0_15px_rgba(182,23,41,0.3)]'
                      : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-primary'
                  ]"
                >
                  <component :is="layer.locked ? Lock : LockOpen" :size="13" />
                  {{ layer.locked ? 'Locked' : 'Lock' }}
                </button>
              </div>

              <!-- The rail -->
              <div class="relative mt-3 pb-5">
                <!-- Center indicator -->
                <div class="pointer-events-none absolute inset-y-3 left-1/2 -translate-x-1/2 w-[clamp(140px,22vw,210px)] rounded-3xl ring-1 ring-primary/20 ring-offset-0"></div>

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
                    class="lift shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl"
                    :class="[
                      'w-[clamp(140px,22vw,210px)] aspect-[3/4]',
                      layer.activeIndex === i
                        ? 'scale-[1.04] shadow-[0_10px_40px_rgba(0,0,0,0.05)]'
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
                      layer.activeIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-outline-variant/50'
                    ]"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Live Preview Stack (5 columns on large screens, sticky on scroll) -->
          <div class="lg:col-span-5 order-first lg:order-last lg:sticky lg:top-24 space-y-6">
            <div class="reveal relative w-full max-w-[280px] sm:max-w-sm mx-auto aspect-[3/4] rounded-[2.5rem] glass-panel p-4">
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
              <div class="absolute bottom-4 left-4 right-4 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-md px-4 py-3 text-xs text-on-surface-variant border border-outline-variant/30 shadow-sm flex items-center justify-between">
                <div>
                  <span class="font-semibold text-primary block">Live Look</span>
                  <span class="opacity-80 text-[10px] uppercase tracking-wider mt-0.5 block truncate max-w-[150px] sm:max-w-[200px]">{{ currentOutfit }}</span>
                </div>
                <div class="h-8 w-8 rounded-full bg-secondary/10 grid place-items-center text-secondary">
                  <Sparkles :size="14" stroke-width="1.5" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Current outfit summary -->
        <div class="reveal mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 editorial-card px-5 sm:px-7 py-5">
          <div class="flex-1">
            <p class="font-label-caps tracking-[0.18em] text-secondary">YOUR LOOK</p>
            <p class="mt-1 font-headline-md text-xl text-primary">{{ currentOutfit }}</p>
          </div>
          
          <div class="flex flex-col sm:flex-row items-center gap-3">
            <!-- Save Outfit Inline Form -->
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <input 
                v-model="outfitName" 
                type="text" 
                placeholder="Name this look..." 
                class="px-4 py-2.5 rounded-full border border-outline-variant/30 bg-surface-container-lowest text-primary text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary w-full sm:w-40 transition-all"
              />
              <button
                @click="handleSaveOutfit"
                :disabled="isSavingOutfit"
                class="press inline-flex items-center justify-center rounded-full btn-secondary px-4 py-2.5 text-sm font-semibold disabled:opacity-50 whitespace-nowrap"
              >
                <span v-if="outfitSaveSuccess">Saved!</span>
                <span v-else-if="isSavingOutfit">Saving...</span>
                <span v-else>Save</span>
              </button>
            </div>

            <button
              @click="shuffleOutfit"
              class="press inline-flex items-center gap-2 rounded-full btn-primary px-5 py-2.5 text-sm font-semibold w-full sm:w-auto justify-center"
            >
              <Shuffle :size="14" />
              Try another
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
