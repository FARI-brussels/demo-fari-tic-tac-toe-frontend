<template>
  <div class="img-container">
    <img class="img rounded-s" :src="props.state" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ state: ImageData }>()
</script>

<style scoped lang="scss">
.img-container {
  width: fit-content;
  img: {
    width: 568px;
    height: 435px;
  }
  .img {
    width: 568px;
    height: 435px;
  }
}
</style>
