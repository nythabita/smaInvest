<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const videoRef = ref(null)
const canvasRef = ref(null)
const stream = ref(null)

// Camera device selection
const cameraDevices = ref([])
const selectedDeviceId = ref('')
const cameraError = ref('')

const emit = defineEmits(['capture'])

async function loadCameraDevices() {
  try {
    // Request permission first so labels are populated
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    tempStream.getTracks().forEach(t => t.stop())

    const devices = await navigator.mediaDevices.enumerateDevices()
    cameraDevices.value = devices.filter(d => d.kind === 'videoinput')

    if (cameraDevices.value.length > 0 && !selectedDeviceId.value) {
      selectedDeviceId.value = cameraDevices.value[0].deviceId
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
    startCamera()
  }
}

// Detect if selected camera is likely a front camera (for mirror effect)
function isFrontCamera() {
  const device = cameraDevices.value.find(d => d.deviceId === selectedDeviceId.value)
  if (!device) return false
  const label = (device.label || '').toLowerCase()
  return label.includes('front') || label.includes('user') || label.includes('facetime')
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
  if (isFrontCamera()) {
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
        class="rounded-xl w-full max-h-[45vh] aspect-[3/4] object-contain bg-black"
        :class="isFrontCamera() ? 'scale-x-[-1]' : ''"
      />

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