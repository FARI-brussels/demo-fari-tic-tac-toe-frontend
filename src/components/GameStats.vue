<template>
  <div class="game-stats-container rounded container border-color-blue-light">
    <h1 class="title">Human vs Robot</h1>
    <div class="players">
      <PlayerCard v-bind="$props.human" />
      <PlayerCard v-bind="$props.robot" />
    </div>
    <div class="robot-vision-container bg-color-blue-light">
      <canvas id="bboxCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">

import PlayerCard from './PlayerCard.vue';
import type { GameStats } from '../types/Game';
import { onMounted, onBeforeUnmount } from 'vue';

defineEmits(['startGame', 'restartGame', 'exitGame']);
defineProps<GameStats>();


let socket: WebSocket | null = null;
let reconnectInterval: number | null = null;

function connectWebSocket() {
  socket = new WebSocket('ws://0.0.0.0:8080');

  socket.onmessage = (event) => {
    // Parse the received JSON data
    console.log(event)
    const bboxes = JSON.parse(event.data);
    drawBoundingBoxes(bboxes);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed, attempting to reconnect...');
    if (!reconnectInterval) {
      reconnectInterval = window.setInterval(connectWebSocket, 5000); // Retry every 5 seconds
    }
  };

  socket.onopen = () => {
    console.log('WebSocket connection opened');
    if (reconnectInterval) {
      window.clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

onMounted(() => {
  connectWebSocket();
});

onBeforeUnmount(() => {
  if (socket) {
    socket.close();
  }
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
  }
});

// Function to draw bounding boxes (you need to implement this)
function drawBoundingBoxes(bboxes: Array<{ x1: number; y1: number; x2: number; y2: number; class: string; confidence: number }>) {
  const container = document.querySelector('.robot-vision-container');
  
  if (container) {
    container.innerHTML = ''; // Clear previous bounding boxes
    
    bboxes.forEach((bbox) => {
      const { x1, y1, x2, y2, class: cls, confidence } = bbox;

      // Create a div for the bounding box
      const box = document.createElement('div');
      box.style.position = 'absolute';
      box.style.border = '2px solid red';
      box.style.left = `${x1}px`;
      box.style.top = `${y1}px`;
      box.style.width = `${x2 - x1}px`;
      box.style.height = `${y2 - y1}px`;
      box.textContent = `${cls} (${confidence}%)`;
      box.style.color = 'white';
      box.style.fontSize = '12px';
      box.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

      container.appendChild(box);
    });
  }
}
</script>

<style scoped lang="scss">
.game-stats-container {
  height: 100%;
  width: 100%;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  user-select: none; 
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
