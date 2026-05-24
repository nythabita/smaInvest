<script>
let cachedDeviceId = ''
let cachedMirrored = false
</script>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const videoRef = ref(null)
const canvasRef = ref(null)
const stream = ref(null)

// Camera device selection
const cameraDevices = ref([])
const selectedDeviceId = ref(cachedDeviceId)
const cameraError = ref('')
const isMirrored = ref(cachedMirrored)

watch(selectedDeviceId, val => cachedDeviceId = val)
watch(isMirrored, val => cachedMirrored = val)

const emit = defineEmits(['capture'])

async function loadCameraDevices() {
  try {
    // Request permission first so labels are populated
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    tempStream.getTracks().forEach(t => t.stop())

    const devices = await navigator.mediaDevices.enumerateDevices()
    cameraDevices.value = devices.filter(d => d.kind === 'videoinput')

    if (cameraDevices.value.length > 0 && !selectedDeviceId.value) {
      // If no cached device is found/valid, default to first camera
      const deviceExists = cameraDevices.value.some(d => d.deviceId === cachedDeviceId)
      selectedDeviceId.value = deviceExists ? cachedDeviceId : cameraDevices.value[0].deviceId
    }
    cameraError.value = ''
  } catch (err) {
    console.error('Camera enumeration error:', err)
    if (err.name === 'NotAllowedError') {
      cameraError.value = 'Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda.'
    } else if (err.name === 'NotFoundError') {
      cameraError.value = 'Tidak ada kamera yang ditemukan di perangkat ini.'
    } else {
      cameraError.value = 'Gagal mengakses kamera. Pastikan kamera tersedia dan browser memiliki izin.'
    }
  }
}

async function startCamera() {
  stopCamera()
  cameraError.value = ''

  if (!selectedDeviceId.value) {
    cameraError.value = 'Tidak ada kamera yang dipilih.'
    return
  }

  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: selectedDeviceId.value } },
      audio: false
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
  } catch (err) {
    console.error('Camera start error:', err)
    if (err.name === 'NotAllowedError') {
      cameraError.value = 'Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda.'
    } else {
      cameraError.value = 'Gagal membuka kamera. Coba pilih kamera lain.'
    }
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
}

function onDeviceChange() {
  if (selectedDeviceId.value) {
    isMirrored.value = false // reset to default
    startCamera()
  }
}


function capturePhoto() {
  const video = videoRef.value
  const canvas = canvasRef.value

  if (!video || !canvas || !video.videoWidth) {
    console.error('Video/canvas not ready')
    return
  }

  const ctx = canvas.getContext('2d')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  ctx.save()
  if (isMirrored.value) {
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
  } else {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }
  ctx.restore()

  const imageData = canvas.toDataURL('image/png')
  emit('capture', imageData)
}



onMounted(() => {
  loadCameraDevices().then(() => {
    if (selectedDeviceId.value) startCamera()
  })
})

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">

    <!-- Camera error -->
    <div v-if="cameraError" class="w-full rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 text-center">
      {{ cameraError }}
    </div>

    <!-- Camera selector -->
    <div v-if="cameraDevices.length > 1" class="w-full">
      <select
        v-model="selectedDeviceId"
        @change="onDeviceChange"
        class="w-full px-4 py-3 rounded-xl border border-espresso/10 bg-white text-espresso text-sm outline-none focus:ring-2 focus:ring-tan appearance-none"
      >
        <option v-for="device in cameraDevices" :key="device.deviceId" :value="device.deviceId">
          {{ device.label || `Camera ${cameraDevices.indexOf(device) + 1}` }}
        </option>
      </select>
    </div>

    <!-- VIDEO / PREVIEW -->
    <div class="relative w-full flex justify-center">
      <!-- LIVE CAMERA -->
      <video
        ref="videoRef"
        autoplay
        playsinline
        class="rounded-xl w-full max-h-[45vh] aspect-[3/4] object-contain bg-black transition-transform duration-300"
        :class="isMirrored ? 'scale-x-[-1]' : ''"
      />

      <!-- Mirror Toggle Overlay -->
      <button
        @click="isMirrored = !isMirrored"
        class="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors"
        title="Toggle Mirror"
      >
        <svg v-if="isMirrored" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M15 4h4v16h-4"/><path d="M9 4H5v16h4"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"/><path d="M12 3v18"/><path d="M12 3l4 4"/><path d="M12 3l-4 4"/></svg>
      </button>

      <canvas ref="canvasRef" class="hidden"></canvas>
    </div>

    <!-- BUTTONS -->
    <div class="flex gap-3 w-full">
      <button
        @click="capturePhoto"
        :disabled="!!cameraError"
        class="flex-1 px-4 py-3 bg-espresso text-white rounded-full font-semibold disabled:opacity-50 transition"
      >
        Capture
      </button>
    </div>
  </div>
</template>