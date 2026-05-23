import { reactive, ref } from 'vue'
import LAYERS from '../data/outfits.js'

// One entry per layer: active index + lock state
export const state = reactive(
  LAYERS.map((layer) => ({
    key: layer.key,
    label: layer.label,
    items: layer.items,
    activeIndex: Math.floor(layer.items.length / 2),
    locked: false
  }))
)

export const closetItems = ref([])
