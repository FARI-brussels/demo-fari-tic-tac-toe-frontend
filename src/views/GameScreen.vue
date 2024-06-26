<template>
    <div class="layout bg-color-blue">
      <div class="gameboard">
        <TicTacToeCanvas :disabled="!game.started" ref="gameBoard" />
  
        <div class="game-buttons">
          <FButtonIcon @click="undo" name="undo" color="red" :disabled="!game.human.active" />
          <FButtonIcon @click="endTurn" name="check" color="green" :disabled="!game.human.active" />
        </div>
  
          <FDropdown 
            @select="handleSelect" 
            name="menu" 
            color="blue"  
            location="top-left"
            :items="[
              { label: game.started ? 'Restart' : 'Start Game', value: 'start' },
              { label: 'Exit Game', value: 'exit' }
            ]"
            class="dropdown-button"
          />
  
      </div>
      <GameStats v-bind="game" :loading="true"/>
  
      <FSlideTransition :show="showError">
        <FContainer v-if="showError" class="dialog">
          <h1 class="title">Uh-ooh 🫢</h1>
          <p> Something went wrong, try again? </p>
          <FButton @click="() => (showError = false)" label="OK" color="green" />
        </FContainer>
      </FSlideTransition>
  
      <FSlideTransition :show="showWinner">
        <FContainer v-if="showWinner" class="dialog-winner">
          <h1 class="title color-primary"> The winner is: the {{ winner }} </h1>
          <p v-if="winner === 'robot'" class="text-winner"> Unfortunately, the robot won. You can always try again </p>
          <div class="trophy-container">
            <AnimationContainer :animation-data="animationData"/>
          </div>
  
          <div class="action-button-container">
            <FButton @click="() => (showWinner = false)" label="Close" outline type="secondary" />
            <FButton
              @click="startGame"
              label="Restart"
              type="primary"
            />
          </div>
        </FContainer>
      </FSlideTransition>
  
      <div class="backdrop" :class="{ 'backdrop-active': showError || showWinner }"></div>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { TicTacToeCanvas, GameStats, AnimationContainer } from '@/components'
  import { storeToRefs } from 'pinia'
  import { ref, watch } from 'vue'
  import { useGameStore } from '@/stores/game'
  import { FContainer, FButton, FButtonIcon, FSlideTransition, FDropdown } from 'fari-component-library'
  import animationData from '@/assets/trophy.json'

  const emit = defineEmits(['exit-game'])
  
  const showError = ref(false)
  const showWinner = ref(false)
  
  const { game, error, winner } = storeToRefs(useGameStore())
  const { drawGrid, resetState, playMove } = useGameStore()
  
  const gameBoard = ref()

  
  async function endTurn() {
    const image = gameBoard.value.canvas.toDataURL('image/png')
    await playMove(image)
  }
  
  function undo() {
    gameBoard.value?.undo()
    showError.value = false
  }
  
  async function startGame() {
    gameBoard.value.clearCanvas()
    await drawGrid()
  }
  
  async function handleSelect(value: string | number) {
    if(value === 'start') startGame();
    if(value === 'restart') startGame();
    if(value === 'exit')  { 
        resetState(); 
        emit('exit-game')
    }
  }
  
  watch(winner, (val) => {
    if (!val) return
    showWinner.value = true
  })
  
  watch(error, (val) => {
    if (!val) return
    showError.value = true
  })
  </script>
  
  <style scoped lang="scss">
  .layout {
    padding: 8rem 6.4rem;
    width: 100vw;
    height: 100vh;
    display: flex;
    gap: 2rem;
  }
  
  .backdrop {
    visibility: hidden;
    opacity: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(24, 62, 145, 0.4);
    backdrop-filter: blur(0);
    z-index: 1;
    transition: all 100ms;
  
    &-active {
      visibility: visible;
      opacity: 1;
      backdrop-filter: blur(2px);
      transition: all 300ms;
    }
  }
  
  .dialog, .dialog-winner {
    width: 810px;
    text-align: center;
    position: fixed;
    top: 35%;
    left: 30%;
    border-radius: 36px;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
    z-index: 2;
    .title {
      color: var(--F_Blue, #183e91);
      font-family: Inter;
      font-size: 48px;
      font-style: normal;
      font-weight: 900;
      line-height: 60px;
      letter-spacing: -0.96px;
      margin-bottom: 1.5rem;
    }
  }
  
  .dialog-winner {
    top: 25%;
  }
  
  
  p {
    color: black;
  }
  
  .gameboard {
    position: relative;
  }
  
  
  .game-buttons {
    display: flex;
    position: absolute;
    bottom: 2rem;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
  }
  
  .dropdown-button {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
  
  }
  
  .trophy-container {
    display: flex;
    justify-content: center;
  }
  
  .action-button-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .text-winner {
    font-size: 20px;
    margin-top: 1rem;
  }
  
  
  </style>
  