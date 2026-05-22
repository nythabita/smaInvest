<script setup>
defineProps({
  item: { type: Object, required: true },
  active: { type: Boolean, default: false },
  size: { type: String, default: 'md' }, // 'sm' | 'md'
  flat: { type: Boolean, default: false } // no card chrome (used in hero stack)
})
</script>

<template>
  <div
    :class="[
      'relative h-full w-full rounded-3xl overflow-hidden transition-all duration-500 ease-silk',
      flat ? 'bg-transparent' : 'bg-gradient-to-b from-white to-beige/60 border border-espresso/5'
    ]"
  >
    <!-- Soft tint background derived from the item -->
    <div
      v-if="!flat"
      class="absolute inset-0 opacity-80"
      :style="{ background: `radial-gradient(120% 90% at 50% 0%, ${item.tint} 0%, transparent 60%)` }"
    ></div>

    <!-- The illustration -->
    <div class="relative h-full w-full grid place-items-center p-3">

      <!-- CAMERA IMAGE -->
      <img
        v-if="item.image"
        :src="item.image"
        alt="Captured outfit"
        class="w-[78%] h-[78%] object-cover rounded-2xl"
      />

      <!-- SVG DEFAULT -->
      <div
        v-else
        v-html="item.svg"
        class="w-[78%] h-[78%] flex items-center justify-center"
      ></div>

</div>

    <!-- Bottom label -->
    <div
      v-if="!flat"
      :class="[
        'absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-2xl px-3 py-1.5 text-[11px] backdrop-blur border transition-colors duration-500',
        active
          ? 'bg-espresso text-cream border-espresso'
          : 'bg-cream/80 text-espresso-soft border-espresso/5'
      ]"
    >
      <span class="font-medium truncate">{{ item.label }}</span>
      <span
  v-if="item.meta"
  class="opacity-70 ml-2 shrink-0"
>
  {{ item.meta }}
</span>
    </div>
  </div>
</template>
