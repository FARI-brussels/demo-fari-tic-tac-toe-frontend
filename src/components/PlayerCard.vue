<template>
  <div class="player-container border-color-blue-light" :class="{ active: $props.active }">
    <img v-if="$props.type === 'human'" src="`../assets/human.svg`" class="avatar" />
    <img v-if="$props.type === 'robot'" src="`../assets/robot.svg`" class="avatar" />

    <div class="stats">
      <h2 class="font-weight-bold">{{ $props.type }}</h2>
      <img src="../assets/x-icon.svg" class="icon" />
    </div>

    <div class="points-container">
      <transition-group name="scroll">
        <h2 class="points" :key="$props.points">{{ $props.points || 0 }}</h2>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '../types/Game'

defineProps<Player>()
</script>

<style scoped lang="scss">
.player-container {
  height: 109px;
  width: 276px;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 20px;
  align-items: center;
  justify-content: space-between;

  .avatar {
    width: 72px;
    height: 72px;
  }

  .stats {
    display: flex;
    flex-direction: column;

    h2 {
      font-weight: 600;
      text-transform: capitalize;
    }

    .icon {
      margin-top: 8px;
      width: 24px;
      height: 24px;
    }
  }

  .points-container {
    position: relative;
    overflow: hidden;
    text-align: end;
    width: 5rem;
    height: 7rem;
    cursor: default;
  }

  .points {
    margin-top: 0.5rem;
    font-size: 4rem;
    font-weight: 600;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
}

.active {
  border: 3px solid #64d8bf;
}

.scroll-enter-active,
.scroll-leave-active {
  transition:
    filter 0.4s,
    opacity 0.4s;
  // transition: transform 0.5s, filter 0.4s, opacity 0.4s ;
}

.scroll-enter-from {
  transform: translateY(100%);
  filter: blur(10px);
  opacity: 0;
}

.scroll-leave-to {
  transform: translateY(-100%);
  filter: blur(10px);
  opacity: 0;
}
</style>
