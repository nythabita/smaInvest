import { reactive, ref, computed } from 'vue'
import { collection, getDocs, doc, updateDoc, addDoc, query, where, serverTimestamp } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config.js'
import { db } from '../firebase/config.js'
import LAYERS from '../data/outfits.js'

// ─── Closet items (source of truth) ───
export const closetItems = ref(
  LAYERS.flatMap(layer => layer.items.map(item => ({
    ...item,
    category: layer.key,
    inSlider: true,
    isDefault: true  // mark built-in items so we don't save them to Firestore
  })))
)

// Track loading state
export const isLoadingCloset = ref(true) // Start as true to avoid empty flash
export const isClosetLoaded = ref(false)

let authListenerAttached = false

export function initClosetAuthListener() {
  if (authListenerAttached) return
  authListenerAttached = true

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadClosetFromFirestore(user.uid)
    } else {
      isLoadingCloset.value = false
      // Reset to defaults
      closetItems.value = LAYERS.flatMap(layer => layer.items.map(item => ({
        ...item,
        category: layer.key,
        inSlider: true,
        isDefault: true
      })))
      isClosetLoaded.value = false
    }
  })
}

// ─── Slider state ───
export const state = reactive(
  LAYERS.map((layer) => ({
    key: layer.key,
    label: layer.label,
    activeIndex: Math.floor(layer.items.length / 2),
    locked: false
  }))
)

// Dynamically derive slider items from closetItems
state.forEach(layer => {
  const itemsComputed = computed(() => closetItems.value.filter(i => i.category === layer.key && i.inSlider))
  Object.defineProperty(layer, 'items', {
    get() { return itemsComputed.value },
    enumerable: true
  })
})

// ─── Firestore helpers ───

/**
 * Load user's clothing items from Firestore and merge with defaults
 */
export async function loadClosetFromFirestore(userId) {
  if (!userId) return
  if (isClosetLoaded.value) {
    isLoadingCloset.value = false
    return
  }
  
  isLoadingCloset.value = true

  try {
    const q = query(collection(db, 'clothingItems'), where('userId', '==', userId))
    const snapshot = await getDocs(q)

    const firestoreItems = snapshot.docs.map(docSnap => ({
      id: docSnap.id,          // Firestore document ID
      firestoreId: docSnap.id, // keep a reference for updates
      label: docSnap.data().name,
      category: docSnap.data().category,
      image: docSnap.data().imageUrl,
      inSlider: docSnap.data().inSlider ?? true,
      meta: 'captured',
      tint: 'rgba(255,255,255,0.25)',
      createdAt: docSnap.data().createdAt,
      isDefault: false
    }))

    // Keep default items + add Firestore items (avoid duplicates by firestoreId)
    const defaults = closetItems.value.filter(i => i.isDefault)
    closetItems.value = [...defaults, ...firestoreItems]
    isClosetLoaded.value = true
  } catch (err) {
    console.error('Failed to load closet from Firestore:', err)
  } finally {
    isLoadingCloset.value = false
  }
}

/**
 * Save a new clothing item to Firestore
 * Returns the Firestore document ID
 */
export async function saveItemToFirestore(userId, item) {
  const docRef = await addDoc(collection(db, 'clothingItems'), {
    userId,
    name: item.label,
    category: item.category,
    imageUrl: item.image,
    inSlider: item.inSlider,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

/**
 * Update inSlider status in Firestore
 */
export async function updateSliderStatus(firestoreId, inSlider) {
  if (!firestoreId) return // skip default items
  const docRef = doc(db, 'clothingItems', firestoreId)
  await updateDoc(docRef, { inSlider })
}
