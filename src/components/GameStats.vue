<template>
  <div class="game-stats-container rounded container border-color-blue-light">
    <h1 class="title">Human vs Robot</h1>
    <div class="players">
      <PlayerCard v-bind="$props.human" />
      <PlayerCard v-bind="$props.robot" />
    </div>
    <!-- <div class="robot-vision-container bg-color-blue-light"></div> -->
  </div>
</template>

<script setup lang="ts">
import PlayerCard from './PlayerCard.vue'
import type { GameStats } from '../types/Game'

defineEmits(['startGame', 'restartGame', 'exitGame'])
defineProps<GameStats>()

</script>

<style scoped lang="scss">
.game-stats-container {
  height: 100%;
  width: 100%;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.players {
  display: flex;
  gap: 1rem;
}

.robot-vision-container {
  height: 20rem;
  border-radius: 20px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.title {
  margin-bottom: 3rem;
  font-weight: 900;
  font-size: 48px;
}
</style>
