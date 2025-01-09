<template>
  <div class="canvas-container">
    <canvas
      ref="canvas"
      @mousedown="startDrawing"
      @mouseup="finishDrawing"
      @mouseleave="finishDrawing"
      @mousemove="draw"
      @touchstart.passive="startDrawing"
      @touchend.passive="finishDrawing"
      @touchcancel.passive="finishDrawing"
      @touchmove="drawTouch"
      class="rounded canvas"
      width="1080"
      height="828"
    >
    </canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const context = ref<CanvasRenderingContext2D | null>(null)

const emit = defineEmits(['updateGame'])

const props = defineProps<{ disabled?: boolean }>()

let isDrawing = false

let lastX: number | null = null
let lastY: number | null = null

const canvasStates = ref<ImageData[]>([])

function saveCanvasState() {
  if (context.value && canvas.value) {
    canvasStates.value.push(
      context.value.getImageData(0, 0, canvas.value.width, canvas.value.height)
    )
  }
}

function restoreCanvasState() {
  if (context.value && canvasStates.value.length > 0) {
    const lastState = canvasStates.value.pop()
    if (lastState) {
      context.value.putImageData(lastState, 0, 0)
    }
  }
}

function undo() {
  restoreCanvasState()
}

function clearCanvas() {
  if (context.value && canvas.value) {
    context.value.fillStyle = '#FFFFFF'
    context.value.fillRect(0, 0, canvas.value.width, canvas.value.height)
    canvasStates.value.length = 0
  }
}

onMounted(() => {
  if (canvas.value) {
    context.value = canvas.value.getContext('2d')
    if (context.value) {
      context.value.fillStyle = '#FFFFFF'
      context.value.fillRect(0, 0, 1080, 828)
    }
  }
})

function startDrawing(event: MouseEvent | TouchEvent) {
  if (props.disabled) return
  saveCanvasState()
  isDrawing = true
  const { x, y } = getCoordinates(event)
  lastX = x
  lastY = y
}

function draw(event: MouseEvent | TouchEvent) {
  if (!isDrawing || !context.value || lastX === null || lastY === null) return
  event.preventDefault()
  const { x, y } = getCoordinates(event)
  context.value.strokeStyle = '#2E4FBF'
  context.value.lineWidth = 5
  context.value.beginPath()
  context.value.moveTo(lastX, lastY)
  context.value.lineTo(x, y)
  context.value.stroke()
  lastX = x
  lastY = y
}

function drawTouch(event: TouchEvent) {
  event.preventDefault() // Prevent default touch action (scrolling, zooming, etc.)
  draw(event)
}

function getCoordinates(event: MouseEvent | TouchEvent) {
  const rect = canvas.value!.getBoundingClientRect()
  const clientX =
    'touches' in event && event.touches.length
      ? event.touches[0].clientX
      : (event as MouseEvent).clientX
  const clientY =
    'touches' in event && event.touches.length
      ? event.touches[0].clientY
      : (event as MouseEvent).clientY
  const x = clientX - rect.left
  const y = clientY - rect.top
  return { x, y }
}

function finishDrawing() {
  if (props.disabled) return
  isDrawing = false
  emit('updateGame', { x: lastX, y: lastY, symbol: 'X' })
  lastX = null
  lastY = null
}

defineExpose({
  canvas,
  undo,
  clearCanvas
})
</script>

<style scoped lang="scss">
.canvas-container {
  width: fit-content;
}
</style>
