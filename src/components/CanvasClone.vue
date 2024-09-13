<template>
  <div class="canvas-container">
    <canvas
      ref="canvasClone"
      class="rounded-s canvas"
      width="568"
      height="435"
    >
    </canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const canvasClone = ref<HTMLCanvasElement | null>(null)
const context = ref<CanvasRenderingContext2D | null>(null)

const props = defineProps<{ state: ImageData }>()

watch(() => props.state, (val) => {
  const { x, y } = getCoordinates(val)
  context.value.strokeStyle = '#2E4FBF'
  context.value.lineWidth = 2
  context.value.beginPath()
  context.value.moveTo(lastX, lastY)
  context.value.lineTo(x, y)
  context.value.stroke()
  lastX = x
  lastY = y
}, {
  deep: true
})

onMounted(() => {
  if (canvasClone.value) {
    context.value = canvasClone.value.getContext('2d')
    if (context.value) {
      context.value.fillStyle = '#FFFFFF'
      context.value.fillRect(0, 0, 1080, 828)
    }
  }
})

</script>

<style scoped lang="scss">
.canvas-container {
  width: fit-content;
}
</style>
