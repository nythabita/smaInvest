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
      flat ? 'bg-transparent' : 'bg-surface-container-lowest border border-outline-variant/30'
    ]"
  >
    <!-- Soft tint background derived from the item -->
    <div
      v-if="!flat"
      class="absolute inset-0 opacity-80"
      :style="{ background: `radial-gradient(120% 90% at 50% 0%, ${item.tint} 0%, transparent 60%)` }"
    ></div>

    <!-- The illustration -->
    <div :class="['absolute top-0 left-0 right-0 flex items-center justify-center p-4', !flat ? 'bottom-12' : 'bottom-0']">

      <!-- CAMERA IMAGE -->
      <img
        v-if="item.image"
        :src="item.image"
        alt="Captured outfit"
        class="max-w-full max-h-full object-contain object-center drop-shadow-sm"
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
          ? 'bg-primary text-on-primary border-primary'
          : 'bg-surface-container-high/80 text-on-surface-variant border-outline-variant/30'
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
