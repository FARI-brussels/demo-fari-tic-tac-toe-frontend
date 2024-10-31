<template>
  <div ref="lottieContainer" class="lottie-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import lottie from 'lottie-web'

const props = defineProps<{
  animationData: Object
  loop?: boolean
  delay?: number
}>()

const lottieContainer = ref<HTMLElement | null>(null)

function init({ container, animationData }: { container: HTMLElement; animationData: Object }) {
  lottie.loadAnimation({
    container,
    renderer: 'canvas',
    loop: props.loop,
    autoplay: true,
    animationData
  })
}

onMounted(() => {
  const delay = props.delay ?? 200

  if (lottieContainer.value && props.animationData) {
    setTimeout(() => {
      init({
        container: lottieContainer.value,
        animationData: props.animationData
      })
    }, delay)
  }
})
</script>

<style scoped lang="scss">
.lottie-container {
  width: 276px;
  height: 247px;
}
</style>
