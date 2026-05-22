<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const videoRef = ref(null)
const canvasRef = ref(null)
const stream = ref(null)

const capturedImage = ref(null)

const isFrontCamera = ref(true)
const emit = defineEmits(['capture'])

async function startCamera() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: isFrontCamera.value ? 'user' : 'environment'
      },
      audio: false
    })

    videoRef.value.srcObject = stream.value
  } catch (err) {
    console.error('Camera error:', err)
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
}

function switchCamera() {
  stopCamera()
  isFrontCamera.value = !isFrontCamera.value
  startCamera()
}

function capturePhoto() {
  console.log('capture clicked')
  
  const video = videoRef.value
  const canvas = canvasRef.value
  
  // ✅ VALIDASI DULU
  if (!video || !canvas || !video.videoWidth) {
    console.error('❌ Video/canvas not ready')
    return
  }
  
  console.log('✅ Video ready:', video.videoWidth, 'x', video.videoHeight)
  
  const ctx = canvas.getContext('2d')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // FIX MIRROR
  ctx.save()
  if (isFrontCamera.value) {
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
  } else {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  }
  ctx.restore()

  // ✅ SEKARANG BARU LOG
  const imageData = canvas.toDataURL('image/png')
  console.log('✅ Image captured:', imageData.length, 'bytes')
  
  capturedImage.value = imageData
  console.log('✅ Emitted to parent')
}

function confirmPhoto() {
  emit('capture', capturedImage.value)
  capturedImage.value = null
}

function retakePhoto() {
  capturedImage.value = null
}

onMounted(() => {
  startCamera()
})

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- VIDEO -->
    <div class="relative">

  <!-- PREVIEW RESULT -->
  <img
    v-if="capturedImage"
    :src="capturedImage"
    class="rounded-xl w-[320px] h-[420px] object-cover"
  />

  <!-- LIVE CAMERA -->
  <video
    v-else
    ref="videoRef"
    autoplay
    playsinline
    class="rounded-xl w-[320px] h-[420px] object-cover bg-black"
    :class="isFrontCamera ? 'scale-x-[-1]' : ''"
  />

  <canvas ref="canvasRef" class="hidden"></canvas>
</div>

    <!-- BUTTONS -->
     <div class="flex gap-3">

  <!-- BEFORE CAPTURE -->
  <template v-if="!capturedImage">

    <button
      @click="capturePhoto"
      class="px-4 py-2 bg-espresso text-white rounded-full"
    >
      Capture
    </button>

    <button
      @click="switchCamera"
      class="px-4 py-2 bg-tan text-espresso rounded-full"
    >
      Switch Camera
    </button>

  </template>

  <!-- AFTER CAPTURE -->
  <template v-else>
    <button
      @click="retakePhoto"
      class="px-4 py-2 bg-gray-200 rounded-full"
    >
      Retake
    </button>

    <button
      @click="confirmPhoto"
      class="px-4 py-2 bg-espresso text-white rounded-full"
    >
      Use Photo
    </button>

  </template>

</div>
</div>
</template>