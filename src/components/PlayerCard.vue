<template>
  <div class="player-container border-color-blue-light" :class="{ active: $props.active }">
    <div v-if="$props.type === 'human'" class="avatar-container">
      <img src="../assets/human.svg" class="avatar" />
    </div>
    <div v-if="$props.type === 'robot'" class="avatar-container">
      <img src="../assets/robot.svg" class="avatar" />
      <div v-if="$props.active" class="loading-circle"></div>
    </div>

    <div class="stats">
      <h2 class="font-weight-bold">{{ $props.type }}</h2>
      <img v-if="$props.symbol === 'X'" src="../assets/x-icon.svg" class="icon" />
      <img v-if="$props.symbol === 'O'" src="../assets/o-icon.svg" class="icon" />
      <div v-else class="icon" />
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
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.player-container {
  height: 109px;
  width: 276px;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 20px;
  align-items: center;
  justify-content: space-between;

  .avatar-container {
    position: relative;
    width: 72px;
    height: 72px;

    .avatar {
      width: 100%;
      height: 100%;
    }

    .loading-circle {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 98%;
      border: 3px solid transparent;
      border-top: 4px dotted #64d8bf;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
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
