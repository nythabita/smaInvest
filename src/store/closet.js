import { reactive, ref, computed } from 'vue'
import { collection, getDocs, doc, updateDoc, addDoc, query, where, serverTimestamp, deleteDoc, orderBy } from 'firebase/firestore'
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

// ─── Saved Outfits ───
export const savedOutfits = ref([])
export const isLoadingOutfits = ref(false)
export const isOutfitsLoaded = ref(false)

let authListenerAttached = false

export function initClosetAuthListener() {
  if (authListenerAttached) return
  authListenerAttached = true

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadClosetFromFirestore(user.uid)
      loadSavedOutfitsFromFirestore(user.uid)
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
      
      savedOutfits.value = []
      isOutfitsLoaded.value = false
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
    const q = query(collection(db, 'closet'), where('userId', '==', userId))
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
  const docRef = await addDoc(collection(db, 'closet'), {
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
  const docRef = doc(db, 'closet', firestoreId)
  await updateDoc(docRef, { inSlider })
}

/**
 * Delete a clothing item from Firestore and local state
 */
export async function deleteItem(item) {
  const user = auth.currentUser
  if (!user) {
    console.error('User not logged in, cannot delete item')
    return
  }

  // 1. Remove from Firestore
  if (item.firestoreId) {
    const docRef = doc(db, 'closet', item.firestoreId)
    await deleteDoc(docRef)
  }

  // 2. Remove from local state
  const index = closetItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    closetItems.value.splice(index, 1)
  }

  // 3. Ensure slider bounds are safe
  const layer = state.find(l => l.key === item.category)
  if (layer && layer.activeIndex >= layer.items.length) {
    layer.activeIndex = Math.max(0, layer.items.length - 1)
  }
}

/**
 * Load user's saved outfits
 */
export async function loadSavedOutfitsFromFirestore(userId) {
  if (!userId) return
  if (isOutfitsLoaded.value) return
  
  isLoadingOutfits.value = true
  try {
    const q = query(
      collection(db, 'savedOutfits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    savedOutfits.value = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
    isOutfitsLoaded.value = true
  } catch (err) {
    console.error('Failed to load saved outfits:', err)
  } finally {
    isLoadingOutfits.value = false
  }
}

/**
 * Save current outfit combination
 */
export async function saveOutfitToFirestore(userId, customName, items) {
  const fallbackName = `Outfit ${savedOutfits.value.length + 1}`
  const name = customName.trim() || fallbackName
  
  // Store stripped-down versions of items to save space in Firestore
  const outfitItems = items.map(i => ({
    id: i.id || Date.now() + Math.random(), // fallback id
    label: i.label || "",
    category: i.category || "",
    image: i.image || "",
    svg: i.svg || ""
  }))

  const newOutfit = {
    userId: userId || "",
    name: name || "",
    items: outfitItems,
    createdAt: serverTimestamp()
  }

  const docRef = await addDoc(collection(db, 'savedOutfits'), newOutfit)
  
  // Update local state so it appears immediately
  const localOutfit = {
    ...newOutfit,
    id: docRef.id,
    createdAt: new Date() // approximate for UI sorting
  }
  savedOutfits.value.unshift(localOutfit)
  
  return docRef.id
}

/**
 * Delete a saved outfit from Firestore and local state
 */
export async function deleteOutfit(outfit) {
  const user = auth.currentUser
  if (!user) {
    console.error('User not logged in, cannot delete outfit')
    return
  }

  // 1. Remove from Firestore
  if (outfit.id) {
    const docRef = doc(db, 'savedOutfits', outfit.id)
    await deleteDoc(docRef)
  }

  // 2. Remove from local state
  const index = savedOutfits.value.findIndex(o => o.id === outfit.id)
  if (index !== -1) {
    savedOutfits.value.splice(index, 1)
  }
}

