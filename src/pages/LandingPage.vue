<script setup>
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Layers,
  Shuffle,
  Lock,
  Camera,
  Zap,
} from 'lucide-vue-next'

const emit = defineEmits(['go-dashboard'])

function goToDashboard() {
  emit('go-dashboard')
}

const features = [
  {
    icon: Layers,
    title: 'Three-Layer Slider',
    desc: 'Mix headwear, tops, and bottoms independently with a smooth swipe experience.',
  },
  {
    icon: Shuffle,
    title: 'Smart Shuffle',
    desc: 'One tap to randomize unlocked layers. Keep what you love, change the rest.',
  },
  {
    icon: Lock,
    title: 'Lock & Mix',
    desc: 'Lock your favorite piece and shuffle around it for endless combinations.',
  },
  {
    icon: Camera,
    title: 'Camera Capture',
    desc: 'Snap your own clothes and add them directly into the mixer.',
  },
]
</script>

<template>
  <div class="min-h-screen overflow-x-hidden">
    <!-- ─────────────────────────  NAV  ───────────────────────── -->
    <header class="sticky top-0 z-30 backdrop-blur-md bg-cream/70 border-b border-espresso/5">
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
      <div class="pointer-events-none absolute top-40 -right-24 h-[22rem] w-[22rem] rounded-full bg-beige/70 blur-3xl"></div>

      <div class="relative mx-auto max-w-7xl px-4 sm:px-8 pt-12 sm:pt-24 pb-10 sm:pb-20 flex flex-col lg:flex-row gap-10 lg:gap-12 items-center">
        <!-- Text column -->
        <div class="w-full lg:w-7/12">
          <div class="reveal inline-flex items-center gap-2 rounded-full bg-beige px-3 py-1 text-xs font-medium text-espresso-soft border border-espresso/5">
            <span class="h-1.5 w-1.5 rounded-full bg-tan animate-pulse"></span>
            A styling tool, not a closet
          </div>

          <h1 class="reveal mt-5 font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight">
            VirtualCloset:
            <span class="block italic text-tan">The Clueless Experience.</span>
          </h1>

          <p class="reveal mt-5 sm:mt-6 max-w-xl text-base sm:text-lg text-espresso-soft leading-relaxed">
            <span class="font-semibold text-espresso">62%</span> of women struggle with daily outfit decisions.
            We turned the morning panic into a playful three-layer slider — mix, lock, and shuffle until it feels right.
          </p>

          <div class="reveal mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <button
              @click="goToDashboard"
              class="press group relative inline-flex items-center gap-2 rounded-full bg-espresso text-cream pl-5 pr-4 py-3 text-sm font-semibold shadow-soft hover:shadow-card hover:bg-espresso-soft hover:scale-[1.02] transition-all duration-300 ease-silk"
            >
              <span>Start Mixing</span>
              <span class="grid place-items-center h-6 w-6 rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight :size="14" />
              </span>
            </button>
            <a href="#features" class="text-sm text-espresso-soft hover:text-espresso transition inline-flex items-center gap-1">
              See features
              <ChevronRight :size="14" />
            </a>
          </div>

          <!-- Trust row -->
          <div class="reveal mt-8 sm:mt-10 flex items-center gap-5 text-xs text-espresso-soft">
            <div class="flex -space-x-2">
              <div class="h-7 w-7 rounded-full ring-2 ring-cream bg-tan/80"></div>
              <div class="h-7 w-7 rounded-full ring-2 ring-cream bg-espresso/70"></div>
              <div class="h-7 w-7 rounded-full ring-2 ring-cream bg-beige border border-tan/30"></div>
            </div>
            <span>Loved by stylists, indecisive mornings, and lazy Sundays.</span>
          </div>
        </div>

        <!-- Hero visual -->
        <div class="w-full lg:w-5/12 flex justify-center">
          <div class="reveal relative w-full max-w-xs sm:max-w-sm aspect-[4/5] rounded-4xl bg-gradient-to-b from-beige to-cream shadow-card overflow-hidden border border-espresso/5">
            <!-- Placeholder product preview -->
            <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div class="h-16 w-16 rounded-2xl bg-tan/15 grid place-items-center mb-4">
                <Layers :size="32" class="text-tan" />
              </div>
              <p class="font-display text-lg text-espresso">3-Layer Preview</p>
              <p class="mt-2 text-xs text-espresso-soft leading-relaxed">Headwear · Tops · Bottoms<br/>Swipe, lock, and shuffle</p>
            </div>
            <div class="absolute bottom-3 left-3 right-3 rounded-2xl bg-cream/80 backdrop-blur px-3 py-2 text-xs text-espresso-soft border border-espresso/5">
              <span class="font-medium text-espresso">Product preview · </span>Interactive demo inside
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  PRODUCT PREVIEW PLACEHOLDER  ───────────────────────── -->
    <section id="preview" class="relative py-12 sm:py-20 bg-gradient-to-b from-cream to-beige/30">
      <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <div class="reveal text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p class="text-xs uppercase tracking-[0.18em] text-tan font-semibold">See it in action</p>
          <h2 class="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">How It Works</h2>
          <p class="mt-3 text-espresso-soft text-sm sm:text-base">Three simple steps to your perfect outfit — no stress, no decisions, just play.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          <div class="reveal rounded-3xl bg-white/70 backdrop-blur border border-espresso/5 p-6 sm:p-8 shadow-soft text-center">
            <div class="mx-auto h-12 w-12 rounded-2xl bg-tan/15 grid place-items-center mb-4">
              <span class="font-display text-xl text-tan">1</span>
            </div>
            <h3 class="font-display text-lg">Swipe</h3>
            <p class="mt-2 text-sm text-espresso-soft leading-relaxed">Browse through each layer with a natural swipe gesture.</p>
          </div>
          <div class="reveal rounded-3xl bg-white/70 backdrop-blur border border-espresso/5 p-6 sm:p-8 shadow-soft text-center">
            <div class="mx-auto h-12 w-12 rounded-2xl bg-tan/15 grid place-items-center mb-4">
              <span class="font-display text-xl text-tan">2</span>
            </div>
            <h3 class="font-display text-lg">Lock</h3>
            <p class="mt-2 text-sm text-espresso-soft leading-relaxed">Found a piece you love? Lock it in and mix the rest.</p>
          </div>
          <div class="reveal rounded-3xl bg-white/70 backdrop-blur border border-espresso/5 p-6 sm:p-8 shadow-soft text-center">
            <div class="mx-auto h-12 w-12 rounded-2xl bg-tan/15 grid place-items-center mb-4">
              <span class="font-display text-xl text-tan">3</span>
            </div>
            <h3 class="font-display text-lg">Shuffle</h3>
            <p class="mt-2 text-sm text-espresso-soft leading-relaxed">Hit shuffle for a fresh combination — instant outfit inspiration.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  FEATURES PLACEHOLDER  ───────────────────────── -->
    <section id="features" class="relative py-12 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <div class="reveal text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p class="text-xs uppercase tracking-[0.18em] text-tan font-semibold">What's inside</p>
          <h2 class="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">Built for Play</h2>
          <p class="mt-3 text-espresso-soft text-sm sm:text-base">Every feature is designed to make outfit decisions effortless and fun.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="reveal lift rounded-3xl bg-white/60 backdrop-blur-sm border border-espresso/5 p-6 sm:p-8 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <div class="shrink-0 h-11 w-11 rounded-2xl bg-tan/15 grid place-items-center text-tan">
                <component :is="feat.icon" :size="22" />
              </div>
              <div>
                <h3 class="font-display text-lg">{{ feat.title }}</h3>
                <p class="mt-1.5 text-sm text-espresso-soft leading-relaxed">{{ feat.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  CTA  ───────────────────────── -->
    <section id="cta" class="relative py-16 sm:py-24">
      <div class="mx-auto max-w-5xl px-4 sm:px-8">
        <div class="reveal relative rounded-4xl bg-espresso text-cream overflow-hidden shadow-card">
          <!-- Decorative -->
          <div class="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full bg-tan/30 blur-3xl"></div>
          <div class="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-beige/10 blur-3xl"></div>

          <div class="relative px-6 sm:px-14 py-12 sm:py-20 text-center">
            <p class="text-xs uppercase tracking-[0.22em] text-tan-soft font-semibold">Ready when you are</p>
            <h2 class="mt-3 font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight">
              Start Mixing Your <span class="italic text-tan-soft">Style</span> Now.
            </h2>
            <p class="mt-4 sm:mt-5 max-w-xl mx-auto text-cream/70 text-sm sm:text-base">
              Built for everyday confidence. No more morning panic — just three layers, one tap, and a look that feels like you.
            </p>

            <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                @click="goToDashboard"
                class="press group inline-flex items-center gap-2 rounded-full bg-tan text-espresso px-6 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-glow hover:scale-[1.03] hover:bg-tan-soft transition-all duration-300 ease-silk"
              >
                <Sparkles :size="16" />
                Start Mixing Your Style
                <ArrowRight :size="16" class="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <span class="text-xs text-cream/60">No sign-up · 100% playful · Built for everyday confidence</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────  FOOTER  ───────────────────────── -->
    <footer class="py-8 sm:py-10 border-t border-espresso/5">
      <div class="mx-auto max-w-7xl px-4 sm:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            <div class="h-7 w-7 rounded-lg bg-tan text-cream grid place-items-center">
              <Sparkles :size="12" />
            </div>
            <span class="font-display text-sm tracking-tight">VirtualCloset</span>
          </div>
          <p class="text-xs text-espresso-soft text-center sm:text-right">
            © {{ new Date().getFullYear() }} VirtualCloset — a Clueless-inspired prototype.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
