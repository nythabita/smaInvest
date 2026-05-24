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
  router.push('/login')
}

// Data for Hero mockup stack
const mockupItems = [
  LAYERS[0].items[0], // headwear
  LAYERS[1].items[1], // top
  LAYERS[2].items[0]  // bottom
]


</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-surface text-on-surface font-body-md">
    <!-- ─────────────────────────  NAV  ───────────────────────── -->
    <header class="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-outline-variant/30 transition-all duration-300">
      <div class="mx-auto max-w-[1800px] px-4 sm:px-8 h-14 md:h-20 flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div class="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full bg-primary text-on-primary grid place-items-center shadow-sm">
            <Sparkles :size="16" class="sm:hidden" stroke-width="1.5" />
            <Sparkles :size="18" class="hidden sm:block" stroke-width="1.5" />
          </div>
          <span class="font-display-lg text-base sm:text-xl tracking-tight text-primary whitespace-nowrap">VIRTUAL CLOSET</span>
        </div>
        <nav class="hidden md:flex items-center gap-8 text-sm">
          <a href="#preview" class="font-label-caps tracking-widest text-on-surface-variant hover:text-primary transition-colors">PREVIEW</a>
          <a href="#features" class="font-label-caps tracking-widest text-on-surface-variant hover:text-primary transition-colors">FEATURES</a>
          <a href="#cta" class="font-label-caps tracking-widest text-on-surface-variant hover:text-primary transition-colors">GET STARTED</a>
        </nav>
        <button
          @click="goToDashboard"
          class="btn-primary flex items-center gap-2 px-3.5 py-1.5 sm:px-6 sm:py-2.5 text-[9px] sm:text-xs tracking-[0.05em] sm:tracking-[0.2em] shadow-sm whitespace-nowrap shrink-0"
        >
          OPEN APP
        </button>
      </div>
    </header>

    <!-- ─────────────────────────  HERO  ───────────────────────── -->
    <section class="relative">
      <!-- Decorative blobs -->
      <div class="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-secondary/5 blur-3xl"></div>
      <div class="pointer-events-none absolute top-40 -right-24 h-[22rem] w-[22rem] rounded-full bg-surface-container-high/80 blur-3xl"></div>

      <div class="relative mx-auto max-w-7xl px-4 sm:px-8 pt-12 sm:pt-24 pb-16 sm:pb-24 flex flex-col lg:flex-row gap-12 items-center">
        <!-- Text column -->
        <div class="w-full lg:w-7/12">
          <div class="reveal badge-accent inline-flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse"></span>
            A STYLING TOOL, NOT A CLOSET
          </div>

          <h1 class="reveal mt-6 font-display-lg text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-primary">
            Curate Your
            <span class="block italic text-secondary">Digital Wardrobe.</span>
          </h1>

          <p class="reveal mt-5 sm:mt-6 max-w-xl text-base sm:text-lg text-on-surface-variant leading-relaxed">
            <span class="font-bold text-primary">62%</span> of women struggle with daily outfit decisions.
            We turned the morning panic into a playful three-layer slider — mix, lock, and shuffle until it feels right.
          </p>

          <div class="reveal mt-8 flex flex-wrap items-center gap-6">
            <button
              @click="goToDashboard"
              class="btn-primary group"
            >
              START MIXING
            </button>
            <a href="#features" class="font-label-caps tracking-widest text-on-surface-variant hover:text-secondary transition-colors inline-flex items-center gap-1.5">
              SEE FEATURES
              <ChevronRight :size="16" />
            </a>
          </div>

          <!-- Trust row -->
          <div class="reveal mt-10 sm:mt-12 flex items-center gap-4 text-xs sm:text-sm text-on-surface-variant">
            <div class="flex -space-x-2">
              <div class="h-8 w-8 rounded-full ring-2 ring-surface bg-surface-container-high"></div>
              <div class="h-8 w-8 rounded-full ring-2 ring-surface bg-outline-variant"></div>
              <div class="h-8 w-8 rounded-full ring-2 ring-surface bg-surface-variant"></div>
            </div>
            <span>Loved by stylists, indecisive mornings, and lazy Sundays.</span>
          </div>
        </div>

        <!-- Hero visual stack -->
        <div class="w-full lg:w-5/12 flex justify-center">
          <div class="reveal relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-[2.5rem] glass-panel shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden p-6">
            <!-- Stack of items -->
            <div class="absolute inset-0 grid grid-rows-3 gap-2 p-4 pb-20">
              <div class="relative w-full h-full bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-2"><OutfitItem :item="mockupItems[0]" :active="false" flat /></div>
              <div class="relative w-full h-full scale-[1.05] z-10 drop-shadow-md bg-surface-container-lowest rounded-xl border-2 border-secondary clothing-item-glow p-2"><OutfitItem :item="mockupItems[1]" :active="true" flat /></div>
              <div class="relative w-full h-full bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-2"><OutfitItem :item="mockupItems[2]" :active="false" flat /></div>
            </div>
            
            <!-- Bottom floating badge -->
            <div class="absolute bottom-6 left-6 right-6 badge-accent flex items-center justify-between p-3 rounded-xl border border-outline-variant/30 shadow-sm">
              <div>
                <span class="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">Interactive Demo</span>
                <span class="block font-bold text-[11px] text-primary">SWIPE TO MIX</span>
              </div>
              <div class="h-8 w-8 rounded-full bg-secondary/10 grid place-items-center text-secondary">
                <SlidersHorizontal :size="14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  PRODUCT PREVIEW MOCKUP  ───────────────────────── -->
    <section id="preview" class="relative py-20 sm:py-28 bg-surface-container-high">
      <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <div class="reveal text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p class="font-label-caps tracking-[0.18em] text-secondary">THE CORE EXPERIENCE</p>
          <h2 class="mt-3 font-display-lg text-4xl sm:text-5xl lg:text-6xl tracking-tight text-primary">The Visual Mixer</h2>
          <p class="mt-4 text-on-surface-variant text-base sm:text-lg">Three layers. Independent control. Lock what you love, shuffle the rest. Built to feel like a styling tool — not a carousel.</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-12 sm:gap-16 items-center">
          <!-- Mockup Visual -->
          <div class="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
             <div class="reveal relative w-full max-w-lg glass-panel rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] p-5 sm:p-8 flex flex-col gap-4 overflow-hidden">
                
                <!-- Static layer 1 (Headwear) -->
                <div class="flex items-center justify-center gap-3">
                   <div class="w-[30%] aspect-[3/4] rounded-2xl bg-surface-container-lowest border border-outline-variant/30 opacity-60 scale-90 translate-x-4"><OutfitItem :item="LAYERS[0].items[1]" flat /></div>
                   <div class="w-[40%] aspect-[3/4] rounded-[2rem] bg-surface-container-lowest shadow-sm border border-outline-variant/50 z-10 p-1"><OutfitItem :item="LAYERS[0].items[0]" flat /></div>
                   <div class="w-[30%] aspect-[3/4] rounded-2xl bg-surface-container-lowest border border-outline-variant/30 opacity-60 scale-90 -translate-x-4"><OutfitItem :item="LAYERS[0].items[2]" flat /></div>
                </div>

                <!-- Static layer 2 (Tops - Locked) -->
                <div class="flex items-center justify-center gap-3">
                   <div class="w-[30%] aspect-[3/4] rounded-2xl bg-surface-container-lowest border border-outline-variant/30 opacity-40 scale-90 translate-x-4"><OutfitItem :item="LAYERS[1].items[0]" flat /></div>
                   <div class="relative w-[40%] aspect-[3/4] rounded-[2rem] bg-surface-container-lowest shadow-sm border-2 border-secondary clothing-item-glow z-10 scale-105 p-1">
                     <div class="absolute -top-3 -right-3 h-8 w-8 bg-secondary text-on-secondary grid place-items-center rounded-full shadow-md z-20">
                        <Lock :size="14" />
                     </div>
                     <OutfitItem :item="LAYERS[1].items[1]" flat />
                   </div>
                   <div class="w-[30%] aspect-[3/4] rounded-2xl bg-surface-container-lowest border border-outline-variant/30 opacity-40 scale-90 -translate-x-4"><OutfitItem :item="LAYERS[1].items[2]" flat /></div>
                </div>

                <!-- Static layer 3 (Bottoms) -->
                <div class="flex items-center justify-center gap-3">
                   <div class="w-[30%] aspect-[3/4] rounded-2xl bg-surface-container-lowest border border-outline-variant/30 opacity-60 scale-90 translate-x-4"><OutfitItem :item="LAYERS[2].items[1]" flat /></div>
                   <div class="w-[40%] aspect-[3/4] rounded-[2rem] bg-surface-container-lowest shadow-sm border border-outline-variant/50 z-10 p-1"><OutfitItem :item="LAYERS[2].items[0]" flat /></div>
                   <div class="w-[30%] aspect-[3/4] rounded-2xl bg-surface-container-lowest border border-outline-variant/30 opacity-60 scale-90 -translate-x-4"><OutfitItem :item="LAYERS[2].items[2]" flat /></div>
                </div>
                
                <!-- Bottom dots purely for aesthetics -->
                <div class="mt-4 flex justify-center gap-1.5 opacity-50">
                  <div class="h-1.5 w-1.5 rounded-full bg-outline-variant"></div>
                  <div class="h-1.5 w-6 rounded-full bg-primary"></div>
                  <div class="h-1.5 w-1.5 rounded-full bg-outline-variant"></div>
                </div>
             </div>
          </div>
          
          <!-- Steps -->
          <div class="w-full lg:w-1/2 space-y-5 sm:space-y-6 order-1 lg:order-2">
            <div class="reveal lift editorial-card p-6 sm:p-8">
              <div class="flex items-start gap-5">
                <div class="shrink-0 h-12 w-12 rounded-2xl bg-secondary/5 grid place-items-center">
                  <span class="font-display-lg text-xl text-secondary">1</span>
                </div>
                <div>
                  <h3 class="font-display-lg text-xl text-primary">Swipe Layers</h3>
                  <p class="mt-2 text-sm sm:text-base text-on-surface-variant leading-relaxed">Browse through headwear, tops, and bottoms with a natural, independent swipe gesture. No endless scrolling.</p>
                </div>
              </div>
            </div>
            
            <div class="reveal lift editorial-card p-6 sm:p-8" style="transition-delay: 100ms;">
              <div class="flex items-start gap-5">
                <div class="shrink-0 h-12 w-12 rounded-2xl bg-secondary/5 grid place-items-center">
                  <span class="font-display-lg text-xl text-secondary">2</span>
                </div>
                <div>
                  <h3 class="font-display-lg text-xl text-primary">Lock Favorites</h3>
                  <p class="mt-2 text-sm sm:text-base text-on-surface-variant leading-relaxed">Found a piece you absolutely love? Lock it in place. It stays fixed while you change the rest of the outfit.</p>
                </div>
              </div>
            </div>
            
            <div class="reveal lift editorial-card p-6 sm:p-8" style="transition-delay: 200ms;">
              <div class="flex items-start gap-5">
                <div class="shrink-0 h-12 w-12 rounded-2xl bg-secondary/5 grid place-items-center">
                  <span class="font-display-lg text-xl text-secondary">3</span>
                </div>
                <div>
                  <h3 class="font-display-lg text-xl text-primary">Smart Shuffle</h3>
                  <p class="mt-2 text-sm sm:text-base text-on-surface-variant leading-relaxed">Hit shuffle to randomly mix the remaining unlocked layers. Instant inspiration when you have zero ideas.</p>
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
          <p class="font-label-caps tracking-[0.18em] text-secondary">EVERYTHING YOU NEED</p>
          <h2 class="mt-3 font-display-lg text-4xl sm:text-5xl lg:text-6xl tracking-tight text-primary">Built for Play</h2>
          <p class="mt-4 text-on-surface-variant text-base sm:text-lg">Every feature is designed to make morning outfit decisions effortless, tactile, and surprisingly fun.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          <div class="reveal lift relative overflow-hidden editorial-card p-8 group" style="transition-delay: 0ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/5 blur-2xl transition-all duration-500 group-hover:scale-150"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-full bg-surface-container-high border border-outline-variant/30 grid place-items-center text-primary mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-500 ease-silk">
                <Upload :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display-lg text-xl text-primary mb-3">Upload Items</h3>
              <p class="text-sm sm:text-base text-on-surface-variant leading-relaxed mt-auto">Snap a photo or upload your own clothing items directly into the app.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden editorial-card p-8 group" style="transition-delay: 50ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/5 blur-2xl transition-all duration-500 group-hover:scale-150"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-full bg-surface-container-high border border-outline-variant/30 grid place-items-center text-primary mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-500 ease-silk">
                <Scissors :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display-lg text-xl text-primary mb-3">Background Removal</h3>
              <p class="text-sm sm:text-base text-on-surface-variant leading-relaxed mt-auto">Automatically remove messy backgrounds to keep your items looking clean.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden editorial-card p-8 group" style="transition-delay: 100ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/5 blur-2xl transition-all duration-500 group-hover:scale-150"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-full bg-surface-container-high border border-outline-variant/30 grid place-items-center text-primary mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-500 ease-silk">
                <FolderTree :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display-lg text-xl text-primary mb-3">Categorize Closet</h3>
              <p class="text-sm sm:text-base text-on-surface-variant leading-relaxed mt-auto">Organize pieces into headwear, tops, and bottoms for easy mixing.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden editorial-card p-8 group" style="transition-delay: 150ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/5 blur-2xl transition-all duration-500 group-hover:scale-150"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-full bg-surface-container-high border border-outline-variant/30 grid place-items-center text-primary mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-500 ease-silk">
                <SlidersHorizontal :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display-lg text-xl text-primary mb-3">Mix with Slider</h3>
              <p class="text-sm sm:text-base text-on-surface-variant leading-relaxed mt-auto">Swipe through layers independently to visualize different combinations.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden editorial-card p-8 group" style="transition-delay: 200ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/5 blur-2xl transition-all duration-500 group-hover:scale-150"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-full bg-surface-container-high border border-outline-variant/30 grid place-items-center text-primary mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-500 ease-silk">
                <Lock :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display-lg text-xl text-primary mb-3">Lock Favorites</h3>
              <p class="text-sm sm:text-base text-on-surface-variant leading-relaxed mt-auto">Found a piece you love? Lock it in and shuffle the rest around it.</p>
            </div>
          </div>

          <div class="reveal lift relative overflow-hidden editorial-card p-8 group" style="transition-delay: 250ms;">
            <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/5 blur-2xl transition-all duration-500 group-hover:scale-150"></div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="h-14 w-14 rounded-full bg-surface-container-high border border-outline-variant/30 grid place-items-center text-primary mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-500 ease-silk">
                <Shuffle :size="24" stroke-width="1.5" />
              </div>
              <h3 class="font-display-lg text-xl text-primary mb-3">Smart Shuffle</h3>
              <p class="text-sm sm:text-base text-on-surface-variant leading-relaxed mt-auto">One tap to randomize unlocked layers for instant outfit inspiration.</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ─────────────────────────  CTA  ───────────────────────── -->
    <section id="cta" class="relative py-20 sm:py-32 bg-surface">
      <div class="mx-auto max-w-5xl px-4 sm:px-8">
        <div class="reveal relative rounded-[3rem] bg-primary text-on-primary overflow-hidden shadow-2xl">
          <!-- Decorative -->
          <div class="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-surface-variant/10 blur-[80px]"></div>
          <div class="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/20 blur-[80px]"></div>

          <div class="relative px-6 sm:px-16 py-16 sm:py-24 text-center">
            <p class="font-label-caps tracking-[0.22em] text-outline-variant">READY WHEN YOU ARE</p>
            <h2 class="mt-4 font-display-lg text-4xl sm:text-5xl lg:text-7xl tracking-tight">
              Start Mixing Your <span class="italic text-secondary">Style</span> Now.
            </h2>
            <p class="mt-6 max-w-xl mx-auto text-on-primary/70 text-base sm:text-lg">
              Built for everyday confidence. No more morning panic — just three layers, one tap, and a look that feels like you.
            </p>

            <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                @click="goToDashboard"
                class="btn-primary flex items-center gap-3 px-10 py-4 shadow-xl"
              >
                OPEN APP DEMO
              </button>
            </div>
            <p class="mt-6 font-label-caps tracking-widest text-[10px] text-on-primary/40">NO SIGN-UP REQUIRED</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  FOOTER  ───────────────────────── -->
    <footer class="py-8 sm:py-10 border-t border-outline-variant/30 bg-surface-container-high/50">
      <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            <div class="h-7 w-7 rounded-full bg-primary text-on-primary grid place-items-center">
              <Sparkles :size="12" stroke-width="1.5" />
            </div>
            <span class="font-display-lg text-sm tracking-tight text-primary">VIRTUAL CLOSET</span>
          </div>
          <p class="font-body-md text-xs text-on-surface-variant text-center sm:text-right">
            © {{ new Date().getFullYear() }} VirtualCloset MVP. Editorial minimalist edition.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
