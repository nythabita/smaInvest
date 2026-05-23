<script setup>
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Upload,
  Scissors,
  FolderTree,
  SlidersHorizontal,
  Lock,
  Shuffle,
} from 'lucide-vue-next'
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import OutfitItem from '../components/OutfitItem.vue'
import LAYERS from '../data/outfits.js'

const router = useRouter()

/* Reveal-on-scroll (IntersectionObserver) */
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
})

onBeforeUnmount(() => {
  io && io.disconnect()
})

function goToDashboard() {
  router.push('/dashboard')
}

// Data for Hero mockup stack
const mockupItems = [
  LAYERS[0].items[0], // headwear
  LAYERS[1].items[1], // top
  LAYERS[2].items[0]  // bottom
]


</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-cream text-espresso">
    <!-- ─────────────────────────  NAV  ───────────────────────── -->
    <header class="sticky top-0 z-30 backdrop-blur-md bg-cream/80 border-b border-espresso/5">
      <div class="mx-auto max-w-7xl px-4 sm:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="h-9 w-9 rounded-xl bg-tan text-cream grid place-items-center shadow-soft">
            <Sparkles :size="18" />
          </div>
          <span class="font-display text-lg sm:text-xl tracking-tight">VirtualCloset</span>
        </div>
        <nav class="hidden md:flex items-center gap-8 text-sm text-espresso-soft">
          <a href="#preview" class="hover:text-espresso transition">Preview</a>
          <a href="#features" class="hover:text-espresso transition">Features</a>
          <a href="#cta" class="hover:text-espresso transition">Get Started</a>
        </nav>
        <button
          @click="goToDashboard"
          class="press group inline-flex items-center gap-2 rounded-full bg-espresso text-cream px-4 py-2 text-sm font-medium shadow-soft hover:shadow-card hover:bg-espresso-soft"
        >
          Open App
          <ArrowRight :size="14" class="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </header>

    <!-- ─────────────────────────  HERO  ───────────────────────── -->
    <section class="relative">
      <!-- Decorative blobs -->
      <div class="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-tan/20 blur-3xl"></div>
      <div class="pointer-events-none absolute top-40 -right-24 h-[22rem] w-[22rem] rounded-full bg-beige/80 blur-3xl"></div>

      <div class="relative mx-auto max-w-7xl px-4 sm:px-8 pt-12 sm:pt-24 pb-16 sm:pb-24 flex flex-col lg:flex-row gap-12 items-center">
        <!-- Text column -->
        <div class="w-full lg:w-7/12">
          <div class="reveal inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-espresso-soft border border-espresso/5">
            <span class="h-1.5 w-1.5 rounded-full bg-tan animate-pulse"></span>
            A styling tool, not a closet
          </div>

          <h1 class="reveal mt-5 font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            VirtualCloset:
            <span class="block italic text-tan">The Clueless Experience.</span>
          </h1>

          <p class="reveal mt-5 sm:mt-6 max-w-xl text-base sm:text-lg text-espresso-soft leading-relaxed">
            <span class="font-semibold text-espresso">62%</span> of women struggle with daily outfit decisions.
            We turned the morning panic into a playful three-layer slider — mix, lock, and shuffle until it feels right.
          </p>

          <div class="reveal mt-8 flex flex-wrap items-center gap-4">
            <button
              @click="goToDashboard"
              class="press group relative inline-flex items-center gap-2 rounded-full bg-espresso text-cream pl-6 pr-5 py-3.5 text-sm sm:text-base font-semibold shadow-soft hover:shadow-card hover:bg-espresso-soft hover:scale-[1.02] transition-all duration-300 ease-silk"
            >
              <span>Start Mixing</span>
              <span class="grid place-items-center h-7 w-7 rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight :size="14" />
              </span>
            </button>
            <a href="#features" class="text-sm text-espresso-soft hover:text-espresso transition inline-flex items-center gap-1.5 font-medium px-2 py-2">
              See features
              <ChevronRight :size="14" />
            </a>
          </div>

          <!-- Trust row -->
          <div class="reveal mt-10 sm:mt-12 flex items-center gap-4 text-xs sm:text-sm text-espresso-soft">
            <div class="flex -space-x-2">
              <div class="h-8 w-8 rounded-full ring-2 ring-cream bg-tan/80"></div>
              <div class="h-8 w-8 rounded-full ring-2 ring-cream bg-espresso/70"></div>
              <div class="h-8 w-8 rounded-full ring-2 ring-cream bg-beige border border-tan/30"></div>
            </div>
            <span>Loved by stylists, indecisive mornings, and lazy Sundays.</span>
          </div>
        </div>

        <!-- Hero visual stack -->
        <div class="w-full lg:w-5/12 flex justify-center">
          <div class="reveal relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-[2.5rem] bg-gradient-to-b from-white/80 to-beige/50 backdrop-blur-sm shadow-card overflow-hidden border border-white p-4">
            <!-- Stack of items -->
            <div class="absolute inset-0 grid grid-rows-3 gap-2 p-3 pb-16">
              <div class="relative w-full h-full"><OutfitItem :item="mockupItems[0]" :active="false" flat /></div>
              <div class="relative w-full h-full scale-[1.05] z-10 drop-shadow-md"><OutfitItem :item="mockupItems[1]" :active="true" flat /></div>
              <div class="relative w-full h-full"><OutfitItem :item="mockupItems[2]" :active="false" flat /></div>
            </div>
            
            <!-- Bottom floating badge -->
            <div class="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 backdrop-blur-md px-4 py-3 text-xs text-espresso-soft border border-white shadow-soft flex items-center justify-between">
              <div>
                <span class="font-semibold text-espresso block">Interactive Demo</span>
                <span class="opacity-80 text-[10px] uppercase tracking-wider mt-0.5 block">Swipe to mix</span>
              </div>
              <div class="h-8 w-8 rounded-full bg-tan/10 grid place-items-center text-tan">
                <SlidersHorizontal :size="14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  PRODUCT PREVIEW MOCKUP  ───────────────────────── -->
    <section id="preview" class="relative py-20 sm:py-28 bg-gradient-to-b from-cream to-beige/40">
      <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <div class="reveal text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p class="text-xs uppercase tracking-[0.18em] text-tan font-semibold">The Core Experience</p>
          <h2 class="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight">The Visual Mixer</h2>
          <p class="mt-4 text-espresso-soft text-base sm:text-lg">Three layers. Independent control. Lock what you love, shuffle the rest. Built to feel like a styling tool — not a carousel.</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-12 sm:gap-16 items-center">
          <!-- Mockup Visual -->
          <div class="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
             <div class="reveal relative w-full max-w-lg bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white/80 shadow-card p-5 sm:p-8 flex flex-col gap-4 overflow-hidden">
                
                <!-- Static layer 1 (Headwear) -->
                <div class="flex items-center justify-center gap-3">
                   <div class="w-[30%] aspect-[3/4] rounded-3xl bg-white/80 shadow-sm border border-espresso/5 opacity-60 scale-90 translate-x-4"><OutfitItem :item="LAYERS[0].items[1]" flat /></div>
                   <div class="w-[40%] aspect-[3/4] rounded-[2rem] bg-white shadow-card border-2 border-transparent z-10"><OutfitItem :item="LAYERS[0].items[0]" flat /></div>
                   <div class="w-[30%] aspect-[3/4] rounded-3xl bg-white/80 shadow-sm border border-espresso/5 opacity-60 scale-90 -translate-x-4"><OutfitItem :item="LAYERS[0].items[2]" flat /></div>
                </div>

                <!-- Static layer 2 (Tops - Locked) -->
                <div class="flex items-center justify-center gap-3">
                   <div class="w-[30%] aspect-[3/4] rounded-3xl bg-white/80 shadow-sm border border-espresso/5 opacity-40 scale-90 translate-x-4"><OutfitItem :item="LAYERS[1].items[0]" flat /></div>
                   <div class="relative w-[40%] aspect-[3/4] rounded-[2rem] bg-white shadow-card border-2 border-espresso z-10 scale-105">
                     <div class="absolute -top-3 -right-3 h-8 w-8 bg-espresso text-cream grid place-items-center rounded-full shadow-md z-20">
                        <Lock :size="14" />
                     </div>
                     <OutfitItem :item="LAYERS[1].items[1]" flat />
                   </div>
                   <div class="w-[30%] aspect-[3/4] rounded-3xl bg-white/80 shadow-sm border border-espresso/5 opacity-40 scale-90 -translate-x-4"><OutfitItem :item="LAYERS[1].items[2]" flat /></div>
                </div>

                <!-- Static layer 3 (Bottoms) -->
                <div class="flex items-center justify-center gap-3">
                   <div class="w-[30%] aspect-[3/4] rounded-3xl bg-white/80 shadow-sm border border-espresso/5 opacity-60 scale-90 translate-x-4"><OutfitItem :item="LAYERS[2].items[1]" flat /></div>
                   <div class="w-[40%] aspect-[3/4] rounded-[2rem] bg-white shadow-card border-2 border-transparent z-10"><OutfitItem :item="LAYERS[2].items[0]" flat /></div>
                   <div class="w-[30%] aspect-[3/4] rounded-3xl bg-white/80 shadow-sm border border-espresso/5 opacity-60 scale-90 -translate-x-4"><OutfitItem :item="LAYERS[2].items[2]" flat /></div>
                </div>
                
                <!-- Bottom dots purely for aesthetics -->
                <div class="mt-4 flex justify-center gap-1.5 opacity-50">
                  <div class="h-1.5 w-1.5 rounded-full bg-espresso/30"></div>
                  <div class="h-1.5 w-6 rounded-full bg-tan"></div>
                  <div class="h-1.5 w-1.5 rounded-full bg-espresso/30"></div>
                </div>
             </div>
          </div>
          
          <!-- Steps -->
          <div class="w-full lg:w-1/2 space-y-5 sm:space-y-6 order-1 lg:order-2">
            <div class="reveal lift rounded-[2rem] bg-white/80 backdrop-blur-sm border border-white p-6 sm:p-8 shadow-soft hover:shadow-card transition-all">
              <div class="flex items-start gap-5">
                <div class="shrink-0 h-12 w-12 rounded-2xl bg-tan/15 grid place-items-center">
                  <span class="font-display text-xl text-tan">1</span>
                </div>
                <div>
                  <h3 class="font-display text-xl text-espresso">Swipe Layers</h3>
                  <p class="mt-2 text-sm sm:text-base text-espresso-soft leading-relaxed">Browse through headwear, tops, and bottoms with a natural, independent swipe gesture. No endless scrolling.</p>
                </div>
              </div>
            </div>
            
            <div class="reveal lift rounded-[2rem] bg-white/80 backdrop-blur-sm border border-white p-6 sm:p-8 shadow-soft hover:shadow-card transition-all" style="transition-delay: 100ms;">
              <div class="flex items-start gap-5">
                <div class="shrink-0 h-12 w-12 rounded-2xl bg-tan/15 grid place-items-center">
                  <span class="font-display text-xl text-tan">2</span>
                </div>
                <div>
                  <h3 class="font-display text-xl text-espresso">Lock Favorites</h3>
                  <p class="mt-2 text-sm sm:text-base text-espresso-soft leading-relaxed">Found a piece you absolutely love? Lock it in place. It stays fixed while you change the rest of the outfit.</p>
                </div>
              </div>
            </div>
            
            <div class="reveal lift rounded-[2rem] bg-white/80 backdrop-blur-sm border border-white p-6 sm:p-8 shadow-soft hover:shadow-card transition-all" style="transition-delay: 200ms;">
              <div class="flex items-start gap-5">
                <div class="shrink-0 h-12 w-12 rounded-2xl bg-tan/15 grid place-items-center">
                  <span class="font-display text-xl text-tan">3</span>
                </div>
                <div>
                  <h3 class="font-display text-xl text-espresso">Smart Shuffle</h3>
                  <p class="mt-2 text-sm sm:text-base text-espresso-soft leading-relaxed">Hit shuffle to randomly mix the remaining unlocked layers. Instant inspiration when you have zero ideas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  FEATURES  ───────────────────────── -->
    <section id="features" class="relative py-20 sm:py-32">
      <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <div class="reveal text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p class="text-xs uppercase tracking-[0.18em] text-tan font-semibold">Everything You Need</p>
          <h2 class="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight">Built for Play</h2>
          <p class="mt-4 text-espresso-soft text-base sm:text-lg">Every feature is designed to make morning outfit decisions effortless, tactile, and surprisingly fun.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          <div class="reveal lift relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md border border-white p-8 shadow-soft hover:shadow-card transition-all duration-300 group" style="transition-delay: 0ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-tan/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-tan/20"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-beige to-white border border-white shadow-sm grid place-items-center text-tan mb-6 group-hover:scale-110 transition-transform duration-500 ease-silk">
                <Upload :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display text-xl text-espresso mb-3">Upload Items</h3>
              <p class="text-sm sm:text-base text-espresso-soft leading-relaxed mt-auto">Snap a photo or upload your own clothing items directly into the app.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md border border-white p-8 shadow-soft hover:shadow-card transition-all duration-300 group" style="transition-delay: 50ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-tan/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-tan/20"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-beige to-white border border-white shadow-sm grid place-items-center text-tan mb-6 group-hover:scale-110 transition-transform duration-500 ease-silk">
                <Scissors :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display text-xl text-espresso mb-3">Background Removal</h3>
              <p class="text-sm sm:text-base text-espresso-soft leading-relaxed mt-auto">Automatically remove messy backgrounds to keep your items looking clean.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md border border-white p-8 shadow-soft hover:shadow-card transition-all duration-300 group" style="transition-delay: 100ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-tan/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-tan/20"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-beige to-white border border-white shadow-sm grid place-items-center text-tan mb-6 group-hover:scale-110 transition-transform duration-500 ease-silk">
                <FolderTree :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display text-xl text-espresso mb-3">Categorize Closet</h3>
              <p class="text-sm sm:text-base text-espresso-soft leading-relaxed mt-auto">Organize pieces into headwear, tops, and bottoms for easy mixing.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md border border-white p-8 shadow-soft hover:shadow-card transition-all duration-300 group" style="transition-delay: 150ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-tan/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-tan/20"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-beige to-white border border-white shadow-sm grid place-items-center text-tan mb-6 group-hover:scale-110 transition-transform duration-500 ease-silk">
                <SlidersHorizontal :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display text-xl text-espresso mb-3">Mix with Slider</h3>
              <p class="text-sm sm:text-base text-espresso-soft leading-relaxed mt-auto">Swipe through layers independently to visualize different combinations.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md border border-white p-8 shadow-soft hover:shadow-card transition-all duration-300 group" style="transition-delay: 200ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-tan/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-tan/20"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-beige to-white border border-white shadow-sm grid place-items-center text-tan mb-6 group-hover:scale-110 transition-transform duration-500 ease-silk">
                <Lock :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display text-xl text-espresso mb-3">Lock Favorites</h3>
              <p class="text-sm sm:text-base text-espresso-soft leading-relaxed mt-auto">Found a piece you love? Lock it in and shuffle the rest around it.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-md border border-white p-8 shadow-soft hover:shadow-card transition-all duration-300 group" style="transition-delay: 250ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-tan/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-tan/20"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-beige to-white border border-white shadow-sm grid place-items-center text-tan mb-6 group-hover:scale-110 transition-transform duration-500 ease-silk">
                <Shuffle :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display text-xl text-espresso mb-3">Smart Shuffle</h3>
              <p class="text-sm sm:text-base text-espresso-soft leading-relaxed mt-auto">One tap to randomize unlocked layers for instant outfit inspiration.</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ─────────────────────────  CTA  ───────────────────────── -->
    <section id="cta" class="relative py-20 sm:py-32 bg-cream">
      <div class="mx-auto max-w-5xl px-4 sm:px-8">
        <div class="reveal relative rounded-[3rem] bg-espresso text-cream overflow-hidden shadow-card">
          <!-- Decorative -->
          <div class="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-tan/20 blur-[80px]"></div>
          <div class="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-beige/10 blur-[80px]"></div>

          <div class="relative px-6 sm:px-16 py-16 sm:py-24 text-center">
            <p class="text-xs uppercase tracking-[0.22em] text-tan-soft font-semibold">Ready when you are</p>
            <h2 class="mt-4 font-display text-4xl sm:text-5xl lg:text-7xl tracking-tight">
              Start Mixing Your <span class="italic text-tan-soft">Style</span> Now.
            </h2>
            <p class="mt-6 max-w-xl mx-auto text-cream/70 text-base sm:text-lg">
              Built for everyday confidence. No more morning panic — just three layers, one tap, and a look that feels like you.
            </p>

            <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                @click="goToDashboard"
                class="press group inline-flex items-center gap-3 rounded-full bg-tan text-espresso px-8 py-4 text-base font-semibold shadow-card hover:scale-[1.03] hover:bg-tan-soft transition-all duration-300 ease-silk"
              >
                <Sparkles :size="18" />
                Open App Demo
                <ArrowRight :size="18" class="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            <p class="mt-6 text-xs text-cream/50 uppercase tracking-widest">No sign-up required</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  FOOTER  ───────────────────────── -->
    <footer class="py-8 sm:py-10 border-t border-espresso/10 bg-white/40">
      <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            <div class="h-7 w-7 rounded-lg bg-tan text-cream grid place-items-center">
              <Sparkles :size="12" />
            </div>
            <span class="font-display text-sm tracking-tight font-medium text-espresso">VirtualCloset</span>
          </div>
          <p class="text-xs text-espresso-soft text-center sm:text-right">
            © {{ new Date().getFullYear() }} VirtualCloset MVP. Designed for simplicity.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
